import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { PaymentGatewayFactory } from "@/lib/payments/gateway.factory"
import { generateTicketPDF } from "@/lib/tickets/pdf"

export async function POST(request: Request) {
  let rawBody = ""
  try {
    rawBody = await request.text()
    const signature = request.headers.get("x-paystack-signature") || ""

    const gateway = PaymentGatewayFactory.getGateway("paystack")

    // Verify webhook signature (with a bypass for development mode testing)
    const isDev = process.env.NODE_ENV === "development"
    const bypassHeader = request.headers.get("x-mock-bypass")
    const isSignatureValid = gateway.verifyWebhookSignature(rawBody, signature)

    if (!isSignatureValid && !(isDev && bypassHeader === "true")) {
      console.error("Paystack webhook signature verification failed.")
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })
    }

    const payload = JSON.parse(rawBody)
    const eventType = payload.event
    
    // We only process successful charge events
    if (eventType !== "charge.success") {
      console.log(`Paystack webhook received event type: ${eventType}, ignoring.`)
      return NextResponse.json({ received: true, status: "ignored" })
    }

    const data = payload.data
    const reference = data.reference // Matches our booking_reference

    console.log(`Processing successful Paystack payment webhook for reference: ${reference}`)

    // 1. Fetch the corresponding booking and payments row
    const { data: booking, error: bookingError } = await supabaseAdmin
      .from("bookings")
      .select(`
        *,
        trip:trips(
          *,
          route:routes(*),
          operator:operators(*)
        )
      `)
      .eq("booking_reference", reference)
      .single()

    if (bookingError || !booking) {
      console.error(`Booking not found for reference: ${reference}`)
      return NextResponse.json({ error: "BOOKING_NOT_FOUND" }, { status: 404 })
    }

    // 2. Idempotency: If booking is already confirmed, we are done
    if (booking.status === "confirmed") {
      console.log(`Booking reference ${reference} is already confirmed. Returning 200 (idempotent).`)
      return NextResponse.json({ success: true, message: "Booking already confirmed" })
    }

    // 3. Server-side re-verification (never trust webhook body alone)
    // In dev mode with bypass, we can mock verification results
    let verification: any
    if (isDev && bypassHeader === "true") {
      verification = {
        status: "successful",
        amountKobo: Math.round(Number(booking.total_amount) * 100),
        gatewayTransactionId: data.id ? String(data.id) : "mock-tx-12345",
        paidAt: new Date().toISOString()
      }
    } else {
      verification = await gateway.verify(reference)
    }

    const expectedAmountKobo = Math.round(Number(booking.total_amount) * 100)

    if (verification.status !== "successful" || verification.amountKobo < expectedAmountKobo) {
      console.error(`Payment verification failed. Status: ${verification.status}, Amount matches: ${verification.amountKobo === expectedAmountKobo}`)
      
      // Update payment record to failed
      await supabaseAdmin
        .from("payments")
        .update({
          status: "failed",
          raw_webhook_payload: payload,
          updated_at: new Date().toISOString()
        })
        .eq("gateway_reference", reference)
        .eq("gateway", "paystack")

      return NextResponse.json({ error: "VERIFICATION_FAILED" }, { status: 400 })
    }

    // 4. Update payments record to successful
    const { error: paymentUpdateError } = await supabaseAdmin
      .from("payments")
      .update({
        status: "successful",
        gateway_transaction_id: verification.gatewayTransactionId,
        raw_webhook_payload: payload,
        verified_at: verification.paidAt || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq("gateway_reference", reference)
      .eq("gateway", "paystack")

    if (paymentUpdateError) {
      console.warn("Could not update payments table directly, proceeding with booking confirm:", paymentUpdateError.message)
    }

    // 5. Update booking status to confirmed
    const { error: bookingUpdateError } = await supabaseAdmin
      .from("bookings")
      .update({
        status: "confirmed",
        confirmed_at: verification.paidAt || new Date().toISOString(),
        hold_expires_at: null, // Clear expiration clock
        updated_at: new Date().toISOString()
      })
      .eq("id", booking.id)

    if (bookingUpdateError) {
      console.error("Fatal: failed to confirm booking status:", bookingUpdateError.message)
      throw new Error(`Booking confirmation error: ${bookingUpdateError.message}`)
    }

    // Insert audit log event
    await supabaseAdmin
      .from("booking_audit_log")
      .insert({
        booking_id: booking.id,
        event: "payment_confirmed",
        metadata: { gateway: "paystack", transaction_id: verification.gatewayTransactionId }
      })

    // 6. Fetch passengers list for ticket generation
    const { data: passengers } = await supabaseAdmin
      .from("booking_passengers")
      .select("*")
      .eq("booking_id", booking.id)

    // 7. Generate PDF ticket and save to Supabase Storage
    const pdfPath = await generateTicketPDF(
      booking,
      booking.trip,
      booking.trip?.operator,
      booking.trip?.route,
      passengers || []
    )

    // 8. Insert ticket record
    const { error: ticketError } = await supabaseAdmin
      .from("tickets")
      .insert({
        booking_id: booking.id,
        pdf_url: pdfPath,
        issued_at: new Date().toISOString(),
        boarding_status: "not_boarded"
      })

    if (ticketError) {
      console.error("Failed to create ticket record in DB:", ticketError.message)
    } else {
      await supabaseAdmin
        .from("booking_audit_log")
        .insert({
          booking_id: booking.id,
          event: "ticket_issued",
          metadata: { pdf_url: pdfPath }
        })
    }

    // 9. Placeholder for Notification SMS/Email dispatch
    console.log(`Booking reference ${reference} fully confirmed and ticket issued!`)

    return NextResponse.json({ success: true, booking_reference: reference })

  } catch (error: any) {
    console.error("Paystack webhook general failure:", error.message)
    return NextResponse.json({ error: "INTERNAL_ERROR", message: error.message }, { status: 500 })
  }
}
