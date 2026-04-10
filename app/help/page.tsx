"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Search,
  Ticket,
  CreditCard,
  Calendar,
  Shield,
  HelpCircle,
  MessageCircle,
  Phone,
  Mail,
} from "lucide-react"

const categories = [
  {
    icon: Ticket,
    title: "Booking",
    description: "How to book, modify, or cancel trips",
  },
  {
    icon: CreditCard,
    title: "Payments",
    description: "Payment methods, refunds, and wallet",
  },
  {
    icon: Calendar,
    title: "Trips",
    description: "Managing your upcoming and past trips",
  },
  {
    icon: Shield,
    title: "Safety",
    description: "Traveler safety and operator verification",
  },
]

const faqs = [
  {
    category: "booking",
    question: "How do I book a trip on Goroada?",
    answer:
      "Booking is simple! Just enter your departure city, destination, travel date, and number of passengers on the homepage. Browse available trips, select your preferred option, fill in passenger details, and complete payment. You'll receive a digital ticket instantly via email and SMS.",
  },
  {
    category: "booking",
    question: "Can I book for multiple passengers?",
    answer:
      "Yes, you can book up to 6 seats in a single booking. When booking, simply select the number of passengers and provide details for the primary passenger. Additional passenger details can be added during the booking process.",
  },
  {
    category: "booking",
    question: "How far in advance can I book a trip?",
    answer:
      "You can book trips up to 30 days in advance, depending on the operator. We recommend booking at least 24-48 hours before your travel date to ensure seat availability, especially for popular routes.",
  },
  {
    category: "booking",
    question: "How do I cancel my booking?",
    answer:
      "You can cancel your booking from the 'My Trips' section in your dashboard. Cancellations made 24 hours or more before departure are eligible for a full refund. Cancellations within 24 hours may be subject to a cancellation fee depending on the operator's policy.",
  },
  {
    category: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept debit cards, credit cards (Visa, Mastercard), bank transfers, and Goroada Wallet. You can also use referral credits if you have any in your account.",
  },
  {
    category: "payment",
    question: "How do I get a refund for a cancelled trip?",
    answer:
      "Refunds for eligible cancellations are processed automatically. If you paid with card, the refund will be credited to your card within 5-7 business days. If you prefer, you can receive instant refunds to your Goroada Wallet.",
  },
  {
    category: "payment",
    question: "Is my payment information secure?",
    answer:
      "Yes, absolutely. We use bank-grade encryption to protect your payment information. We never store your full card details on our servers. All transactions are processed through certified payment providers.",
  },
  {
    category: "trips",
    question: "How do I track my trip?",
    answer:
      "Once your trip departs, you can track it in real-time from the 'My Trips' section. You'll see the bus location on a map, estimated arrival time, and trip progress. You can also contact the driver if needed.",
  },
  {
    category: "trips",
    question: "What if I miss my trip?",
    answer:
      "If you miss your trip, unfortunately the ticket cannot be refunded. However, you may contact the operator directly to see if they can accommodate you on a later trip. We recommend arriving at the terminal at least 30 minutes before departure.",
  },
  {
    category: "safety",
    question: "How do you verify transport operators?",
    answer:
      "All operators on Goroada undergo a thorough verification process. We check their vehicle registration, insurance, driver credentials, and safety records. We also regularly audit operators and collect passenger feedback to maintain high standards.",
  },
  {
    category: "safety",
    question: "What should I do in case of emergency during a trip?",
    answer:
      "In case of emergency, contact the driver immediately using the phone number on your ticket. You can also reach our 24/7 support line. All our partner operators are required to have emergency protocols and first aid kits on board.",
  },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === null || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-b from-secondary/5 to-background py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold text-secondary mb-4">
              How can we help you?
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Search our help center or browse categories below
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for help..."
                className="pl-12 h-14 text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-12 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((category) => (
                <button
                  key={category.title}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.title.toLowerCase()
                        ? null
                        : category.title.toLowerCase()
                    )
                  }
                  className={`p-6 rounded-xl border text-left transition-all ${
                    selectedCategory === category.title.toLowerCase()
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <category.icon
                    className={`w-8 h-8 mb-3 ${
                      selectedCategory === category.title.toLowerCase()
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                  <h3 className="font-semibold text-secondary">
                    {category.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Frequently Asked Questions
              {selectedCategory && (
                <span className="text-primary capitalize">
                  {" "}
                  - {selectedCategory}
                </span>
              )}
            </h2>

            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="border border-border rounded-lg px-4"
                  >
                    <AccordionTrigger className="text-left hover:no-underline">
                      <span className="font-medium">{faq.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">
                    We couldn&apos;t find any articles matching your search. Try a
                    different query or contact support.
                  </p>
                  <Button asChild>
                    <Link href="/contact">Contact Support</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-12 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-secondary mb-2">
                Still need help?
              </h2>
              <p className="text-muted-foreground">
                Our support team is available 24/7
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-7 h-7 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2">WhatsApp Chat</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Chat with us on WhatsApp
                  </p>
                  <Button className="w-full bg-green-500 hover:bg-green-600" asChild>
                    <a 
                      href="https://wa.me/2347043543917" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Start Chat
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Phone className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2">Phone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Call us on 07043543917
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="tel:+2347043543917">Call Now</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-secondary mb-2">Email</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Send us an email anytime
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="mailto:goroadalimited@gmail.com">Send Email</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
