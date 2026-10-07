"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  ArrowLeft,
  Check,
  MapPin,
  User,
  Phone,
  Mail,
  AlertCircle,
  Clock,
} from "lucide-react"

const steps = [
  { id: 1, name: "Details" },
  { id: 2, name: "Terms" },
  { id: 3, name: "Payment" },
  { id: 4, name: "Confirmed" },
]

// Mock trip fallback data
const mockTrip = {
  id: "1",
  operator: "GUO Transport",
  from: "Lagos",
  to: "Abuja",
  fromTerminal: "Jibowu Terminal, Yaba",
  toTerminal: "Utako Terminal, Abuja",
  departureTime: "06:00",
  arrivalTime: "14:30",
  duration: "8h 30m",
  date: "Mon, 15 Apr 2024",
  price: 18500,
  seatsAvailable: 12,
  busType: "Executive Coach",
}

export default function BookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  
  const [trip, setTrip] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [passengers, setPassengers] = useState(1)
  
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    emergencyName: "",
    emergencyPhone: "",
  })

  // Load trip details
  useEffect(() => {
    async function loadTrip() {
      try {
        setLoading(true)
        // Query our search API to fetch the trip
        const res = await fetch(`/api/trips/search?from=Lagos&to=Abuja`)
        if (res.ok) {
          const trips = await res.json()
          const matched = trips.find((t: any) => t.id === id)
          if (matched) {
            setTrip(matched)
            return
          }
        }
        // Fallback
        setTrip({ ...mockTrip, id })
      } catch (err) {
        console.error("Failed to load trip:", err)
        setTrip({ ...mockTrip, id })
      } finally {
        setLoading(false)
      }
    }
    loadTrip()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleContinue = async () => {
    // Validate inputs
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.email ||
      !formData.emergencyName ||
      !formData.emergencyPhone
    ) {
      toast.error("Please fill in all required fields including emergency contact.")
      return
    }

    try {
      setBookingLoading(true)
      
      // Step 1: Create atomic booking hold in DB
      const holdRes = await fetch("/api/bookings/hold", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tripId: id,
          seatCount: passengers,
        }),
      })

      const holdData = await holdRes.json()

      if (!holdRes.ok) {
        if (holdData.error === "INSUFFICIENT_SEATS") {
          toast.error("Insufficient seats available! Someone else might have booked the last seat.")
        } else {
          toast.error(holdData.message || "Failed to create booking hold.")
        }
        return
      }

      const { bookingId, totalAmount } = holdData

      // Step 2: Attach passenger details
      const passengerList = [{ fullName: formData.fullName, phone: formData.phone }]
      // Add placeholders for subsequent passengers if booking multiple seats
      for (let i = 2; i <= passengers; i++) {
        passengerList.push({
          fullName: `${formData.fullName} (Passenger ${i})`,
          phone: formData.phone,
        })
      }

      const passengerRes = await fetch(`/api/bookings/${bookingId}/passengers`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passengers: passengerList }),
      })

      if (!passengerRes.ok) {
        toast.warn("Could not save passenger list details, but hold is active.")
      }

      // Step 3: Redirect to terms page with booking ID
      toast.success("Seats held successfully! Complete payment in 10 minutes.")
      router.push(`/terms/${bookingId}?passengers=${passengers}&total=${totalAmount}`)

    } catch (err: any) {
      console.error("Booking proceed error:", err)
      toast.error("An error occurred during booking. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading || !trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const totalPrice = trip.price * passengers

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" asChild>
            <Link href={`/trip/${id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to trip details
            </Link>
          </Button>

          {/* Progress Steps */}
          <div className="mb-6 sm:mb-8 overflow-x-auto">
            <nav aria-label="Progress">
              <ol className="flex items-center justify-center gap-2 sm:gap-4 min-w-max">
                {steps.map((step, index) => (
                  <li key={step.id} className="flex items-center gap-2 sm:gap-4">
                    <div className="flex items-center gap-1 sm:gap-3 flex-shrink-0">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.id === 1
                            ? "bg-primary text-primary-foreground font-bold"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.id}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          step.id === 1 ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className="w-4 sm:w-8 h-0.5 bg-muted" />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Passenger Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  {/* Number of Passengers */}
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base">Number of Passengers</Label>
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPassengers(Math.max(1, passengers - 1))}
                        disabled={passengers <= 1}
                      >
                        -
                      </Button>
                      <span className="text-lg sm:text-xl font-semibold w-6 sm:w-8 text-center">
                        {passengers}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setPassengers(Math.min(trip.seatsAvailable, passengers + 1))
                        }
                        disabled={passengers >= trip.seatsAvailable}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {trip.seatsAvailable} seats available
                    </p>
                  </div>

                  {/* Primary Passenger */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                      <User className="w-4 h-4 text-primary flex-shrink-0" />
                      Primary Passenger
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName" className="text-xs sm:text-sm">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Enter full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="08012345678"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pl-10 text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs sm:text-sm">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10 text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      Emergency Contact *
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyName" className="text-xs sm:text-sm">Contact Name *</Label>
                        <Input
                          id="emergencyName"
                          name="emergencyName"
                          placeholder="Enter contact name"
                          value={formData.emergencyName}
                          onChange={handleInputChange}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone" className="text-xs sm:text-sm">Contact Phone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <Input
                            id="emergencyPhone"
                            name="emergencyPhone"
                            placeholder="07043543917"
                            value={formData.emergencyPhone}
                            onChange={handleInputChange}
                            className="pl-10 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleContinue} disabled={bookingLoading}>
                    {bookingLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Holding seats...
                      </>
                    ) : (
                      "Proceed"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Trip Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Trip Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 text-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-secondary">
                        {trip.operator.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs sm:text-sm truncate">{trip.operator}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {trip.busType}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        &#8358;{trip.price.toLocaleString()} x {passengers}
                      </span>
                      <span>&#8358;{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        &#8358;{totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-primary mt-1" />
                      <div>
                        <p className="font-medium">{trip.from}</p>
                        <p className="text-sm text-muted-foreground">
                          {trip.fromTerminal}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-secondary mt-1" />
                      <div>
                        <p className="font-medium">{trip.to}</p>
                        <p className="text-sm text-muted-foreground">
                          {trip.toTerminal}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{trip.date}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Departure</span>
                      <span className="font-medium">{trip.departureTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
