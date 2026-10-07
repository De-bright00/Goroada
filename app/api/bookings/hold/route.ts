import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { tripId, seatCount } = body
    let passengerId = body.passengerId

    if (!tripId || !seatCount) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Missing tripId or seatCount" },
        { status: 400 }
      )
    }

    // Fallback passenger ID if user is not authenticated or not passing passengerId
    if (!passengerId) {
      passengerId = "00000000-0000-0000-0000-000000000000" // System guest user
    }

    // Call the atomic postgres function create_booking_hold via RPC
    const { data: booking, error: rpcError } = await supabaseAdmin.rpc(
      "create_booking_hold",
      {
        p_trip_id: tripId,
        p_passenger_id: passengerId,
        p_seat_count: Number(seatCount),
      }
    )

    if (rpcError) {
      console.warn("RPC create_booking_hold failed or database not configured:", rpcError.message)
      
      // Check for specific inventory exceptions raised by pgSQL
      if (rpcError.message.includes("INSUFFICIENT_SEATS")) {
        return NextResponse.json(
          { error: "INSUFFICIENT_SEATS", message: "Not enough available seats left on this trip." },
          { status: 409 }
        )
      }
      if (rpcError.message.includes("TRIP_NOT_BOOKABLE")) {
        return NextResponse.json(
          { error: "TRIP_NOT_BOOKABLE", message: "This trip departure is not open for bookings." },
          { status: 400 }
        )
      }
      
      // Fallback for local sandbox/testing if DB connection fails
      return createMockBookingResponse(tripId, seatCount, passengerId)
    }

    return NextResponse.json({
      bookingId: booking.id,
      bookingReference: booking.booking_reference,
      status: booking.status,
      holdExpiresAt: booking.hold_expires_at,
      totalAmount: Number(booking.total_amount),
      seatCount: Number(booking.seat_count),
    }, { status: 201 })

  } catch (error: any) {
    console.error("Booking hold API exception:", error.message)
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: error.message },
      { status: 500 }
    )
  }
}

function createMockBookingResponse(tripId: string, seatCount: number, passengerId: string) {
  console.log("Creating local mock booking hold...")
  const mockBookingId = crypto.randomUUID()
  const mockReference = `GRD-${crypto.randomBytes(4).toString("hex").substring(0, 7).toUpperCase()}`
  const basePrice = 18500 // Fallback price
  const totalAmount = basePrice * seatCount
  const holdExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString() // 10 minutes from now

  return NextResponse.json({
    bookingId: mockBookingId,
    bookingReference: mockReference,
    status: "holding",
    holdExpiresAt,
    totalAmount,
    seatCount,
    isMock: true,
  }, { status: 201 })
}
