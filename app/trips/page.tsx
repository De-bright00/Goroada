"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Bus,
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Ticket,
  XCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

// Mock trips data
const mockTrips = {
  upcoming: [
    {
      id: "GRDA-001",
      from: "Lagos",
      to: "Abuja",
      date: "Apr 20, 2024",
      time: "08:00 AM",
      operator: "GUO Transport",
      price: 18500,
      status: "confirmed",
      seats: 2,
    },
    {
      id: "GRDA-002",
      from: "Abuja",
      to: "Kaduna",
      date: "May 2, 2024",
      time: "10:30 AM",
      operator: "ABC Transport",
      price: 4500,
      status: "confirmed",
      seats: 1,
    },
  ],
  completed: [
    {
      id: "GRDA-003",
      from: "Lagos",
      to: "Ibadan",
      date: "Mar 15, 2024",
      time: "06:00 AM",
      operator: "Peace Mass Transit",
      price: 3500,
      status: "completed",
      seats: 1,
    },
    {
      id: "GRDA-004",
      from: "Enugu",
      to: "Abuja",
      date: "Feb 28, 2024",
      time: "07:00 AM",
      operator: "Chisco Transport",
      price: 12000,
      status: "completed",
      seats: 2,
    },
    {
      id: "GRDA-005",
      from: "Lagos",
      to: "Port Harcourt",
      date: "Feb 10, 2024",
      time: "09:00 AM",
      operator: "GUO Transport",
      price: 15000,
      status: "completed",
      seats: 1,
    },
  ],
  cancelled: [
    {
      id: "GRDA-006",
      from: "Abuja",
      to: "Kano",
      date: "Jan 25, 2024",
      time: "08:00 AM",
      operator: "ABC Transport",
      price: 8000,
      status: "cancelled",
      seats: 1,
      reason: "Schedule change",
    },
  ],
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Confirmed
        </Badge>
      )
    case "completed":
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
          <CheckCircle className="w-3 h-3 mr-1" />
          Completed
        </Badge>
      )
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      )
    default:
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <AlertCircle className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      )
  }
}

interface Trip {
  id: string
  from: string
  to: string
  date: string
  time: string
  operator: string
  price: number
  status: string
  seats: number
  reason?: string
}

function TripCard({ trip, type }: { trip: Trip; type: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Route Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              {getStatusBadge(trip.status)}
              <span className="text-sm text-muted-foreground">
                Booking ID: {trip.id}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-semibold text-secondary">{trip.from}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="font-semibold text-secondary">{trip.to}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {trip.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {trip.time}
              </div>
              <div className="flex items-center gap-1">
                <Bus className="w-4 h-4" />
                {trip.operator}
              </div>
              <div className="flex items-center gap-1">
                <Ticket className="w-4 h-4" />
                {trip.seats} {trip.seats > 1 ? "seats" : "seat"}
              </div>
            </div>

            {trip.reason && (
              <p className="mt-2 text-sm text-red-600">
                Reason: {trip.reason}
              </p>
            )}
          </div>

          {/* Price & Actions */}
          <div className="flex flex-col items-end gap-3">
            <p className="text-xl font-bold text-secondary">
              &#8358;{trip.price.toLocaleString()}
            </p>

            {type === "upcoming" && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/ticket/${trip.id}`}>View Ticket</Link>
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Cancel
                </Button>
              </div>
            )}

            {type === "completed" && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/ticket/${trip.id}`}>View Ticket</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/search?from=${trip.from}&to=${trip.to}`}>
                    Book Again
                  </Link>
                </Button>
              </div>
            )}

            {type === "cancelled" && (
              <Button size="sm" asChild>
                <Link href={`/search?from=${trip.from}&to=${trip.to}`}>
                  Rebook
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState({ type }: { type: string }) {
  const messages = {
    upcoming: {
      icon: Calendar,
      title: "No upcoming trips",
      description: "You don't have any upcoming trips booked.",
      cta: "Book a Trip",
    },
    completed: {
      icon: CheckCircle,
      title: "No completed trips",
      description: "Your completed trips will appear here.",
      cta: "Book Your First Trip",
    },
    cancelled: {
      icon: XCircle,
      title: "No cancelled trips",
      description: "You haven't cancelled any trips.",
      cta: null,
    },
  }

  const content = messages[type as keyof typeof messages]

  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
        <content.icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-secondary mb-2">
        {content.title}
      </h3>
      <p className="text-muted-foreground mb-6">{content.description}</p>
      {content.cta && (
        <Button asChild>
          <Link href="/">{content.cta}</Link>
        </Button>
      )}
    </div>
  )
}

export default function TripsPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const tripCounts = {
    upcoming: mockTrips.upcoming.length,
    completed: mockTrips.completed.length,
    cancelled: mockTrips.cancelled.length,
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn userName="John" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary mb-2">My Trips</h1>
            <p className="text-muted-foreground">
              View and manage all your bookings in one place
            </p>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-700">
                  {tripCounts.upcoming}
                </p>
                <p className="text-sm text-green-600">Upcoming</p>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-700">
                  {tripCounts.completed}
                </p>
                <p className="text-sm text-blue-600">Completed</p>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-red-700">
                  {tripCounts.cancelled}
                </p>
                <p className="text-sm text-red-600">Cancelled</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="upcoming" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Upcoming
                {tripCounts.upcoming > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {tripCounts.upcoming}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Completed
                {tripCounts.completed > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {tripCounts.completed}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="flex items-center gap-2">
                <XCircle className="w-4 h-4" />
                Cancelled
                {tripCounts.cancelled > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {tripCounts.cancelled}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {mockTrips.upcoming.length > 0 ? (
                <div className="space-y-4">
                  {mockTrips.upcoming.map((trip) => (
                    <TripCard key={trip.id} trip={trip} type="upcoming" />
                  ))}
                </div>
              ) : (
                <EmptyState type="upcoming" />
              )}
            </TabsContent>

            <TabsContent value="completed">
              {mockTrips.completed.length > 0 ? (
                <div className="space-y-4">
                  {mockTrips.completed.map((trip) => (
                    <TripCard key={trip.id} trip={trip} type="completed" />
                  ))}
                </div>
              ) : (
                <EmptyState type="completed" />
              )}
            </TabsContent>

            <TabsContent value="cancelled">
              {mockTrips.cancelled.length > 0 ? (
                <div className="space-y-4">
                  {mockTrips.cancelled.map((trip) => (
                    <TripCard key={trip.id} trip={trip} type="cancelled" />
                  ))}
                </div>
              ) : (
                <EmptyState type="cancelled" />
              )}
            </TabsContent>
          </Tabs>

          {/* Quick Actions */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <h3 className="font-semibold text-secondary mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/">
                    <Bus className="w-4 h-4 mr-2" />
                    Book New Trip
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/wallet">
                    <Ticket className="w-4 h-4 mr-2" />
                    Manage Wallet
                  </Link>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <Link href="/help">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Get Help
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
