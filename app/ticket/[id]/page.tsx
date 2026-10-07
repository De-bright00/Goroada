"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { ArrowLeft, Download, Share2, MapPin, Clock, Calendar, User, Bus } from "lucide-react"

export default function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: bookingId } = use(params)
  
  const [booking, setBooking] = useState<any>(null)
  const [ticketData, setTicketData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTicket() {
      try {
        setLoading(true)
        // 1. Fetch booking details
        const bookingRes = await fetch(`/api/bookings/${bookingId}`)
        if (bookingRes.ok) {
          const bData = await bookingRes.json()
          setBooking(bData)
        }

        // 2. Fetch signed ticket URL
        const ticketRes = await fetch(`/api/bookings/${bookingId}/ticket`)
        if (ticketRes.ok) {
          const tData = await ticketRes.json()
          setTicketData(tData)
        } else {
          toast.error("Failed to load digital ticket download path.")
        }
      } catch (err) {
        console.error("Error loading ticket page data:", err)
      } finally {
        setLoading(false)
      }
    }
    loadTicket()
  }, [bookingId])

  const handleDownload = () => {
    if (ticketData?.pdfUrl) {
      toast.success("Downloading PDF Ticket...")
      window.open(ticketData.pdfUrl, "_blank")
    } else {
      toast.error("PDF ticket download URL is not ready.")
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Goroada Trip Ticket",
        text: `My intercity trip ticket with booking reference: ${booking?.bookingReference || bookingId}`,
        url: window.location.href,
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success("Ticket link copied to clipboard!")
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
  const passengerNames = booking.passengers?.map((p: any) => p.fullName).join(", ") || "Passenger"

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleDownload}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Digital Ticket */}
          <Card className="overflow-hidden">
            {/* Ticket Header */}
            <div className="bg-secondary p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <span className="text-lg font-bold">G</span>
                  </div>
                  <span className="font-semibold">Goroada</span>
                </div>
                <span className="text-sm opacity-80">Digital Ticket</span>
              </div>
              <div className="text-center">
                <p className="text-sm opacity-80 mb-1">Booking Reference</p>
                <p className="text-2xl font-bold font-mono">{booking.bookingReference}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-8 flex items-center justify-center border-b border-dashed border-border">
              <div className="w-48 h-48 bg-secondary/5 rounded-xl flex items-center justify-center">
                {/* Simulated QR Code representing Reference */}
                <div className="grid grid-cols-8 gap-1 p-4">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${
                        (i * 7 + 13) % 5 === 0 || (i * 3 + 17) % 4 === 0 ? "bg-secondary" : "bg-transparent"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Route */}
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">
                    {trip?.from?.substring(0, 3).toUpperCase() || "LOS"}
                  </p>
                  <p className="text-sm text-muted-foreground">{trip?.from || "Lagos"}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <Bus className="w-5 h-5 text-primary mb-1" />
                  <div className="w-full h-px bg-border relative">
                    <div className="absolute inset-0 border-t border-dashed border-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    Direct
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">
                    {trip?.to?.substring(0, 3).toUpperCase() || "ABV"}
                  </p>
                  <p className="text-sm text-muted-foreground">{trip?.to || "Abuja"}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Date
                  </p>
                  <p className="font-medium text-sm">{trip?.date || "Mon, 15 Apr"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Departure
                  </p>
                  <p className="font-medium text-sm">{trip?.departureTime || "06:00"}</p>
                </div>
                <div className="space-y-1 col-span-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Passengers
                  </p>
                  <p className="font-medium text-sm truncate">{passengerNames}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Seats Held</p>
                  <p className="font-bold text-lg text-primary">{booking.seatCount} seats</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Fare Paid</p>
                  <p className="font-bold text-sm text-secondary">&#8358;{booking.totalAmount?.toLocaleString()}</p>
                </div>
              </div>

              {/* Terminals */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Departure Terminal
                    </p>
                    <p className="text-sm font-medium">{trip?.fromTerminal || "Jibowu Terminal, Yaba"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Arrival Terminal
                    </p>
                    <p className="text-sm font-medium">{trip?.toTerminal || "Utako Terminal, Abuja"}</p>
                  </div>
                </div>
              </div>

              {/* Operator Info */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{trip?.operator || "Operator"}</p>
                    <p className="text-sm text-muted-foreground">
                      {trip?.busType || "Executive Coach"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Download PDF button */}
          <Button className="w-full mt-4" size="lg" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF Ticket
          </Button>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <h3 className="font-semibold mb-2">Important</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Please arrive at the terminal 30 minutes before departure.</li>
              <li>• Present this digital reference code or PDF at the terminal for check-in.</li>
              <li>• Keep a screenshot or download of this ticket offline for quick boarding.</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
