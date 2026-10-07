"use client"

import { use, useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Wallet,
  Clock,
  MapPin,
  Shield,
  Star,
} from "lucide-react"

function PaymentContent({ id: bookingId }: { id: string }) {
  const router = useRouter()
  
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [gateway, setGateway] = useState<"paystack" | "flutterwave">("paystack")
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [expired, setExpired] = useState(false)

  // 1. Fetch booking details
  useEffect(() => {
    async function loadBooking() {
      try {
        setLoading(true)
        const res = await fetch(`/api/bookings/${bookingId}`)
        if (res.ok) {
          const data = await res.json()
          setBooking(data)
          
          if (data.status === "released" || data.status === "failed") {
            setExpired(true)
          } else if (data.status === "confirmed") {
            router.push(`/success/${bookingId}`)
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
        console.error("Payment load error:", err)
      } finally {
        setLoading(false)
      }
    }
    loadBooking()
  }, [bookingId, router])

  // 2. Timer countdown
  useEffect(() => {
    if (timeLeft === null || expired) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          setExpired(true)
          toast.error("Booking hold expired.")
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

  const handlePayment = async () => {
    if (expired) {
      toast.error("Booking hold expired. Please restart search.")
      return
    }

    try {
      setProcessing(true)
      
      const email = "passenger@goroada.com" // Default or retrieved passenger email
      const callbackUrl = `${window.location.origin}/success/${bookingId}`

      // Call payments initiation API
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          gateway,
          email,
          callbackUrl,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Failed to initiate payment. Please try again.")
        return
      }

      toast.success(`Redirecting to ${gateway === "paystack" ? "Paystack" : "Flutterwave"}...`)
      
      // Redirect passenger to checkout page
      window.location.href = data.authorizationUrl

    } catch (err) {
      console.error("Payment action error:", err)
      toast.error("An error occurred during payment setup.")
    } finally {
      setProcessing(false)
    }
  }

  if (loading || !booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const trip = booking.trip
  const total = booking.totalAmount

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-4 sm:mb-6" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {/* Expiry Clock Bar */}
          <div className={`mb-6 p-4 rounded-xl flex items-center justify-between border ${
            expired 
              ? "bg-destructive/10 border-destructive/20 text-destructive"
              : "bg-amber-500/10 border-amber-500/20 text-amber-600"
          }`}>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-sm">
                  {expired ? "Time limit exceeded" : "Pending Payment Hold"}
                </p>
                <p className="text-xs opacity-90">
                  {expired 
                    ? "Seats returned to inventory. Please re-book." 
                    : "Complete checkout before timer reaches zero to lock your seat."}
                </p>
              </div>
            </div>
            {timeLeft !== null && !expired && (
              <span className="font-mono font-bold text-lg bg-amber-500/20 px-3 py-1 rounded-lg">
                {formatTime(timeLeft)}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Select Payment Gateway</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={gateway}
                    onValueChange={(val: any) => setGateway(val)}
                    className="space-y-2 sm:space-y-3"
                  >
                    <div
                      className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        gateway === "paystack"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setGateway("paystack")}
                    >
                      <RadioGroupItem value="paystack" id="paystack" />
                      <CreditCard className="w-5 h-5 text-primary flex-shrink-0" />
                      <Label htmlFor="paystack" className="flex-1 cursor-pointer">
                        <span className="font-medium text-sm">Paystack (Recommended)</span>
                        <p className="text-xs text-muted-foreground">
                          Fast checkout using card, transfer, bank app, or USSD
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        gateway === "flutterwave"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setGateway("flutterwave")}
                    >
                      <RadioGroupItem value="flutterwave" id="flutterwave" />
                      <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <Label htmlFor="flutterwave" className="flex-1 cursor-pointer">
                        <span className="font-medium text-sm">Flutterwave</span>
                        <p className="text-xs text-muted-foreground">
                          Secure checkout with multiple card channels and transfers
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Confirm Pay Button */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Checkout Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Gateway selected</span>
                    <span className="capitalize font-semibold">{gateway}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-border pt-3">
                    <span className="text-muted-foreground">Amount in Naira</span>
                    <span className="font-bold">&#8358;{total.toLocaleString()}</span>
                  </div>

                  <Button
                    className="w-full mt-2"
                    size="lg"
                    onClick={handlePayment}
                    disabled={processing || expired}
                  >
                    {processing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Connecting gateway...
                      </>
                    ) : (
                      <>Pay &#8358;{total.toLocaleString()} via {gateway === "paystack" ? "Paystack" : "Flutterwave"}</>
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
                        {trip.operator?.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs sm:text-sm truncate">{trip.operator}</p>
                      <p className="text-xs text-muted-foreground font-mono">
                        Ref: {booking.bookingReference}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{trip.from}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{trip.to}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 sm:pt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{trip.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Departure</span>
                      <span className="font-medium">{trip.departureTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Seats</span>
                      <span className="font-medium">{booking.seatCount} seats</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 sm:pt-4">
                    <div className="flex justify-between font-semibold text-base sm:text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        &#8358;{total.toLocaleString()}
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

export default function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <PaymentContent id={id} />
    </Suspense>
  )
}
