import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { originCity, originState, destinationCity, destinationState, distanceKm = 650, typicalDurationMinutes = 510 } = body

    if (!originCity || !originState || !destinationCity || !destinationState) {
      return NextResponse.json(
        { error: "BAD_REQUEST", message: "Origin and Destination city and state are required" },
        { status: 400 }
      )
    }

    if (supabaseAdmin) {
      const { data: route, error: insertError } = await supabaseAdmin
        .from("routes")
        .insert({
          origin_city: originCity,
          origin_state: originState,
          destination_city: destinationCity,
          destination_state: destinationState,
          distance_km: Number(distanceKm),
          typical_duration_minutes: Number(typicalDurationMinutes)
        })
        .select()
        .single()

      if (!insertError && route) {
        return NextResponse.json({ success: true, route })
      }
      
      console.warn("Supabase route insert failed, using mock response:", insertError?.message)
    }

    const mockRoute = {
      id: crypto.randomUUID(),
      origin_city: originCity,
      origin_state: originState,
      destination_city: destinationCity,
      destination_state: destinationState,
      distance_km: Number(distanceKm),
      typical_duration_minutes: Number(typicalDurationMinutes),
      created_at: new Date().toISOString()
    }

    return NextResponse.json({ success: true, route: mockRoute, isMock: true })

  } catch (error: any) {
    console.error("Create route API error:", error.message)
    return NextResponse.json({ error: "INTERNAL_ERROR", message: error.message }, { status: 500 })
  }
}
