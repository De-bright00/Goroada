"use client"

import { use } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  Circle,
  Bus,
  Phone,
} from "lucide-react"

// Mock tracking data
const mockTracking = {
  bookingId: "GOR-2024041512345",
  operator: "GUO Transport",
  busNumber: "GUO-1234",
  driverName: "Mr. Emmanuel Okonkwo",
  driverPhone: "08012345678",
  from: "Lagos",
  to: "Abuja",
  currentLocation: "Near Lokoja",
  estimatedArrival: "14:30",
  progress: 65,
  status: "departed",
  timeline: [
    {
      id: 1,
      title: "Booking Confirmed",
      description: "Your booking was confirmed",
      time: "Apr 14, 2024 - 10:30 AM",
      completed: true,
    },
    {
      id: 2,
      title: "Boarding",
      description: "Passenger boarded at Jibowu Terminal",
      time: "Apr 15, 2024 - 05:45 AM",
      completed: true,
    },
    {
      id: 3,
      title: "Departed",
      description: "Bus departed from Lagos",
      time: "Apr 15, 2024 - 06:00 AM",
      completed: true,
    },
    {
      id: 4,
      title: "In Transit",
      description: "Currently near Lokoja",
      time: "Apr 15, 2024 - 11:30 AM",
      completed: true,
      current: true,
    },
    {
      id: 5,
      title: "Arrived",
      description: "Expected arrival at Utako Terminal",
      time: "Est. Apr 15, 2024 - 02:30 PM",
      completed: false,
    },
  ],
}

export default function TrackingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const tracking = { ...mockTracking, bookingId: id || mockTracking.bookingId }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-blue-500"
      case "boarding":
        return "bg-yellow-500"
      case "departed":
        return "bg-green-500"
      case "arrived":
        return "bg-primary"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Badge
              className={`${getStatusColor(tracking.status)} text-white capitalize`}
            >
              {tracking.status}
            </Badge>
          </div>

          <div className="space-y-6">
            {/* Booking Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Booking ID</p>
                    <p className="font-bold font-mono">{tracking.bookingId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Est. Arrival
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {tracking.estimatedArrival}
                    </p>
                  </div>
                </div>

                {/* Route Progress */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{tracking.from}</span>
                    <span className="font-medium">{tracking.to}</span>
                  </div>
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-500"
                      style={{ width: `${tracking.progress}%` }}
                    />
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-primary rounded-full border-2 border-white shadow-lg transition-all duration-500 flex items-center justify-center"
                      style={{ left: `calc(${tracking.progress}% - 10px)` }}
                    >
                      <Bus className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>Currently: {tracking.currentLocation}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="h-64 bg-muted/50 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground">
                      Live map tracking coming soon
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Driver Info */}
            <Card>
              <CardHeader>
                <CardTitle>Driver Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                      <span className="text-lg font-bold text-secondary">
                        {tracking.driverName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{tracking.driverName}</p>
                      <p className="text-sm text-muted-foreground">
                        {tracking.operator} - {tracking.busNumber}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={`tel:${tracking.driverPhone}`}>
                      <Phone className="w-4 h-4 mr-2" />
                      Call Driver
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {tracking.timeline.map((event, index) => (
                    <div key={event.id} className="flex gap-4">
                      {/* Icon */}
                      <div className="relative">
                        {event.completed ? (
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              event.current
                                ? "bg-primary text-white"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {event.current ? (
                              <Bus className="w-4 h-4" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full border-2 border-muted flex items-center justify-center">
                            <Circle className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                        {/* Line */}
                        {index < tracking.timeline.length - 1 && (
                          <div
                            className={`absolute top-8 left-1/2 -translate-x-1/2 w-0.5 h-12 ${
                              event.completed ? "bg-green-200" : "bg-muted"
                            }`}
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2">
                          <p
                            className={`font-semibold ${
                              event.current ? "text-primary" : ""
                            }`}
                          >
                            {event.title}
                          </p>
                          {event.current && (
                            <Badge variant="secondary" className="text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {event.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
