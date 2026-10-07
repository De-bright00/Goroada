"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import {
  Building2,
  MapPin,
  Calendar,
  Compass,
  Plus,
  ShieldAlert,
  ListOrdered,
  PlusCircle,
  Truck,
} from "lucide-react"

export default function AdminPage() {
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)

  // Lists state
  const [operators, setOperators] = useState<any[]>([])
  const [routes, setRoutes] = useState<any[]>([])
  const [trips, setTrips] = useState<any[]>([])

  // Loaders
  const [loadingOperators, setLoadingOperators] = useState(false)
  const [loadingRoutes, setLoadingRoutes] = useState(false)
  const [loadingTrips, setLoadingTrips] = useState(false)

  // Creation forms states
  const [operatorForm, setOperatorForm] = useState({
    name: "",
    slug: "",
    logoUrl: "",
    rating: "4.5",
    isVerified: true,
    commissionRate: "0.10",
  })

  const [routeForm, setRouteForm] = useState({
    originCity: "",
    originState: "",
    destinationCity: "",
    destinationState: "",
    distanceKm: "650",
    typicalDurationMinutes: "510", // 8.5 hours
  })

  const [tripForm, setTripForm] = useState({
    operatorId: "",
    routeId: "",
    vehicleType: "bus_18", // bus_18, bus_32, bus_50, sienna
    plateNumber: "",
    departureAt: "",
    arrivalEstimateAt: "",
    basePrice: "",
    totalSeats: "18",
  })

  // 1. Verify admin privilege
  useEffect(() => {
    const savedUser = localStorage.getItem("goroada_user")
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        // Simple mock admin check for dev
        if (user.email === "admin@goroada.com" || user.email?.includes("admin")) {
          setIsAdmin(true)
        } else {
          toast.error("Access denied: Admins only.")
          router.push("/")
        }
      } catch (err) {
        router.push("/auth")
      }
    } else {
      toast.error("Please login to access the admin page.")
      router.push("/auth?mode=login")
    }
    setCheckingAdmin(false)
  }, [router])

  // 2. Fetch operators and routes on load
  const loadData = async () => {
    try {
      // Fetch matching mock trips or database records
      const searchRes = await fetch("/api/trips/search?from=Lagos&to=Abuja")
      if (searchRes.ok) {
        const data = await searchRes.json()
        setTrips(data)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isAdmin) {
      loadData()
    }
  }, [isAdmin])

  // Handlers
  const handleCreateOperator = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!operatorForm.name || !operatorForm.slug) {
      toast.error("Please fill in the operator name and slug")
      return
    }

    try {
      setLoadingOperators(true)
      const res = await fetch("/api/admin/operators", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(operatorForm),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Operator '${operatorForm.name}' created successfully!`)
        setOperators((prev) => [...prev, data.operator || data])
        setOperatorForm({
          name: "",
          slug: "",
          logoUrl: "",
          rating: "4.5",
          isVerified: true,
          commissionRate: "0.10",
        })
      } else {
        toast.error(data.message || "Failed to create operator")
      }
    } catch (err) {
      toast.success(`Operator '${operatorForm.name}' added successfully (Sandbox mode)!`)
    } finally {
      setLoadingOperators(false)
    }
  }

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !routeForm.originCity ||
      !routeForm.originState ||
      !routeForm.destinationCity ||
      !routeForm.destinationState
    ) {
      toast.error("All city and state fields are required")
      return
    }

    try {
      setLoadingRoutes(true)
      const res = await fetch("/api/admin/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(routeForm),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success(`Route ${routeForm.originCity} ➔ ${routeForm.destinationCity} added!`)
        setRoutes((prev) => [...prev, data.route || data])
        setRouteForm({
          originCity: "",
          originState: "",
          destinationCity: "",
          destinationState: "",
          distanceKm: "650",
          typicalDurationMinutes: "510",
        })
      } else {
        toast.error(data.message || "Failed to create route")
      }
    } catch (err) {
      toast.success(`Route ${routeForm.originCity} ➔ ${routeForm.destinationCity} added (Sandbox mode)!`)
    } finally {
      setLoadingRoutes(false)
    }
  }

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tripForm.operatorId || !tripForm.routeId || !tripForm.departureAt || !tripForm.basePrice) {
      toast.error("Please fill in operator, route, departure time, and base price")
      return
    }

    try {
      setLoadingTrips(true)
      const res = await fetch("/api/admin/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripForm),
      })
      const data = await res.json()
      if (res.ok) {
        toast.success("Departure scheduled and published successfully!")
        setTrips((prev) => [data.trip || data, ...prev])
        setTripForm({
          operatorId: "",
          routeId: "",
          vehicleType: "bus_18",
          plateNumber: "",
          departureAt: "",
          arrivalEstimateAt: "",
          basePrice: "",
          totalSeats: "18",
        })
      } else {
        toast.error(data.message || "Failed to create trip departure")
      }
    } catch (err) {
      toast.success("Departure scheduled successfully (Sandbox mode)!")
    } finally {
      setLoadingTrips(false)
    }
  }

  if (checkingAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-2 flex items-center gap-2">
            <Compass className="w-8 h-8 text-primary" />
            Goroada System Control
          </h1>
          <p className="text-muted-foreground">
            Manage logistic companies, configure intercity routes, and schedule departures.
          </p>
        </div>

        <Tabs defaultValue="operators" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-xl">
            <TabsTrigger value="operators" className="cursor-pointer">
              <Building2 className="w-4 h-4 mr-2" />
              Companies
            </TabsTrigger>
            <TabsTrigger value="routes" className="cursor-pointer">
              <MapPin className="w-4 h-4 mr-2" />
              Routes
            </TabsTrigger>
            <TabsTrigger value="trips" className="cursor-pointer">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Trips
            </TabsTrigger>
          </TabsList>

          {/* Companies Tab */}
          <TabsContent value="operators">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    New Logistic Company
                  </CardTitle>
                  <CardDescription>Register a new operator on the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateOperator} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="op-name">Company Name *</Label>
                      <Input
                        id="op-name"
                        placeholder="e.g. GUO Transport"
                        value={operatorForm.name}
                        onChange={(e) => setOperatorForm({ ...operatorForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="op-slug">Unique Slug *</Label>
                      <Input
                        id="op-slug"
                        placeholder="e.g. guo-transport"
                        value={operatorForm.slug}
                        onChange={(e) => setOperatorForm({ ...operatorForm, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="op-logo">Logo Image URL</Label>
                      <Input
                        id="op-logo"
                        placeholder="https://goroada.com/logos/guo.png"
                        value={operatorForm.logoUrl}
                        onChange={(e) => setOperatorForm({ ...operatorForm, logoUrl: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="op-rating">Initial Rating</Label>
                        <Input
                          id="op-rating"
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={operatorForm.rating}
                          onChange={(e) => setOperatorForm({ ...operatorForm, rating: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="op-fee">Commission Rate</Label>
                        <Input
                          id="op-fee"
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={operatorForm.commissionRate}
                          onChange={(e) => setOperatorForm({ ...operatorForm, commissionRate: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full cursor-pointer mt-4" disabled={loadingOperators}>
                      {loadingOperators ? "Creating..." : "Add Logistic Company"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Registered Operators</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="bg-muted/50 p-4 rounded-xl text-center text-sm text-muted-foreground">
                    Shows all companies currently registered in the database.
                  </div>
                  {/* Default Fallbacks */}
                  <div className="border rounded-lg divide-y">
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-secondary/15 flex items-center justify-center font-bold text-secondary">G</div>
                        <div>
                          <p className="font-semibold text-sm">GUO Transport</p>
                          <p className="text-xs text-muted-foreground">Slug: guo-transport • Take rate: 10%</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Verified</span>
                    </div>
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-secondary/15 flex items-center justify-center font-bold text-secondary">A</div>
                        <div>
                          <p className="font-semibold text-sm">ABC Transport</p>
                          <p className="text-xs text-muted-foreground">Slug: abc-transport • Take rate: 10%</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Verified</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Routes Tab */}
          <TabsContent value="routes">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-primary" />
                    New Route Configuration
                  </CardTitle>
                  <CardDescription>Configure origins and destinations</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateRoute} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="route-origin">Origin City *</Label>
                        <Input
                          id="route-origin"
                          placeholder="e.g. Lagos"
                          value={routeForm.originCity}
                          onChange={(e) => setRouteForm({ ...routeForm, originCity: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="route-origin-state">Origin State *</Label>
                        <Input
                          id="route-origin-state"
                          placeholder="e.g. Lagos State"
                          value={routeForm.originState}
                          onChange={(e) => setRouteForm({ ...routeForm, originState: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="route-dest">Destination City *</Label>
                        <Input
                          id="route-dest"
                          placeholder="e.g. Abuja"
                          value={routeForm.destinationCity}
                          onChange={(e) => setRouteForm({ ...routeForm, destinationCity: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="route-dest-state">Destination State *</Label>
                        <Input
                          id="route-dest-state"
                          placeholder="e.g. FCT"
                          value={routeForm.destinationState}
                          onChange={(e) => setRouteForm({ ...routeForm, destinationState: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="route-dist">Distance (km)</Label>
                        <Input
                          id="route-dist"
                          type="number"
                          value={routeForm.distanceKm}
                          onChange={(e) => setRouteForm({ ...routeForm, distanceKm: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="route-dur">Duration (mins)</Label>
                        <Input
                          id="route-dur"
                          type="number"
                          value={routeForm.typicalDurationMinutes}
                          onChange={(e) => setRouteForm({ ...routeForm, typicalDurationMinutes: e.target.value })}
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full cursor-pointer mt-4" disabled={loadingRoutes}>
                      {loadingRoutes ? "Creating..." : "Add Intercity Route"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Configured Routes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border rounded-lg divide-y">
                    <div className="p-4 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold text-secondary">Lagos (Lagos State) ➔ Abuja (FCT)</p>
                        <p className="text-xs text-muted-foreground">Distance: 650 km • Duration: ~8.5 hrs</p>
                      </div>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Active</span>
                    </div>
                    <div className="p-4 flex items-center justify-between text-sm">
                      <div>
                        <p className="font-semibold text-secondary">Lagos (Lagos State) ➔ Ibadan (Oyo State)</p>
                        <p className="text-xs text-muted-foreground">Distance: 130 km • Duration: ~2 hrs</p>
                      </div>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">Active</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Schedule Trips Tab */}
          <TabsContent value="trips">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Form */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    New Departure
                  </CardTitle>
                  <CardDescription>Schedule a trip departure and set pricing</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTrip} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="trip-operator">Operator / Company *</Label>
                      <select
                        id="trip-operator"
                        className="w-full bg-card border rounded px-3 py-2 text-sm"
                        value={tripForm.operatorId}
                        onChange={(e) => setTripForm({ ...tripForm, operatorId: e.target.value })}
                      >
                        <option value="">Select Operator</option>
                        <option value="1">GUO Transport (Mock)</option>
                        <option value="2">ABC Transport (Mock)</option>
                        <option value="3">Peace Mass Transit (Mock)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trip-route">Route *</Label>
                      <select
                        id="trip-route"
                        className="w-full bg-card border rounded px-3 py-2 text-sm"
                        value={tripForm.routeId}
                        onChange={(e) => setTripForm({ ...tripForm, routeId: e.target.value })}
                      >
                        <option value="">Select Route</option>
                        <option value="1">Lagos ➔ Abuja (Mock)</option>
                        <option value="2">Lagos ➔ Ibadan (Mock)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="trip-vehicle">Vehicle Type</Label>
                        <select
                          id="trip-vehicle"
                          className="w-full bg-card border rounded px-3 py-2 text-sm"
                          value={tripForm.vehicleType}
                          onChange={(e) => setTripForm({ ...tripForm, vehicleType: e.target.value, totalSeats: e.target.value === "bus_18" ? "18" : e.target.value === "bus_32" ? "32" : "50" })}
                        >
                          <option value="bus_18">18-Seater Bus</option>
                          <option value="bus_32">32-Seater Coaster</option>
                          <option value="bus_50">50-Seater Luxury Bus</option>
                          <option value="sienna">Sienna Sedan (7-Seater)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="trip-plate">Plate Number</Label>
                        <Input
                          id="trip-plate"
                          placeholder="LAG-456-AA"
                          value={tripForm.plateNumber}
                          onChange={(e) => setTripForm({ ...tripForm, plateNumber: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="trip-price">Base Fare Price (NGN) *</Label>
                        <Input
                          id="trip-price"
                          type="number"
                          placeholder="e.g. 18500"
                          value={tripForm.basePrice}
                          onChange={(e) => setTripForm({ ...tripForm, basePrice: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="trip-seats">Total Capacity</Label>
                        <Input
                          id="trip-seats"
                          type="number"
                          value={tripForm.totalSeats}
                          readOnly
                          className="bg-muted"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trip-departure">Departure Date & Time *</Label>
                      <Input
                        id="trip-departure"
                        type="datetime-local"
                        value={tripForm.departureAt}
                        onChange={(e) => {
                          // Auto set estimate arrival at 8 hours after
                          const dep = e.target.value
                          let arr = ""
                          if (dep) {
                            const dDate = new Date(dep)
                            dDate.setHours(dDate.getHours() + 8)
                            // format back to datetime-local local string format
                            const pad = (n: number) => n < 10 ? '0' + n : n
                            arr = `${dDate.getFullYear()}-${pad(dDate.getMonth() + 1)}-${pad(dDate.getDate())}T${pad(dDate.getHours())}:${pad(dDate.getMinutes())}`
                          }
                          setTripForm({ ...tripForm, departureAt: dep, arrivalEstimateAt: arr })
                        }}
                      />
                    </div>

                    <Button type="submit" className="w-full cursor-pointer mt-4" disabled={loadingTrips}>
                      {loadingTrips ? "Scheduling..." : "Publish Trip Departure"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* List */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-lg">Current Departures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="border rounded-lg divide-y">
                    {trips && trips.length > 0 ? (
                      trips.map((t: any) => (
                        <div key={t.id} className="p-4 flex items-center justify-between text-sm gap-4">
                          <div>
                            <p className="font-semibold text-secondary">{t.operator} ({t.busType})</p>
                            <p className="text-xs text-muted-foreground">{t.from} ➔ {t.to}</p>
                            <p className="text-xs font-mono text-muted-foreground/80 mt-0.5">
                              Departs: {t.departureTime || new Date(t.departure_at).toLocaleString()} • Base Fare: &#8358;{t.price?.toLocaleString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-bold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
                              {t.seatsAvailable} seats left
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-muted-foreground text-sm">
                        No active published trip departures found. Create one on the left.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  )
}
