"use client"

import Link from "next/link"
import { MapPin, Star, Users, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface TripData {
  id: string
  operator: string
  operatorLogo?: string
  from: string
  to: string
  fromTerminal: string
  toTerminal: string
  departureTime: string
  price: number
  seatsAvailable: number
  rating: number
  totalReviews: number
  isVerified: boolean
  amenities?: string[]
}

interface TripCardProps {
  trip: TripData
}

export function TripCard({ trip }: TripCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Operator Info */}
          <div className="flex items-center gap-4 lg:w-48">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
              <span className="text-lg font-bold text-secondary">
                {trip.operator.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{trip.operator}</h3>
                {trip.isVerified && (
                  <Shield className="w-4 h-4 text-primary" />
                )}
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{trip.rating}</span>
                <span className="text-muted-foreground">
                  ({trip.totalReviews})
                </span>
              </div>
            </div>
          </div>

          {/* Route & Time */}
          <div className="flex-1">
            <div className="flex items-center gap-4">
              {/* Departure */}
              <div className="text-center">
                <p className="text-2xl font-bold text-foreground">
                  {trip.departureTime}
                </p>
                <p className="text-sm text-muted-foreground">{trip.from}</p>
                <p className="text-xs text-muted-foreground">
                  {trip.fromTerminal}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full flex items-center gap-2 my-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="flex-1 h-px bg-border relative">
                    <div className="absolute inset-0 border-t border-dashed border-muted-foreground" />
                  </div>
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                </div>
                <p className="text-xs text-muted-foreground">Direct</p>
              </div>

              {/* Destination */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">{trip.to}</p>
                <p className="text-xs text-muted-foreground">{trip.toTerminal}</p>
              </div>
            </div>
          </div>

          {/* Amenities - inline */}
          {trip.amenities && trip.amenities.length > 0 && (
            <div className="hidden lg:flex flex-wrap gap-1.5 max-w-48">
              {trip.amenities.slice(0, 4).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          )}

          {/* Price */}
          <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{trip.seatsAvailable} seats left</span>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">
                &#8358;{trip.price.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">per seat</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 lg:w-32">
            <Button asChild>
              <Link href={`/trip/${trip.id}`}>Book Trip</Link>
            </Button>
          </div>
        </div>

        {/* Amenities - mobile */}
        {trip.amenities && trip.amenities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2 lg:hidden">
            {trip.amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="text-xs">
                {amenity}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
