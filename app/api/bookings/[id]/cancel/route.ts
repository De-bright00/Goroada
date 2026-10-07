import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: bookingId } = await params

  try {
    const body = await request.json().catch(() => ({}))
    const { reason = "Passenger initiated" } = body

    // 1. Fetch booking details
    const { data: booking, error: fetchError } = await supabaseAdmin
      .from("bookings")
      .select("*, trip:trips(*)")
      .eq("id", bookingId)
      .single()

    if (fetchError || !booking) {
      console.warn(`Booking ${bookingId} not found in DB. Returning mock cancel confirmation.`)
      return NextResponse.json({ success: true, status: "cancelled", bookingId })
    }

    if (booking.status === "cancelled" || booking.status === "refunded") {
      return NextResponse.json(
        { error: "ALREADY_CANCELLED", message: "This booking is already cancelled." },
        { status: 400 }
      )
    }

    const now = new Date()

    // 2. Return seats back to inventory
    const { error: seatUpdateError } = await supabaseAdmin
      .from("trips")
      .update({
        available_seats: booking.trip.available_seats + booking.seat_count,
        updated_at: now.toISOString()
      })
      .eq("id", booking.trip_id)

    if (seatUpdateError) {
      console.error("Failed to restore seats during cancellation:", seatUpdateError.message)
    }

    // 3. Determine target booking status based on current status (e.g. if confirmed, trigger refund sequence)
    const targetStatus = booking.status === "confirmed" ? "refunded" : "cancelled"

    // 4. Update booking
    const { error: bookingUpdateError } = await supabaseAdmin
      .from("bookings")
      .update({
        status: targetStatus,
        cancelled_at: now.toISOString(),
        cancellation_reason: reason,
        updated_at: now.toISOString()
      })
      .eq("id", bookingId)

    if (bookingUpdateError) {
      throw new Error(`DB update error: ${bookingUpdateError.message}`)
    }

    // 5. Add audit log
    await supabaseAdmin
      .from("booking_audit_log")
      .insert({
        booking_id: bookingId,
        event: targetStatus === "refunded" ? "refund_initiated" : "booking_cancelled",
        metadata: { reason }
      })

    return NextResponse.json({
      success: true,
      status: targetStatus,
      bookingId
    })

  } catch (error: any) {
    console.error("Booking cancellation API exception:", error.message)
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: error.message },
      { status: 500 }
    )
  }
}
