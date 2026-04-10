"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Clock,
  Calendar,
  QrCode,
  MoreVertical,
  XCircle,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Mock trips data
const mockTrips = {
  upcoming: [
    {
      id: "GOR-2024041512345",
      operator: "GUO Transport",
      from: "Lagos",
      to: "Abuja",
      fromTerminal: "Jibowu Terminal",
      toTerminal: "Utako Terminal",
      date: "Mon, 15 Apr 2024",
      departureTime: "06:00",
      seat: "A12",
      price: 18500,
      status: "confirmed",
    },
    {
      id: "GOR-2024042012346",
      operator: "ABC Transport",
      from: "Abuja",
      to: "Kaduna",
      fromTerminal: "Wuse Terminal",
      toTerminal: "Kaduna Central",
      date: "Sat, 20 Apr 2024",
      departureTime: "08:00",
      seat: "B5",
      price: 4500,
      status: "confirmed",
    },
  ],
  completed: [
    {
      id: "GOR-2024030112340",
      operator: "Peace Mass Transit",
      from: "Lagos",
      to: "Ibadan",
      fromTerminal: "Mile 2 Terminal",
      toTerminal: "Challenge Terminal",
      date: "Fri, 01 Mar 2024",
      departureTime: "10:00",
      seat: "C8",
      price: 3500,
      status: "completed",
    },
    {
      id: "GOR-2024021512339",
      operator: "GUO Transport",
      from: "Lagos",
      to: "Abuja",
      fromTerminal: "Jibowu Terminal",
      toTerminal: "Utako Terminal",
      date: "Thu, 15 Feb 2024",
      departureTime: "07:30",
      seat: "A3",
      price: 18000,
      status: "completed",
    },
  ],
  cancelled: [
    {
      id: "GOR-2024031012341",
      operator: "Chisco Transport",
      from: "Lagos",
      to: "Port Harcourt",
      fromTerminal: "Ajah Terminal",
      toTerminal: "Rumuokoro Terminal",
      date: "Sun, 10 Mar 2024",
      departureTime: "06:00",
      seat: "D2",
      price: 15000,
      status: "cancelled",
      refundStatus: "refunded",
    },
  ],
}

function TripCard({
  trip,
  type,
}: {
  trip: (typeof mockTrips.upcoming)[0] & { refundStatus?: string }
  type: "upcoming" | "completed" | "cancelled"
}) {
  const getStatusBadge = () => {
    switch (trip.status) {
      case "confirmed":
        return <Badge className="bg-green-500 text-white">Confirmed</Badge>
      case "completed":
        return <Badge variant="secondary">Completed</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return null
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Trip Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                <span className="text-sm font-bold text-secondary">
                  {trip.operator.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold">{trip.operator}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {trip.id}
                </p>
              </div>
              {getStatusBadge()}
            </div>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <div>
                  <p className="font-medium">{trip.from}</p>
                  <p className="text-xs text-muted-foreground">
                    {trip.fromTerminal}
                  </p>
                </div>
              </div>
              <div className="flex-1 h-px bg-border max-w-16" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-secondary" />
                <div>
                  <p className="font-medium">{trip.to}</p>
                  <p className="text-xs text-muted-foreground">
                    {trip.toTerminal}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{trip.date}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{trip.departureTime}</span>
              </div>
              <span>Seat: {trip.seat}</span>
            </div>

            {trip.refundStatus && (
              <p className="text-sm text-green-600 mt-2">
                Refund: {trip.refundStatus}
              </p>
            )}
          </div>

          {/* Price & Actions */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                &#8358;{trip.price.toLocaleString()}
              </p>
            </div>

            {type === "upcoming" && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/ticket/${trip.id}`}>
                    <QrCode className="w-4 h-4 mr-1" />
                    Ticket
                  </Link>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/tracking/${trip.id}`}>Track Trip</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/ticket/${trip.id}`}>View Ticket</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Cancel Booking
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {type === "completed" && (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/search?from=${trip.from}&to=${trip.to}`}>
                  Book Again
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function DashboardContent() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "upcoming"
  const [activeTab, setActiveTab] = useState(defaultTab)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn userName="John" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary mb-2">My Trips</h1>
            <p className="text-muted-foreground">
              Manage your upcoming, completed, and cancelled trips
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upcoming">
                Upcoming ({mockTrips.upcoming.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({mockTrips.completed.length})
              </TabsTrigger>
              <TabsTrigger value="cancelled">
                Cancelled ({mockTrips.cancelled.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {mockTrips.upcoming.length > 0 ? (
                mockTrips.upcoming.map((trip) => (
                  <TripCard key={trip.id} trip={trip} type="upcoming" />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No upcoming trips
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      You don&apos;t have any upcoming trips booked yet
                    </p>
                    <Button asChild>
                      <Link href="/">Book a Trip</Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {mockTrips.completed.length > 0 ? (
                mockTrips.completed.map((trip) => (
                  <TripCard key={trip.id} trip={trip} type="completed" />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No completed trips
                    </h3>
                    <p className="text-muted-foreground">
                      Your completed trips will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cancelled" className="space-y-4">
              {mockTrips.cancelled.length > 0 ? (
                mockTrips.cancelled.map((trip) => (
                  <TripCard key={trip.id} trip={trip} type="cancelled" />
                ))
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <XCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No cancelled trips
                    </h3>
                    <p className="text-muted-foreground">
                      You haven&apos;t cancelled any trips
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  )
}
