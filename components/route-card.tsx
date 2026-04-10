"use client"

import Link from "next/link"
import { ArrowRight, Bus } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface RouteCardProps {
  from: string
  to: string
  price: number
  duration: string
  image?: string
}

export function RouteCard({ from, to, price, duration }: RouteCardProps) {
  const searchParams = new URLSearchParams({
    from,
    to,
    date: new Date().toISOString().split("T")[0],
    passengers: "1",
  })

  return (
    <Link href={`/search?${searchParams.toString()}`}>
      <Card className="group hover:shadow-2xl hover:shadow-primary/15 transition-all duration-300 hover:-translate-y-2 overflow-hidden border-border hover:border-primary/40 bg-card">
        {/* Route visual header with road pattern */}
        <div className="h-36 relative overflow-hidden">
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 to-secondary/70" />
          
          {/* Road pattern overlay */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id={`road-${from}-${to}`} x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
                <rect x="48" y="0" width="4" height="8" fill="white" />
                <rect x="48" y="12" width="4" height="8" fill="white" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#road-${from}-${to})`} />
          </svg>
          
          {/* Bus icon */}
          <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Bus className="w-4 h-4 text-white" />
          </div>
          
          {/* Route text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-3 text-white">
              <span className="text-lg font-bold drop-shadow-md">{from}</span>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <div className="w-8 h-0.5 bg-primary" />
                <ArrowRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform duration-300" />
                <div className="w-8 h-0.5 bg-primary" />
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
              <span className="text-lg font-bold drop-shadow-md">{to}</span>
            </div>
          </div>
        </div>
        
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Duration</p>
              <p className="text-sm font-medium text-secondary">{duration}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground mb-1">Starting from</p>
              <p className="text-xl font-bold text-primary group-hover:scale-105 transition-transform duration-300 origin-right">
                &#8358;{price.toLocaleString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
