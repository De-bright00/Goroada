"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { CheckCircle, AlertTriangle, RefreshCw, MapPin, Calendar, User, QrCode } from "lucide-react"

export default function SuccessPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: bookingId } = use(params)
  const searchParams = useSearchParams()
  const router = useRouter()
  
  const mockRef = searchParams.get("mock_reference")
  const gateway = searchParams.get("gateway")

  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [pollingStatus, setPollingStatus] = useState<string>("payment_pending") // payment_pending, confirmed, expired, failed
  const [attempts, setAttempts] = useState(0)

  // 1. Sandbox simulation handler: triggers webhook bypass if redirected from mock checkout
  useEffect(() => {
    async function triggerMockWebhook() {
      if (mockRef && gateway) {
        console.log("Mock redirect detected. Triggering local webhook bypass...")
        try {
          const webhookUrl = `/api/webhooks/${gateway}`
          const res = await fetch(webhookUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-mock-bypass": "true"
            },
            body: JSON.stringify({
              event: "charge.success",
              data: {
                reference: mockRef,
                id: `mock-tx-${Date.now()}`
              }
            })
          })
          if (res.ok) {
            toast.success("Sandbox payment verified successfully!")
          } else {
            console.error("Webhook mock bypass failed status:", res.status)
          }
        } catch (err) {
          console.error("Webhook mock bypass failed:", err)
        }
      }
    }
    triggerMockWebhook()
  }, [mockRef, gateway])

  // 2. Poll booking status
  useEffect(() => {
    let intervalId: any

    async function checkStatus() {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`)
        if (res.ok) {
          const data = await res.json()
          setBooking(data)
          setPollingStatus(data.status)
          
          if (data.status === "confirmed") {
            setLoading(false)
            clearInterval(intervalId)
          } else if (data.status === "released" || data.status === "failed" || data.status === "cancelled" || data.status === "refunded") {
            setLoading(false)
            clearInterval(intervalId)
          }
        }
      } catch (err) {
        console.error("Polling error:", err)
      }
      
      setAttempts(prev => {
        // Stop polling after 12 attempts (2 minutes)
        if (prev >= 12) {
          clearInterval(intervalId)
          setLoading(false)
        }
        return prev + 1
      })
    }

    checkStatus() // check immediately
    intervalId = setInterval(checkStatus, 10000) // check every 10 seconds

    return () => clearInterval(intervalId)
  }, [bookingId])

  if (loading && pollingStatus === "payment_pending") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center py-12 px-4">
          <div className="text-center max-w-md space-y-6">
            <RefreshCw className="w-16 h-16 text-primary animate-spin mx-auto" />
            <h1 className="text-2xl font-bold text-secondary">Confirming Your Payment...</h1>
            <p className="text-muted-foreground text-sm">
              We are waiting for payment confirmation from the gateway. This will take a few moments. Do not refresh or close this tab.
            </p>
            {attempts > 1 && (
              <p className="text-xs text-muted-foreground/80 font-mono">
                Polling status (attempt {attempts}/12)
              </p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Handle failure states
  const isFailed = pollingStatus === "released" || pollingStatus === "failed" || pollingStatus === "cancelled" || pollingStatus === "refunded"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6 w-full">
          {/* Header depending on state */}
          {isFailed ? (
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-destructive/10 mx-auto mb-6 flex items-center justify-center">
                <AlertTriangle className="w-12 h-12 text-destructive" />
              </div>
              <h1 className="text-3xl font-bold text-secondary mb-2">
                Booking Expired / Cancelled
              </h1>
              <p className="text-muted-foreground">
                Your booking reference hold has expired or was cancelled before payment could confirm.
              </p>
            </div>
          ) : (
            <div className="text-center mb-8">
              <div className="w-24 h-24 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold text-secondary mb-2">
                Booking Confirmed!
              </h1>
              <p className="text-muted-foreground">
                Your trip has been booked successfully
              </p>
            </div>
          )}

          {/* Booking ID Reference */}
          {booking && (
            <div className={`rounded-xl p-4 mb-6 text-center ${isFailed ? "bg-muted" : "bg-primary/10"}`}>
              <p className="text-sm text-muted-foreground mb-1">Booking Reference</p>
              <p className={`text-xl font-bold font-mono ${isFailed ? "text-muted-foreground line-through" : "text-primary"}`}>
                {booking.bookingReference}
              </p>
            </div>
          )}

          {/* Trip Summary Card */}
          {booking && (
            <Card className="mb-6">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-secondary">
                      {booking.trip?.operator?.charAt(0) || "G"}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">{booking.trip?.operator || "Operator"}</p>
                    <p className="text-sm text-muted-foreground">
                      {booking.trip?.busType || "Bus Type"}
                    </p>
                  </div>
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.trip?.date}</span>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-primary mt-1" />
                    <div>
                      <p className="font-medium">
                        {booking.trip?.from} - {booking.trip?.departureTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-secondary mt-1" />
                    <div>
                      <p className="font-medium">{booking.trip?.to}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Passengers</p>
                      <p className="font-medium">{booking.seatCount} seats</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <QrCode className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <span className={`text-xs font-semibold capitalize px-2 py-0.5 rounded-full ${
                        booking.status === "confirmed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Amount</span>
                    <span className="text-primary">
                      &#8358;{booking.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!isFailed ? (
              <>
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/ticket/${bookingId}`}>
                    <QrCode className="w-4 h-4 mr-2" />
                    View Digital Ticket
                  </Link>
                </Button>
                <Button variant="outline" className="w-full" size="lg" asChild>
                  <Link href={`/tracking/${bookingId}`}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Track Trip
                  </Link>
                </Button>
              </>
            ) : (
              <Button className="w-full" size="lg" asChild>
                <Link href="/search">
                  Back to Search Trips
                </Link>
              </Button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
