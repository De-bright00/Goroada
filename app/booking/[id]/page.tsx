"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  AlertCircle,
} from "lucide-react"

const steps = [
  { id: 1, name: "Details" },
  { id: 2, name: "Payment" },
  { id: 3, name: "Confirmed" },
]

// Mock trip data
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
  const [currentStep, setCurrentStep] = useState(1)
  const [passengers, setPassengers] = useState(1)
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    emergencyName: "",
    emergencyPhone: "",
  })

  const trip = { ...mockTrip, id }
  const totalPrice = trip.price * passengers

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleContinue = () => {
    if (currentStep < 2) {
      router.push(`/payment/${id}?passengers=${passengers}&total=${totalPrice}`)
    }
  }

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
          <div className="mb-8">
            <nav aria-label="Progress">
              <ol className="flex items-center justify-center">
                {steps.map((step, index) => (
                  <li
                    key={step.id}
                    className={`flex items-center ${
                      index < steps.length - 1 ? "flex-1" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.id < currentStep
                            ? "bg-primary text-primary-foreground"
                            : step.id === currentStep
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.id < currentStep ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <span
                        className={`ml-3 text-sm font-medium ${
                          step.id <= currentStep
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${
                          step.id < currentStep ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Passenger Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Number of Passengers */}
                  <div className="space-y-2">
                    <Label>Number of Passengers</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setPassengers(Math.max(1, passengers - 1))
                        }
                        disabled={passengers <= 1}
                      >
                        -
                      </Button>
                      <span className="text-xl font-semibold w-8 text-center">
                        {passengers}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          setPassengers(
                            Math.min(trip.seatsAvailable, passengers + 1)
                          )
                        }
                        disabled={passengers >= trip.seatsAvailable}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {trip.seatsAvailable} seats available
                    </p>
                  </div>

                  {/* Primary Passenger */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <User className="w-4 h-4 text-primary" />
                      Primary Passenger
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          placeholder="Enter full name"
                          value={formData.fullName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            placeholder="08012345678"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-primary" />
                      Emergency Contact (Optional)
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="emergencyName">Contact Name</Label>
                        <Input
                          id="emergencyName"
                          name="emergencyName"
                          placeholder="Enter contact name"
                          value={formData.emergencyName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="emergencyPhone">Contact Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="emergencyPhone"
                            name="emergencyPhone"
                            placeholder="08012345678"
                            value={formData.emergencyPhone}
                            onChange={handleInputChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full" size="lg" onClick={handleContinue}>
                    Continue to Payment
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Trip Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Trip Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <span className="text-sm font-bold text-secondary">
                        {trip.operator.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{trip.operator}</p>
                      <p className="text-sm text-muted-foreground">
                        {trip.busType}
                      </p>
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

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{trip.duration}</span>
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
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Passengers</span>
                      <span className="font-medium">{passengers}</span>
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
