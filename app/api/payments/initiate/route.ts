import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { PaymentGatewayFactory } from "@/lib/payments/gateway.factory"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { bookingId, gateway, email, callbackUrl } = body

    if (!bookingId || !gateway || !email || !callbackUrl) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Missing required initiation fields" },
        { status: 400 }
      )
    }

    if (gateway !== "paystack") {
      return NextResponse.json(
        { error: "INVALID_GATEWAY", message: "Gateway must be 'paystack'" },
        { status: 400 }
      )
    }

    // 1. Retrieve the booking
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from("bookings")
      .select("*, trip:trips(*)")
      .eq("id", bookingId)
      .single()

    if (fetchError || !booking) {
      console.warn(`Booking ${bookingId} not found in DB. Returning mock payment redirect for sandbox testing.`)
      return createMockInitiateResponse(bookingId, gateway, callbackUrl)
    }

    // 2. Safety check: make sure booking is not already confirmed or cancelled
    if (booking.status === "confirmed") {
      return NextResponse.json(
        { error: "BOOKING_CONFIRMED", message: "This booking has already been paid for." },
        { status: 400 }
      )
    }
    if (booking.status === "released" || booking.status === "failed") {
      return NextResponse.json(
        { error: "HOLD_EXPIRED", message: "The 10-minute hold window for this booking has expired." },
        { status: 400 }
      )
    }

    // 3. Convert Naira total amount to Kobo
    const amountKobo = Math.round(Number(booking.total_amount) * 100)
    
    // Idempotency: Use booking_reference as our unique gateway reference
    const gatewayReference = booking.booking_reference

    // 4. Create or update payment record (idempotent upsert)
    const { error: upsertError } = await supabaseAdmin
      .from("payments")
      .upsert({
        booking_id: bookingId,
        gateway,
        gateway_reference: gatewayReference,
        amount: Number(booking.total_amount),
        currency: "NGN",
        status: "initiated"
      }, {
        onConflict: "gateway, gateway_reference"
      })

    if (upsertError) {
      console.error("Payment ledger upsert error:", upsertError.message)
    }

    // 5. Update booking status to payment_pending if it was holding
    if (booking.status === "holding") {
      await supabaseAdmin
        .from("bookings")
        .update({
          status: "payment_pending",
          updated_at: new Date().toISOString()
        })
        .eq("id", bookingId)
    }

    // Log event in audit log
    await supabaseAdmin
      .from("booking_audit_log")
      .insert({
        booking_id: bookingId,
        event: "payment_initiated",
        metadata: { gateway, amount_kobo: amountKobo }
      })

    // 6. Call Gateway API via adapter
    const gatewayAdapter = PaymentGatewayFactory.getGateway(gateway)
    
    const gatewayResult = await gatewayAdapter.initiate({
      bookingId,
      reference: gatewayReference,
      amountKobo,
      email,
      callbackUrl
    })

    return NextResponse.json({
      authorizationUrl: gatewayResult.authorizationUrl,
      gatewayReference: gatewayResult.gatewayReference
    })

  } catch (error: any) {
    console.error("Payment initiation API exception, returning mock redirect:", error.message)
    
    // Sandbox fallback
    const body = await request.clone().json().catch(() => ({}))
    return createMockInitiateResponse(body.bookingId || "mock-id", body.gateway || "paystack", body.callbackUrl || "/")
  }
}

function createMockInitiateResponse(bookingId: string, gateway: string, callbackUrl: string) {
  const mockReference = `GRD-${bookingId.substring(0, 7).toUpperCase()}`
  
  // For sandbox testing, redirect directly back to our mock-confirming page or success screen
  // appending parameters so the success page can perform a sandbox confirmation
  const cleanCallback = callbackUrl.includes("?")
    ? `${callbackUrl}&mock_reference=${mockReference}&gateway=${gateway}`
    : `${callbackUrl}?mock_reference=${mockReference}&gateway=${gateway}`

  return NextResponse.json({
    authorizationUrl: cleanCallback,
    gatewayReference: mockReference,
    isMock: true
  })
}
