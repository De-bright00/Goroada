"use client"

import { use, useEffect, useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Download, MapPin, Clock, Calendar, User, QrCode } from "lucide-react"

// Mock booking data
const mockBooking = {
  id: "GOR-2024041512345",
  tripId: "1",
  operator: "GUO Transport",
  from: "Lagos",
  to: "Abuja",
  fromTerminal: "Jibowu Terminal, Yaba",
  toTerminal: "Utako Terminal, Abuja",
  departureTime: "06:00",
  arrivalTime: "14:30",
  duration: "8h 30m",
  date: "Mon, 15 Apr 2024",
  passenger: "John Doe",
  seat: "A12",
  price: 18500,
  busType: "Executive Coach",
}

export default function SuccessPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [showConfetti, setShowConfetti] = useState(true)
  const booking = { ...mockBooking, tripId: id }

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-lg mx-auto px-4 sm:px-6 w-full">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div
              className={`w-24 h-24 rounded-full bg-green-100 mx-auto mb-6 flex items-center justify-center transition-transform duration-500 ${
                showConfetti ? "scale-110" : "scale-100"
              }`}
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-secondary mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-muted-foreground">
              Your trip has been booked successfully
            </p>
          </div>

          {/* Booking ID */}
          <div className="bg-primary/10 rounded-xl p-4 mb-6 text-center">
            <p className="text-sm text-muted-foreground mb-1">Booking ID</p>
            <p className="text-xl font-bold font-mono text-primary">
              {booking.id}
            </p>
          </div>

          {/* Trip Summary Card */}
          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-secondary">
                    {booking.operator.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold">{booking.operator}</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.busType}
                  </p>
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{booking.date}</span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-primary mt-1" />
                  <div>
                    <p className="font-medium">
                      {booking.from} - {booking.departureTime}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.fromTerminal}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{booking.duration}</span>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-secondary mt-1" />
                  <div>
                    <p className="font-medium">
                      {booking.to} - {booking.arrivalTime}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {booking.toTerminal}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Passenger</p>
                    <p className="font-medium">{booking.passenger}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Seat</p>
                    <p className="font-medium">{booking.seat}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Paid</span>
                  <span className="text-primary">
                    &#8358;{booking.price.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button className="w-full" size="lg" asChild>
              <Link href={`/ticket/${booking.id}`}>
                <QrCode className="w-4 h-4 mr-2" />
                View Digital Ticket
              </Link>
            </Button>

            <Button variant="outline" className="w-full" size="lg" asChild>
              <Link href={`/tracking/${booking.id}`}>
                <MapPin className="w-4 h-4 mr-2" />
                Track Trip
              </Link>
            </Button>

            <Button variant="ghost" className="w-full" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Download Receipt
            </Button>
          </div>

          {/* Info */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            A confirmation email and SMS have been sent to you with your ticket
            details.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
