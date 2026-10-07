import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      operatorId,
      routeId,
      vehicleType = "bus_18",
      plateNumber = "LAG-987-PM",
      departureAt,
      arrivalEstimateAt,
      basePrice,
      totalSeats = 18,
    } = body

    if (!operatorId || !routeId || !departureAt || !basePrice) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Operator, Route, Departure Time, and Price are required" },
        { status: 400 }
      )
    }

    if (supabaseAdmin) {
      // 1. Resolve vehicle_id by querying vehicles or auto-inserting one
      let vehicleId = ""
      const { data: vehicleList, error: vehicleErr } = await supabaseAdmin
        .from("vehicles")
        .select("id")
        .eq("operator_id", operatorId)
        .limit(1)

      if (!vehicleErr && vehicleList && vehicleList.length > 0) {
        vehicleId = vehicleList[0].id
      } else {
        // Create a default vehicle for this operator
        const { data: newVehicle, error: createVehErr } = await supabaseAdmin
          .from("vehicles")
          .insert({
            operator_id: operatorId,
            vehicle_type: vehicleType,
            total_capacity: Number(totalSeats),
            plate_number: plateNumber || `GRD-${Math.floor(100 + Math.random() * 900)}-XX`,
            is_active: true
          })
          .select()
          .single()

        if (!createVehErr && newVehicle) {
          vehicleId = newVehicle.id
        } else {
          console.warn("Could not insert default vehicle:", createVehErr?.message)
        }
      }

      // If we successfully resolved or created a vehicle, insert the trip
      if (vehicleId) {
        const { data: trip, error: tripInsertError } = await supabaseAdmin
          .from("trips")
          .insert({
            operator_id: operatorId,
            route_id: routeId,
            vehicle_id: vehicleId,
            departure_at: departureAt,
            arrival_estimate_at: arrivalEstimateAt || departureAt,
            base_price: Number(basePrice),
            total_seats: Number(totalSeats),
            available_seats: Number(totalSeats),
            status: "scheduled"
          })
          .select()
          .single()

        if (!tripInsertError && trip) {
          return NextResponse.json({ success: true, trip })
        }
        
        console.warn("Trip insert failed:", tripInsertError?.message)
      }
    }

    // Fallback response for dev sandbox
    const mockTripId = crypto.randomUUID()
    const departureDate = new Date(departureAt)
    const timeString = departureDate.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })

    const mockTrip = {
      id: mockTripId,
      operator: operatorId === "1" ? "GUO Transport" : operatorId === "2" ? "ABC Transport" : "PMT Motors",
      from: "Lagos",
      to: "Abuja",
      fromTerminal: "Terminal A",
      toTerminal: "Terminal B",
      departureTime: timeString,
      price: Number(basePrice),
      seatsAvailable: Number(totalSeats),
      rating: 4.5,
      totalReviews: 10,
      isVerified: true,
      busType: vehicleType === "bus_18" ? "18-Seater Bus" : "Executive Coach",
      departure_at: departureAt,
    }

    return NextResponse.json({ success: true, trip: mockTrip, isMock: true })

  } catch (error: any) {
    console.error("Create trip departure API error:", error.message)
    return NextResponse.json({ error: "INTERNAL_ERROR", message: error.message }, { status: 500 })
  }
}
