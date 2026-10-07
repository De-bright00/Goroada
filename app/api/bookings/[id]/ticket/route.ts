import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookingId } = await params

  try {
    // 1. Fetch booking status and ticket URL
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from("tickets")
      .select(`
        *,
        booking:bookings(status, booking_reference)
      `)
      .eq("booking_id", bookingId)
      .single()

    if (ticketError || !ticket) {
      console.warn(`Ticket not found in DB for booking ${bookingId}, using fallback signed URL.`)
      return NextResponse.json({
        pdfUrl: `https://goroada.com/fallback-tickets/ticket_${bookingId}.pdf`,
        bookingReference: `GRD-${bookingId.substring(0, 7).toUpperCase()}`,
        isMock: true
      })
    }

    if (ticket.booking?.status !== "confirmed") {
      return NextResponse.json(
        { error: "BOOKING_UNPAID", message: "Tickets can only be downloaded for confirmed bookings." },
        { status: 400 }
      )
    }

    const pdfUrlPath = ticket.pdf_url

    // 2. Handle local fallback mock paths vs real Supabase Storage paths
    if (pdfUrlPath.startsWith("local_fallback/")) {
      return NextResponse.json({
        pdfUrl: `https://goroada.com/fallback-tickets/${pdfUrlPath.replace("local_fallback/", "")}`,
        bookingReference: ticket.booking.booking_reference,
        isMock: true
      })
    }

    // 3. Create short-lived signed URL (valid for 5 minutes)
    const { data, error: signError } = await supabaseAdmin.storage
      .from("tickets")
      .createSignedUrl(pdfUrlPath, 300) // 300 seconds

    if (signError || !data?.signedUrl) {
      console.warn("Failed to create signed URL from Supabase Storage:", signError?.message)
      return NextResponse.json({
        pdfUrl: `https://goroada.com/fallback-tickets/ticket_${ticket.booking.booking_reference}.pdf`,
        bookingReference: ticket.booking.booking_reference,
        isMock: true
      })
    }

    return NextResponse.json({
      pdfUrl: data.signedUrl,
      bookingReference: ticket.booking.booking_reference
    })

  } catch (error: any) {
    console.error("Ticket URL retrieval exception:", error.message)
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: error.message },
      { status: 500 }
    )
  }
}
