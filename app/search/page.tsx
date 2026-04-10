"use client"

import { useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SearchBox } from "@/components/search-box"
import { TripCard, type TripData } from "@/components/trip-card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Filter, SlidersHorizontal } from "lucide-react"

// Mock data for trips
const mockTrips: TripData[] = [
  {
    id: "1",
    operator: "GUO Transport",
    from: "Lagos",
    to: "Abuja",
    fromTerminal: "Jibowu Terminal",
    toTerminal: "Utako Terminal",
    departureTime: "06:00",
    arrivalTime: "14:30",
    duration: "8h 30m",
    price: 18500,
    seatsAvailable: 12,
    rating: 4.5,
    totalReviews: 1250,
    isVerified: true,
    amenities: ["AC", "WiFi", "USB Charging", "Snacks"],
  },
  {
    id: "2",
    operator: "ABC Transport",
    from: "Lagos",
    to: "Abuja",
    fromTerminal: "Ojota Terminal",
    toTerminal: "Wuse Terminal",
    departureTime: "07:30",
    arrivalTime: "16:00",
    duration: "8h 30m",
    price: 22000,
    seatsAvailable: 8,
    rating: 4.7,
    totalReviews: 2100,
    isVerified: true,
    amenities: ["AC", "WiFi", "USB Charging", "Snacks", "Entertainment"],
  },
  {
    id: "3",
    operator: "Peace Mass Transit",
    from: "Lagos",
    to: "Abuja",
    fromTerminal: "Mile 2 Terminal",
    toTerminal: "Area 1 Terminal",
    departureTime: "08:00",
    arrivalTime: "17:00",
    duration: "9h 00m",
    price: 15000,
    seatsAvailable: 20,
    rating: 4.2,
    totalReviews: 3500,
    isVerified: true,
    amenities: ["AC", "USB Charging"],
  },
  {
    id: "4",
    operator: "Chisco Transport",
    from: "Lagos",
    to: "Abuja",
    fromTerminal: "Ajah Terminal",
    toTerminal: "Garki Terminal",
    departureTime: "09:00",
    arrivalTime: "17:30",
    duration: "8h 30m",
    price: 20000,
    seatsAvailable: 5,
    rating: 4.4,
    totalReviews: 890,
    isVerified: true,
    amenities: ["AC", "WiFi", "Snacks"],
  },
  {
    id: "5",
    operator: "Young Shall Grow Motors",
    from: "Lagos",
    to: "Abuja",
    fromTerminal: "Oshodi Terminal",
    toTerminal: "Central Area Terminal",
    departureTime: "10:00",
    arrivalTime: "19:00",
    duration: "9h 00m",
    price: 16500,
    seatsAvailable: 15,
    rating: 4.0,
    totalReviews: 2800,
    isVerified: true,
    amenities: ["AC"],
  },
]

const operators = [
  "GUO Transport",
  "ABC Transport",
  "Peace Mass Transit",
  "Chisco Transport",
  "Young Shall Grow Motors",
]

const timeSlots = [
  { label: "Morning (6AM - 12PM)", value: "morning" },
  { label: "Afternoon (12PM - 6PM)", value: "afternoon" },
  { label: "Evening (6PM - 12AM)", value: "evening" },
]

function FilterSidebar({
  priceRange,
  setPriceRange,
  selectedOperators,
  setSelectedOperators,
  selectedTimes,
  setSelectedTimes,
  minRating,
  setMinRating,
}: {
  priceRange: number[]
  setPriceRange: (value: number[]) => void
  selectedOperators: string[]
  setSelectedOperators: (value: string[]) => void
  selectedTimes: string[]
  setSelectedTimes: (value: string[]) => void
  minRating: number
  setMinRating: (value: number) => void
}) {
  const toggleOperator = (operator: string) => {
    setSelectedOperators(
      selectedOperators.includes(operator)
        ? selectedOperators.filter((o) => o !== operator)
        : [...selectedOperators, operator]
    )
  }

  const toggleTime = (time: string) => {
    setSelectedTimes(
      selectedTimes.includes(time)
        ? selectedTimes.filter((t) => t !== time)
        : [...selectedTimes, time]
    )
  }

  return (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Price Range</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          max={50000}
          min={5000}
          step={1000}
          className="mb-2"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>&#8358;{priceRange[0].toLocaleString()}</span>
          <span>&#8358;{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Time of Day */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Departure Time</h3>
        <div className="space-y-3">
          {timeSlots.map((slot) => (
            <div key={slot.value} className="flex items-center gap-2">
              <Checkbox
                id={slot.value}
                checked={selectedTimes.includes(slot.value)}
                onCheckedChange={() => toggleTime(slot.value)}
              />
              <Label htmlFor={slot.value} className="text-sm font-normal">
                {slot.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Operators */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Operators</h3>
        <div className="space-y-3">
          {operators.map((operator) => (
            <div key={operator} className="flex items-center gap-2">
              <Checkbox
                id={operator}
                checked={selectedOperators.includes(operator)}
                onCheckedChange={() => toggleOperator(operator)}
              />
              <Label htmlFor={operator} className="text-sm font-normal">
                {operator}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="font-semibold text-foreground mb-4">Minimum Rating</h3>
        <div className="flex gap-2">
          {[0, 3, 3.5, 4, 4.5].map((rating) => (
            <Button
              key={rating}
              variant={minRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => setMinRating(rating)}
              className="flex-1"
            >
              {rating === 0 ? "Any" : `${rating}+`}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SearchContent() {
  const searchParams = useSearchParams()
  const from = searchParams.get("from") || "Lagos"
  const to = searchParams.get("to") || "Abuja"
  const date = searchParams.get("date") || ""
  const passengers = searchParams.get("passengers") || "1"

  const [priceRange, setPriceRange] = useState([5000, 50000])
  const [selectedOperators, setSelectedOperators] = useState<string[]>([])
  const [selectedTimes, setSelectedTimes] = useState<string[]>([])
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState("price")

  // Filter trips
  const filteredTrips = mockTrips
    .filter((trip) => {
      if (trip.price < priceRange[0] || trip.price > priceRange[1]) return false
      if (
        selectedOperators.length > 0 &&
        !selectedOperators.includes(trip.operator)
      )
        return false
      if (minRating > 0 && trip.rating < minRating) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === "price") return a.price - b.price
      if (sortBy === "rating") return b.rating - a.rating
      if (sortBy === "duration") {
        const aDuration = parseInt(a.duration.split("h")[0])
        const bDuration = parseInt(b.duration.split("h")[0])
        return aDuration - bDuration
      }
      return 0
    })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        {/* Search Bar */}
        <div className="bg-card border-b border-border py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <SearchBox
              variant="compact"
              defaultFrom={from}
              defaultTo={to}
              defaultDate={date}
              defaultPassengers={passengers}
            />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="bg-card rounded-xl p-6 border border-border sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-lg text-foreground">
                    Filters
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPriceRange([5000, 50000])
                      setSelectedOperators([])
                      setSelectedTimes([])
                      setMinRating(0)
                    }}
                  >
                    Reset
                  </Button>
                </div>
                <FilterSidebar
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  selectedOperators={selectedOperators}
                  setSelectedOperators={setSelectedOperators}
                  selectedTimes={selectedTimes}
                  setSelectedTimes={setSelectedTimes}
                  minRating={minRating}
                  setMinRating={setMinRating}
                />
              </div>
            </aside>

            {/* Results */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-secondary">
                    {from} to {to}
                  </h1>
                  <p className="text-muted-foreground">
                    {filteredTrips.length} trips found
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <Filter className="w-4 h-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterSidebar
                          priceRange={priceRange}
                          setPriceRange={setPriceRange}
                          selectedOperators={selectedOperators}
                          setSelectedOperators={setSelectedOperators}
                          selectedTimes={selectedTimes}
                          setSelectedTimes={setSelectedTimes}
                          minRating={minRating}
                          setMinRating={setMinRating}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* Sort */}
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-card border border-border rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="price">Price: Low to High</option>
                      <option value="rating">Rating: High to Low</option>
                      <option value="duration">Duration: Shortest</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Trip Cards */}
              <div className="space-y-4">
                {filteredTrips.length > 0 ? (
                  filteredTrips.map((trip) => (
                    <TripCard key={trip.id} trip={trip} />
                  ))
                ) : (
                  <div className="bg-card rounded-xl p-12 text-center border border-border">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                      <Filter className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      No trips found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search for a different route
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPriceRange([5000, 50000])
                        setSelectedOperators([])
                        setSelectedTimes([])
                        setMinRating(0)
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
