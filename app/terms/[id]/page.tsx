"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
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
  FileText,
  Shield,
  CreditCard,
} from "lucide-react"

const steps = [
  { id: 1, name: "Details" },
  { id: 2, name: "Terms" },
  { id: 3, name: "Payment" },
  { id: 4, name: "Confirmed" },
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

const termsAndConditions = [
  {
    title: "Booking and Payment",
    content: "All bookings are subject to availability and confirmation. Payment must be made in full at the time of booking. Refunds are subject to our cancellation policy."
  },
  {
    title: "Travel Documents",
    content: "Passengers must carry valid identification documents. It is the passenger's responsibility to ensure they have all necessary travel documents."
  },
  {
    title: "Changes and Cancellations",
    content: "Changes to bookings may incur fees. Cancellations made within 24 hours of travel time are non-refundable. Changes are subject to availability."
  },
  {
    title: "Luggage Policy",
    content: "Each passenger is allowed one piece of hand luggage and one checked luggage item. Excess baggage may incur additional charges."
  },
  {
    title: "Health and Safety",
    content: "Passengers must comply with all health and safety regulations. Operators reserve the right to refuse travel to passengers who appear unwell."
  },
  {
    title: "Liability",
    content: "Goroad acts as a booking platform. The transportation operator is responsible for the actual travel service. Goroad's liability is limited to the booking fee."
  },
  {
    title: "Data Protection",
    content: "Your personal information will be used for booking and travel purposes only. We comply with Nigerian data protection regulations."
  },
  {
    title: "Force Majeure",
    content: "In case of unforeseen circumstances beyond our control (natural disasters, strikes, etc.), we reserve the right to cancel or reschedule trips."
  }
]

export default function TermsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const passengers = parseInt(searchParams.get("passengers") || "1")
  const totalPrice = parseInt(searchParams.get("total") || "0")

  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [currentStep, setCurrentStep] = useState(2)

  const trip = { ...mockTrip, id }

  const handleProceedToPayment = () => {
    if (acceptedTerms) {
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
            <Link href={`/booking/${id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to booking details
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
            {/* Terms and Conditions */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-primary" />
                    Terms and Conditions
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Please read and accept our terms and conditions to proceed with your booking.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="max-h-96 overflow-y-auto space-y-4 p-4 bg-muted/30 rounded-lg">
                    {termsAndConditions.map((term, index) => (
                      <div key={index} className="space-y-2">
                        <h4 className="font-semibold text-sm">{term.title}</h4>
                        <p className="text-sm text-muted-foreground">{term.content}</p>
                      </div>
                    ))}
                  </div>

                  {/* Acceptance Checkbox */}
                  <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <Checkbox
                      id="acceptTerms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      className="mt-1"
                    />
                    <div className="space-y-1">
                      <Label htmlFor="acceptTerms" className="text-sm font-medium cursor-pointer">
                        I agree to the Terms and Conditions *
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        By checking this box, you acknowledge that you have read, understood, and agree to be bound by our terms and conditions.
                      </p>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleProceedToPayment}
                    disabled={!acceptedTerms}
                  >
                    Proceed to Payment
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

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        &#8358;{trip.price.toLocaleString()} x {passengers}
                      </span>
                      <span className="font-medium">
                        &#8358;{(trip.price * passengers).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary">
                          &#8358;{totalPrice.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{trip.from} → {trip.to}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{trip.date} at {trip.departureTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="w-4 h-4 text-primary" />
                      <span>{passengers} passenger{passengers > 1 ? "s" : ""}</span>
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