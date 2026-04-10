"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SearchBox } from "@/components/search-box"
import { RouteCard } from "@/components/route-card"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Shield, CreditCard, Ticket, Bus, MapPin, Star, Building2, Route, Users, Award, ChevronLeft, ChevronRight } from "lucide-react"

const featuredRoutes = [
  { from: "Lagos", to: "Abuja", price: 18500, duration: "8-10 hours" },
  { from: "Abuja", to: "Kaduna", price: 4500, duration: "2-3 hours" },
  { from: "Lagos", to: "Ibadan", price: 3500, duration: "1.5-2 hours" },
  { from: "Enugu", to: "Abuja", price: 12000, duration: "5-6 hours" },
]

const howItWorks = [
  {
    icon: Search,
    title: "Search Routes",
    description: "Enter your departure city, destination, and travel date to find available trips.",
  },
  {
    icon: Bus,
    title: "Compare Operators",
    description: "View prices, ratings, and amenities from multiple transport operators.",
  },
  {
    icon: Ticket,
    title: "Book Your Seat",
    description: "Select your preferred trip and complete your booking in minutes.",
  },
  {
    icon: MapPin,
    title: "Travel",
    description: "Receive your digital ticket and enjoy your journey with trusted operators.",
  },
]

const trustFeatures = [
  {
    icon: Shield,
    title: "Verified Operators",
    description: "All transport operators are thoroughly vetted and verified for your safety.",
  },
  {
    icon: CreditCard,
    title: "Secure Payments",
    description: "Your payment information is protected with bank-grade encryption.",
  },
  {
    icon: Ticket,
    title: "Digital Tickets",
    description: "Receive instant confirmation and digital tickets on your phone.",
  },
]

const trustedOperators = [
  { name: "GUO Transport", logo: "/images/operators/guo-transport.jpeg", rating: 4.8, badge: "Premium Partner" },
  { name: "ABC Transport", logo: "/images/operators/abc-transport.png", rating: 4.7, badge: "Verified" },
  { name: "Peace Mass Transit", logo: "/images/operators/peace-mass-transit.png", rating: 4.6, badge: "Verified" },
  { name: "Libra Motors", logo: "/images/operators/libra-motors.png", rating: 4.5, badge: "Verified" },
]

const stats = [
  { icon: Building2, target: 10, label: "Transport Operators", suffix: "+", countUp: true },
  { icon: Route, target: 0, label: "Routes Covered", suffix: "", countUp: false, startFrom: 100 },
  { icon: Users, target: 0, label: "Happy Travelers", suffix: "", countUp: false, startFrom: 100 },
  { icon: Star, target: 5.0, label: "Average Rating", suffix: "", countUp: true, decimal: true },
]

const heroImages = [
  "/images/hero-bg.png",
  "/images/hero-bg-2.png",
]

export default function HomePage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentOperatorIndex, setCurrentOperatorIndex] = useState(0)
  const [animatedStats, setAnimatedStats] = useState(
    stats.map((stat) => (stat.countUp ? 0 : stat.startFrom || 0))
  )
  const [hasAnimated, setHasAnimated] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const operatorInterval = setInterval(() => {
      setCurrentOperatorIndex((prev) => (prev + 1) % trustedOperators.length)
    }, 3000)
    return () => clearInterval(operatorInterval)
  }, [])

  // Stats counting animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          animateStats()
        }
      },
      { threshold: 0.3 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  const animateStats = () => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    let currentStep = 0
    const interval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps

      setAnimatedStats(
        stats.map((stat) => {
          if (stat.countUp) {
            // Count up from 0 to target
            const value = stat.decimal 
              ? parseFloat((stat.target * progress).toFixed(1))
              : Math.floor(stat.target * progress)
            return value
          } else {
            // Count down from startFrom to target
            const startFrom = stat.startFrom || 100
            const value = Math.floor(startFrom - (startFrom - stat.target) * progress)
            return value
          }
        })
      )

      if (currentStep >= steps) {
        clearInterval(interval)
        // Set final values
        setAnimatedStats(stats.map((stat) => stat.target))
      }
    }, stepDuration)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section with Background Image Slideshow */}
        <section className="relative min-h-[600px] md:min-h-[700px] flex items-center overflow-hidden">
          {/* Background Images */}
          {heroImages.map((img, index) => (
            <div
              key={img}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentImageIndex ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={img}
                alt="Nigerian highway with buses"
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-secondary/70 via-secondary/50 to-secondary/80" />
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance leading-tight drop-shadow-lg">
                Travel Across Nigeria,{" "}
                <span className="text-primary">Smarter & Easier</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-light mb-4 tracking-wide drop-shadow-md">
                Let&apos;s find you the best ride
              </p>
              <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto text-pretty drop-shadow">
                Compare prices, book seats, and travel with trusted transport
                operators across Nigeria.
              </p>
            </div>

            {/* Search Box */}
            <div className="max-w-5xl mx-auto">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-2">
                <SearchBox />
              </div>
            </div>
          </div>

          {/* Image indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? "bg-primary w-6" 
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </section>

        {/* Trusted Operators Section - Slideshow */}
        <section className="py-20 bg-gradient-to-br from-secondary/5 via-primary/5 to-secondary/10 relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Our Partners
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Trusted Operators
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Travel with Nigeria&apos;s most reliable transport companies, verified for safety and service quality
              </p>
            </div>

            {/* Slideshow Container */}
            <div className="relative">
              {/* Navigation Arrows */}
              <button 
                onClick={() => setCurrentOperatorIndex((prev) => (prev - 1 + trustedOperators.length) % trustedOperators.length)}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hidden md:flex"
                aria-label="Previous operator"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setCurrentOperatorIndex((prev) => (prev + 1) % trustedOperators.length)}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-300 hidden md:flex"
                aria-label="Next operator"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Cards Container */}
              <div className="overflow-hidden px-4 md:px-8">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentOperatorIndex * (100 / 4)}%)` }}
                >
                  {[...trustedOperators, ...trustedOperators].map((operator, idx) => (
                    <div 
                      key={`${operator.name}-${idx}`} 
                      className="w-full sm:w-1/2 lg:w-1/4 flex-shrink-0 px-3"
                    >
                      <Card 
                        className="group border-border hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer hover:-translate-y-1 bg-white/80 backdrop-blur-sm"
                      >
                        <CardContent className="p-6 text-center">
                          <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center mx-auto mb-4 overflow-hidden shadow-md group-hover:shadow-lg transition-all duration-300 border border-gray-100">
                            <Image
                              src={operator.logo}
                              alt={operator.name}
                              width={80}
                              height={80}
                              className="object-contain w-20 h-20"
                            />
                          </div>
                          <h3 className="font-semibold text-secondary mb-2 group-hover:text-primary transition-colors duration-300">
                            {operator.name}
                          </h3>
                          <div className="flex items-center justify-center gap-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < Math.floor(operator.rating) 
                                    ? "text-amber-500 fill-amber-500" 
                                    : "text-gray-300"
                                }`} 
                              />
                            ))}
                            <span className="text-sm font-medium text-secondary ml-1">{operator.rating}</span>
                          </div>
                          <div className="flex items-center justify-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-primary" />
                            <span className="text-xs font-medium text-primary">
                              {operator.badge}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-8">
                {trustedOperators.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentOperatorIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentOperatorIndex 
                        ? "bg-primary w-8" 
                        : "bg-secondary/30 hover:bg-secondary/50"
                    }`}
                    aria-label={`Go to operator ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Routes - Enhanced */}
        <section className="py-20 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-sm font-medium rounded-full mb-4">
                Top Destinations
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                Popular Routes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Discover the most traveled intercity routes in Nigeria with competitive prices
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredRoutes.map((route) => (
                <RouteCard key={`${route.from}-${route.to}`} {...route} />
              ))}
            </div>
          </div>
        </section>

        {/* How It Works - Enhanced */}
        <section className="py-20 bg-gradient-to-b from-card to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                Simple Process
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Book your next trip in four simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {howItWorks.map((step, index) => (
                <div key={step.title} className="relative text-center group">
                  {index < howItWorks.length - 1 && (
                    <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/30 to-transparent" />
                  )}

                  <div className="relative inline-flex mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 group-hover:scale-110 transition-all duration-300 shadow-lg shadow-primary/10">
                      <step.icon className="w-9 h-9 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/30">
                      {index + 1}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-secondary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section - Enhanced */}
        <section className="py-20 bg-secondary relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-sm font-medium rounded-full mb-4">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Travel With Goroada
              </h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Your safety and convenience are our top priorities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {trustFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:bg-white/15 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 border border-white/10"
                >
                  <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-5 flex items-center justify-center shadow-lg shadow-primary/40">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Enhanced with Counting Animation */}
        <section className="py-20 bg-card relative" ref={statsRef}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-background via-card to-background rounded-3xl shadow-xl border border-border p-8 md:p-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
                {stats.map((stat, index) => (
                  <div 
                    key={stat.label} 
                    className={`text-center py-4 ${
                      index < stats.length - 1 ? "md:border-r md:border-border" : ""
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/10">
                      <stat.icon className="w-7 h-7 text-primary" />
                    </div>
                    <p className="text-4xl md:text-5xl font-extrabold text-primary mb-2 tabular-nums">
                      {stat.decimal 
                        ? animatedStats[index].toFixed(1)
                        : animatedStats[index]}
                      {stat.suffix}
                    </p>
                    <p className="text-sm font-medium text-secondary">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="py-20 bg-gradient-to-b from-card to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-medium rounded-full mb-6">
              Get Started Today
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
              Join thousands of Nigerians who travel smarter with Goroada. Download our app and book your next trip today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/90 hover:scale-105 transition-all duration-300 shadow-xl shadow-secondary/20"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-80">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/90 hover:scale-105 transition-all duration-300 shadow-xl shadow-secondary/20"
              >
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 010 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 9.99l-2.302 2.302-8.634-8.634z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-80">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/2347043543917"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 hover:bg-green-600 hover:scale-110 transition-all duration-300 group"
        aria-label="Chat on WhatsApp"
      >
        <svg 
          className="w-7 h-7 text-white" 
          viewBox="0 0 24 24" 
          fill="currentColor"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        {/* Tooltip */}
        <span className="absolute right-full mr-3 px-3 py-1.5 bg-secondary text-white text-sm font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          Chat with us
        </span>
      </a>
    </div>
  )
}
