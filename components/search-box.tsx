"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Calendar, Users, ArrowRight, ArrowLeftRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

const cities = [
  "Lagos",
  "Abuja",
  "Ibadan",
  "Kaduna",
  "Enugu",
  "Port Harcourt",
  "Kano",
  "Benin City",
  "Owerri",
  "Warri",
]

interface SearchBoxProps {
  variant?: "hero" | "compact"
  defaultFrom?: string
  defaultTo?: string
  defaultDate?: string
  defaultPassengers?: string
}

export function SearchBox({
  variant = "hero",
  defaultFrom = "",
  defaultTo = "",
  defaultDate = "",
  defaultPassengers = "1",
}: SearchBoxProps) {
  const router = useRouter()
  const [from, setFrom] = useState(defaultFrom)
  const [to, setTo] = useState(defaultTo)
  const [date, setDate] = useState(defaultDate)
  const [passengers, setPassengers] = useState(defaultPassengers)

  const handleSwap = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const handleSearch = () => {
    const params = new URLSearchParams({
      from,
      to,
      date,
      passengers,
    })
    router.push(`/search?${params.toString()}`)
  }

  if (variant === "compact") {
    return (
      <div className="bg-card rounded-xl shadow-lg p-4 border border-border">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[140px]">
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger className="bg-background">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="From" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleSwap}
            className="shrink-0"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>

          <div className="flex-1 min-w-[140px]">
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger className="bg-background">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="To" />
                </div>
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 min-w-[140px]">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          <div className="w-24">
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger className="bg-background">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSearch} className="shrink-0">
            Search
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card rounded-2xl shadow-xl p-6 md:p-8 border border-border">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* From */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            From
          </label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger className="h-12 bg-background">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <SelectValue placeholder="Departure city" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Swap Button (visible on larger screens) */}
        <div className="hidden lg:flex items-end justify-center pb-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
            className="rounded-full"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </Button>
        </div>

        {/* To */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">To</label>
          <Select value={to} onValueChange={setTo}>
            <SelectTrigger className="h-12 bg-background">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <SelectValue placeholder="Destination city" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Departure Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 pl-11 bg-background"
            />
          </div>
        </div>

        {/* Passengers */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Passengers
          </label>
          <Select value={passengers} onValueChange={setPassengers}>
            <SelectTrigger className="h-12 bg-background">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-primary" />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? "Passenger" : "Passengers"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Button */}
      <div className="mt-6">
        <Button
          onClick={handleSearch}
          size="lg"
          className="w-full md:w-auto md:px-12 h-12 text-base font-semibold"
        >
          Search Trips
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  )
}
