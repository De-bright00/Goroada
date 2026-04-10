"use client"

import { use } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Download, Share2, MapPin, Clock, Calendar, User, Bus } from "lucide-react"

// Mock ticket data
const mockTicket = {
  id: "GOR-2024041512345",
  operator: "GUO Transport",
  from: "Lagos",
  to: "Abuja",
  fromTerminal: "Jibowu Terminal, Yaba",
  toTerminal: "Utako Terminal, Abuja",
  departureTime: "06:00",
  arrivalTime: "14:30",
  duration: "8h 30m",
  date: "Monday, 15 April 2024",
  passenger: "John Doe",
  seat: "A12",
  busType: "Executive Coach",
  busNumber: "GUO-1234",
}

export default function TicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const ticket = { ...mockTicket, id: id || mockTicket.id }

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
              <Button variant="outline" size="icon">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="icon">
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
                <p className="text-2xl font-bold font-mono">{ticket.id}</p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-8 flex items-center justify-center border-b border-dashed border-border">
              <div className="w-48 h-48 bg-secondary/5 rounded-xl flex items-center justify-center">
                {/* Simulated QR Code */}
                <div className="grid grid-cols-8 gap-1 p-4">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-sm ${
                        Math.random() > 0.5 ? "bg-secondary" : "bg-transparent"
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
                    {ticket.from.substring(0, 3).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">{ticket.from}</p>
                </div>
                <div className="flex-1 flex flex-col items-center px-4">
                  <Bus className="w-5 h-5 text-primary mb-1" />
                  <div className="w-full h-px bg-border relative">
                    <div className="absolute inset-0 border-t border-dashed border-muted-foreground" />
                  </div>
                  <span className="text-xs text-muted-foreground mt-1">
                    {ticket.duration}
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-secondary">
                    {ticket.to.substring(0, 3).toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">{ticket.to}</p>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Date
                  </p>
                  <p className="font-medium text-sm">{ticket.date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Departure
                  </p>
                  <p className="font-medium text-sm">{ticket.departureTime}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <User className="w-3 h-3" />
                    Passenger
                  </p>
                  <p className="font-medium text-sm">{ticket.passenger}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Seat</p>
                  <p className="font-bold text-lg text-primary">{ticket.seat}</p>
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
                    <p className="text-sm font-medium">{ticket.fromTerminal}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-secondary mt-0.5" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Arrival Terminal
                    </p>
                    <p className="text-sm font-medium">{ticket.toTerminal}</p>
                  </div>
                </div>
              </div>

              {/* Operator Info */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{ticket.operator}</p>
                    <p className="text-sm text-muted-foreground">
                      {ticket.busType} - {ticket.busNumber}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <div className="mt-6 p-4 bg-muted/50 rounded-xl">
            <h3 className="font-semibold mb-2">Important</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>- Please arrive at the terminal 30 minutes before departure</li>
              <li>- Present this QR code at the terminal for boarding</li>
              <li>- Keep a screenshot of this ticket as backup</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
