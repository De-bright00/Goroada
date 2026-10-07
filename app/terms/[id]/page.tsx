"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  ArrowLeft,
  Check,
  Clock,
  MapPin,
  User,
  FileText,
} from "lucide-react"

const steps = [
  { id: 1, name: "Details" },
  { id: 2, name: "Terms" },
  { id: 3, name: "Payment" },
  { id: 4, name: "Confirmed" },
]

const termsAndConditions = [
  {
    title: "Booking and Payment",
    content: "All bookings are subject to availability and confirmation. Payment must be made in full within the 10-minute hold window. If unpaid, holds expire automatically."
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
]

export default function TermsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: bookingId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const passengers = parseInt(searchParams.get("passengers") || "1")

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number | null>(null) // seconds left
  const [expired, setExpired] = useState(false)

  // 1. Fetch booking details
  useEffect(() => {
    async function fetchBooking() {
      try {
        setLoading(true)
        const res = await fetch(`/api/bookings/${bookingId}`)
        if (res.ok) {
          const data = await res.json()
          setBooking(data)
          
          if (data.status === "released" || data.status === "failed") {
            setExpired(true)
          } else if (data.holdExpiresAt) {
            const expiry = new Date(data.holdExpiresAt).getTime()
            const diff = Math.max(0, Math.floor((expiry - Date.now()) / 1000))
            setTimeLeft(diff)
            if (diff <= 0) setExpired(true)
          }
        } else {
          toast.error("Failed to load booking details.")
        }
      } catch (err) {
        console.error("Error loading booking:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchBooking()
  }, [bookingId])

  // 2. Countdown Timer Effect
  useEffect(() => {
    if (timeLeft === null || expired) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          setExpired(true)
          toast.error("Your seat hold has expired. Please start booking again.")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeLeft, expired])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const handleProceedToPayment = () => {
    if (expired) {
      toast.error("Booking hold has expired. Please select the trip again.")
      return
    }
    if (acceptedTerms && booking) {
      router.push(`/payment/${bookingId}?passengers=${passengers}&total=${booking.totalAmount}`)
    }
  }

  if (loading || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const trip = booking.trip

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
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
                          step.id < 2
                            ? "bg-primary text-primary-foreground font-semibold"
                            : step.id === 2
                            ? "bg-primary text-primary-foreground font-bold"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.id < 2 ? <Check className="w-5 h-5" /> : step.id}
                      </div>
                      <span
                        className={`ml-3 text-sm font-medium ${
                          step.id <= 2 ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.name}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${
                          step.id < 2 ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          {/* Expiry / Countdown Timer Alert */}
          <div className={`mb-6 p-4 rounded-xl flex items-center justify-between border ${
            expired 
              ? "bg-destructive/10 border-destructive/20 text-destructive"
              : "bg-amber-500/10 border-amber-500/20 text-amber-600"
          }`}>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">
                  {expired ? "Hold Expired" : "Seat Hold Active"}
                </p>
                <p className="text-xs opacity-90">
                  {expired 
                    ? "Seats have been returned to inventory. Please search and book again." 
                    : "Complete terms agreement and payment before timer ends."}
                </p>
              </div>
            </div>
            {timeLeft !== null && !expired && (
              <span className="font-mono font-bold text-lg bg-amber-500/20 px-3 py-1 rounded-lg">
                {formatTime(timeLeft)}
              </span>
            )}
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
                        {term.title === "Luggage Policy" && (
                          <div className="grid grid-cols-2 gap-3 pt-1">
                            <figure className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-2 text-center">
                              <img
                                src="/images/luggage-allowed.jpg"
                                alt="Small carry-on suitcase and backpack - accepted free"
                                className="mx-auto w-full max-w-[120px] aspect-square object-contain rounded-md"
                                loading="lazy"
                              />
                              <figcaption className="mt-1.5 text-xs font-semibold text-emerald-600">
                                Small bags — Free
                              </figcaption>
                              <p className="text-[11px] leading-tight text-muted-foreground">
                                1 hand luggage + 1 small bag
                              </p>
                            </figure>
                            <figure className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-2 text-center">
                              <img
                                src="/images/luggage-extra-fee.jpg"
                                alt="Large or extra luggage - attracts extra fee"
                                className="mx-auto w-full max-w-[120px] aspect-square object-contain rounded-md"
                                loading="lazy"
                              />
                              <figcaption className="mt-1.5 text-xs font-semibold text-amber-600">
                                Large / extra — Extra fee
                              </figcaption>
                              <p className="text-[11px] leading-tight text-muted-foreground">
                                Oversized bags, sacks &amp; goods
                              </p>
                            </figure>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Acceptance Checkbox */}
                  <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <Checkbox
                      id="acceptTerms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      disabled={expired}
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
                    disabled={!acceptedTerms || expired}
                  >
                    {expired ? "Hold Expired" : "Proceed to Payment"}
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
                        {trip.operator?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{trip.operator}</p>
                      <p className="text-sm text-muted-foreground font-mono text-xs">
                        Ref: {booking.bookingReference}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        &#8358;{trip.price.toLocaleString()} x {passengers}
                      </span>
                      <span className="font-medium">
                        &#8358;{booking.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-border pt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary">
                          &#8358;{booking.totalAmount.toLocaleString()}
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