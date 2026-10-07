import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Mock fallback search results
const mockFallbackTrips = [
  {
    id: "1",
    operator: "GUO Transport",
    from: "Lagos",
    to: "Abuja",
    fromTerminal: "Jibowu Terminal, Yaba",
    toTerminal: "Utako Terminal, Abuja",
    departureTime: "06:00",
    price: 18500,
    seatsAvailable: 12,
    rating: 4.5,
    totalReviews: 1250,
    isVerified: true,
    amenities: ["AC", "WiFi", "USB Charging", "Snacks"],
    busType: "Executive Coach",
    departure_at: new Date().toISOString(),
  },
  {
    id: "2",
    operator: "ABC Transport",
    from: "Lagos",
    to: "Abuja",
    fromTerminal: "Ojota Terminal",
    toTerminal: "Wuse Terminal",
    departureTime: "07:30",
    price: 22000,
    seatsAvailable: 8,
    rating: 4.7,
    totalReviews: 2100,
    isVerified: true,
    amenities: ["AC", "WiFi", "USB Charging", "Snacks", "Entertainment"],
    busType: "Sienna Executive",
    departure_at: new Date().toISOString(),
  },
  {
    id: "3",
    operator: "Peace Mass Transit",
    from: "Lagos",
    to: "Abuja",
    fromTerminal: "Mile 2 Terminal",
    toTerminal: "Area 1 Terminal",
    departureTime: "08:00",
    price: 15000,
    seatsAvailable: 20,
    rating: 4.2,
    totalReviews: 3500,
    isVerified: true,
    amenities: ["AC", "USB Charging"],
    busType: "Standard Bus",
    departure_at: new Date().toISOString(),
  },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from")
  const to = searchParams.get("to")
  const date = searchParams.get("date")

  if (!from || !to) {
    return NextResponse.json({ error: "Missing origin (from) or destination (to)" }, { status: 400 })
  }

  try {
    // 1. Fetch matching route from routes table
    const { data: route, error: routeError } = await supabase
      .from("routes")
      .select("id")
      .eq("origin_city", from)
      .eq("destination_city", to)
      .single()

    if (routeError || !route) {
      console.warn("Route not found in DB, using mock search fallback.")
      return NextResponse.json(filterMockTrips(from, to))
    }

    // 2. Query scheduled trips on that route
    let query = supabase
      .from("trips")
      .select(`
        id,
        departure_at,
        base_price,
        total_seats,
        available_seats,
        status,
        operator:operators(name, logo_url, rating, is_verified),
        vehicle:vehicles(vehicle_type)
      `)
      .eq("route_id", route.id)
      .eq("status", "scheduled")

    // Filter by departure date if specified
    if (date) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      
      query = query
        .gte("departure_at", startOfDay.toISOString())
        .lte("departure_at", endOfDay.toISOString())
    }

    const { data: trips, error: tripsError } = await query

    if (tripsError || !trips || trips.length === 0) {
      console.warn("No trips found in DB or error occurred, using mock fallback.")
      return NextResponse.json(filterMockTrips(from, to))
    }

    // Format DB results to align with frontend schema
    const formattedTrips = trips.map((t: any) => {
      const departureDate = new Date(t.departure_at)
      const timeString = departureDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })

      return {
        id: t.id,
        operator: t.operator?.name || "Unknown Operator",
        operatorLogo: t.operator?.logo_url,
        from,
        to,
        fromTerminal: "Terminal A",
        toTerminal: "Terminal B",
        departureTime: timeString,
        price: Number(t.base_price),
        seatsAvailable: t.available_seats,
        rating: Number(t.operator?.rating || 4.0),
        totalReviews: 120,
        isVerified: t.operator?.is_verified || false,
        busType: t.vehicle?.vehicle_type || "Standard",
        amenities: ["AC", "USB Charging"],
        departure_at: t.departure_at,
      }
    })

    return NextResponse.json(formattedTrips)
  } catch (error: any) {
    console.error("Search API exception, using mock fallback:", error.message)
    return NextResponse.json(filterMockTrips(from, to))
  }
}

function filterMockTrips(from: string, to: string) {
  return mockFallbackTrips.map((t) => ({
    ...t,
    from,
    to,
  }))
}
