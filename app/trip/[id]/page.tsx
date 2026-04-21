"use client"

import { use } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  Shield,
  Users,
  Wifi,
  Zap,
  Wind,
  Tv,
  Coffee,
} from "lucide-react"

// Mock trip data
const mockTrip = {
  id: "1",
  operator: "GUO Transport",
  operatorLogo: null,
  operatorDescription:
    "GUO Transport is one of Nigeria's leading intercity bus operators with over 15 years of experience providing safe and comfortable travel services across the country.",
  from: "Lagos",
  to: "Abuja",
  fromTerminal: "Jibowu Terminal, Yaba",
  toTerminal: "Utako Terminal, Abuja",
  fromAddress: "123 Herbert Macaulay Way, Yaba, Lagos",
  toAddress: "Plot 456 Utako District, Abuja",
  departureTime: "06:00",
  price: 18500,
  seatsAvailable: 12,
  totalSeats: 40,
  rating: 4.5,
  totalReviews: 1250,
  isVerified: true,
  busType: "Executive Coach",
  amenities: [
    { name: "Air Conditioning", icon: Wind },
    { name: "WiFi", icon: Wifi },
    { name: "USB Charging", icon: Zap },
    { name: "Entertainment", icon: Tv },
    { name: "Snacks & Drinks", icon: Coffee },
  ],
  reviews: [],
}

export default function TripDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const trip = { ...mockTrip, id }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href="/search">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to results
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Operator Header */}
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 sm:justify-between">
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl sm:text-2xl font-bold text-secondary">
                          {trip.operator.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h1 className="text-lg sm:text-2xl font-bold text-foreground truncate">
                            {trip.operator}
                          </h1>
                          {trip.isVerified && (
                            <Badge
                              variant="secondary"
                              className="bg-primary/10 text-primary border-0 flex-shrink-0"
                            >
                              <Shield className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-semibold text-sm">{trip.rating}</span>
                          </div>
                          <span className="text-xs sm:text-sm text-muted-foreground">
                            ({trip.totalReviews} reviews)
                          </span>
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0 mt-2 sm:mt-0">
                      {trip.busType}
                    </Badge>
                  </div>

                  <p className="mt-4 text-xs sm:text-sm text-muted-foreground">
                    {trip.operatorDescription}
                  </p>
                </CardContent>
              </Card>

              {/* Route Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Route Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-6">
                    {/* Departure */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-1">
                          Departure
                        </p>
                        <p className="text-lg sm:text-xl font-bold mb-1">
                          {trip.departureTime}
                        </p>
                        <div className="space-y-1">
                          <p className="font-semibold">{trip.from}</p>
                          <p className="text-sm text-muted-foreground">
                            {trip.fromTerminal}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {trip.fromAddress}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Arrow - Centered */}
                    <div className="flex items-center justify-center py-2">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <ArrowLeft className="w-4 h-4 text-primary rotate-180" />
                        </div>
                        <div className="w-px h-6 bg-border my-2" />
                        <span className="text-xs text-muted-foreground">
                          Direct Route
                        </span>
                      </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <MapPin className="w-5 h-5 text-secondary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground mb-1">
                          Destination
                        </p>
                        <p className="text-lg sm:text-xl font-bold mb-1">
                          {trip.to}
                        </p>
                        <div className="space-y-1">
                          <p className="font-semibold">{trip.to}</p>
                          <p className="text-sm text-muted-foreground">
                            {trip.toTerminal}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {trip.toAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {trip.amenities.map((amenity) => (
                      <div
                        key={amenity.name}
                        className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/50"
                      >
                        <amenity.icon className="w-6 h-6 text-primary" />
                        <span className="text-sm text-center">
                          {amenity.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Booking Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-sm text-muted-foreground">Price per seat</p>
                    <p className="text-4xl font-bold text-primary">
                      &#8358;{trip.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Route</span>
                      <span className="font-medium">
                        {trip.from} - {trip.to}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Departure</span>
                      <span className="font-medium">{trip.departureTime}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border">
                      <span className="text-muted-foreground">Duration</span>
                      <span className="font-medium">{trip.duration}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-muted-foreground">Seats Available</span>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{trip.seatsAvailable}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full" size="lg" asChild>
                      <Link href={`/booking/${trip.id}`}>Book Trip</Link>
                    </Button>
                  </div>

                  <p className="text-xs text-center text-muted-foreground mt-4">
                    Free cancellation up to 24 hours before departure
                  </p>
                </CardContent>
              </Card>

              {/* Reviews */}
              <Card>
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-secondary mb-2">
                      No reviews yet
                    </h3>
                    <p className="text-muted-foreground">
                      Be the first to review this trip after your journey
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Card - Sticky Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                {/* Empty placeholder for desktop spacing */}
              </div>
            </div>
          </div>
        </div>
      </main>
                    
      <Footer />
    </div>
  )
}
