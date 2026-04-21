"use client"

import Link from "next/link"
import { MapPin, Star, Users, Shield, Clock } from "lucide-react"
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
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
          {/* Operator Info */}
          <div className="flex items-start gap-3 sm:gap-4 flex-shrink-0 sm:w-auto">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-bold text-secondary">
                {trip.operator.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground truncate">{trip.operator}</h3>
                {trip.isVerified && (
                  <Badge className="flex-shrink-0 bg-primary/10 text-primary border-0">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-sm mt-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                <span className="font-medium">{trip.rating}</span>
                <span className="text-muted-foreground">
                  ({trip.totalReviews})
                </span>
              </div>
            </div>
          </div>

          {/* Route & Time */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col xs:flex-row xs:items-start gap-3 xs:gap-4">
              {/* Departure */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-base sm:text-lg font-semibold text-foreground truncate">
                    {trip.departureTime}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground truncate">{trip.from}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {trip.fromTerminal}
                </p>
              </div>

              {/* Arrow */}
              <div className="flex items-center justify-center flex-shrink-0 py-1">
                <div className="flex flex-col items-center xs:hidden">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="h-4 w-px bg-border" />
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                </div>
                <div className="hidden xs:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-12 h-px bg-border" />
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                </div>
              </div>

              {/* Destination */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{trip.to}</p>
                <p className="text-xs text-muted-foreground truncate">{trip.toTerminal}</p>
              </div>
            </div>
          </div>

          {/* Amenities - inline */}
          {trip.amenities && trip.amenities.length > 0 && (
            <div className="hidden md:flex flex-wrap gap-1.5 max-w-48 flex-shrink-0">
              {trip.amenities.slice(0, 3).map((amenity) => (
                <Badge key={amenity} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
            </div>
          )}

          {/* Price & Seats */}
          <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
              <Users className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">{trip.seatsAvailable} seats</span>
              <span className="xs:hidden">{trip.seatsAvailable}</span>
            </div>
            <div className="text-right">
              <p className="text-xl sm:text-2xl font-bold text-primary">
                &#8358;{trip.price.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground hidden sm:block">per seat</p>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full sm:w-auto flex-shrink-0">
            <Button asChild className="w-full" size="sm">
              <Link href={`/trip/${trip.id}`}>Book</Link>
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
