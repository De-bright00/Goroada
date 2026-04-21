"use client"

import { use, useState, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  ArrowLeft,
  CreditCard,
  Building2,
  Wallet,
  Gift,
  Copy,
  Check,
  MapPin,
} from "lucide-react"

// Mock trip data
const mockTrip = {
  id: "1",
  operator: "GUO Transport",
  from: "Lagos",
  to: "Abuja",
  fromTerminal: "Jibowu Terminal, Yaba",
  toTerminal: "Utako Terminal, Abuja",
  departureTime: "06:00",
  arrivalTime: "14:30",
  duration: "8h 30m",
  date: "Mon, 15 Apr 2024",
  price: 18500,
  busType: "Executive Coach",
}

const bankDetails = {
  bankName: "Stanbic IBTC",
  accountNumber: "1234567891",
  accountName: "Goroada Nigeria Limited",
}

function PaymentContent({ id }: { id: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const passengers = parseInt(searchParams.get("passengers") || "1")
  const total = parseInt(searchParams.get("total") || String(mockTrip.price))

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [copied, setCopied] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    cardName: "",
  })
  const [referralCode, setReferralCode] = useState("")
  const [walletBalance] = useState(25000)

  const trip = { ...mockTrip, id }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePayment = () => {
    setProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      router.push(`/success/${id}`)
    }, 2000)
  }

  const renderPaymentForm = () => {
    switch (paymentMethod) {
      case "card":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={cardData.cardNumber}
                  onChange={(e) =>
                    setCardData({ ...cardData, cardNumber: e.target.value })
                  }
                  className="pl-10"
                  maxLength={19}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry" className="text-xs sm:text-sm">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={(e) =>
                    setCardData({ ...cardData, expiry: e.target.value })
                  }
                  maxLength={5}
                  className="text-sm"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv" className="text-xs sm:text-sm">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) =>
                    setCardData({ ...cardData, cvv: e.target.value })
                  }
                  maxLength={4}
                  type="password"
                  className="text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-xs sm:text-sm">Name on Card</Label>
              <Input
                id="cardName"
                placeholder="John Doe"
                value={cardData.cardName}
                onChange={(e) =>
                  setCardData({ ...cardData, cardName: e.target.value })
                }
                className="text-sm"
              />
            </div>

            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>Pay &#8358;{total.toLocaleString()}</>
              )}
            </Button>
          </div>
        )

      case "bank":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-muted/50 rounded-xl p-4 sm:p-6 space-y-3 sm:space-y-4">
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                Transfer the exact amount to the account below
              </p>

              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-card rounded-lg gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Bank Name</p>
                    <p className="font-semibold text-sm truncate">{bankDetails.bankName}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-card rounded-lg gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">
                      Account Number
                    </p>
                    <p className="font-semibold font-mono text-sm break-all">
                      {bankDetails.accountNumber}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(bankDetails.accountNumber)}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-card rounded-lg gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Account Name</p>
                    <p className="font-semibold text-sm truncate">{bankDetails.accountName}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-primary/10 rounded-lg gap-2">
                  <div className="min-w-0">
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="font-bold text-base sm:text-lg text-primary">
                      &#8358;{total.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(total.toString())}
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handlePayment}
              disabled={processing}
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "I Have Made the Transfer"
              )}
            </Button>
          </div>
        )

      case "wallet":
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-muted/50 rounded-xl p-4 sm:p-6 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                Wallet Balance
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-secondary">
                &#8358;{walletBalance.toLocaleString()}
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3 text-sm">
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground text-xs sm:text-sm">Trip Fare</span>
                <span className="font-medium">&#8358;{total.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-t border-border">
                <span className="text-muted-foreground text-xs sm:text-sm">Balance After</span>
                <span
                  className={
                    walletBalance >= total
                      ? "text-green-500 font-semibold"
                      : "text-destructive font-semibold"
                  }
                >
                  &#8358;{(walletBalance - total).toLocaleString()}
                </span>
              </div>
            </div>

            {walletBalance >= total ? (
              <Button
                className="w-full"
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  "Pay with Wallet"
                )}
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-xs sm:text-sm text-destructive text-center">
                  Insufficient wallet balance
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/wallet">Fund Wallet</Link>
                </Button>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Back Button */}
          <Button variant="ghost" className="mb-4 sm:mb-6" asChild>
            <Link href={`/booking/${id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to booking
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Payment Methods */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Select Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="space-y-2 sm:space-y-3"
                  >
                    <div
                      className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === "card"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard className="w-5 h-5 text-primary flex-shrink-0" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <span className="font-medium text-sm">Card Payment</span>
                        <p className="text-xs text-muted-foreground">
                          Pay with debit or credit card
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === "bank"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentMethod("bank")}
                    >
                      <RadioGroupItem value="bank" id="bank" />
                      <Building2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <Label htmlFor="bank" className="flex-1 cursor-pointer">
                        <span className="font-medium text-sm">Bank Transfer</span>
                        <p className="text-xs text-muted-foreground">
                          Transfer directly to our bank account
                        </p>
                      </Label>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 sm:p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === "wallet"
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => setPaymentMethod("wallet")}
                    >
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Wallet className="w-5 h-5 text-primary flex-shrink-0" />
                      <Label htmlFor="wallet" className="flex-1 cursor-pointer min-w-0">
                        <span className="font-medium text-sm">Goroada Wallet</span>
                        <p className="text-xs text-muted-foreground truncate">
                          Balance: &#8358;{walletBalance.toLocaleString()}
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Payment Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">
                    {paymentMethod === "card" && "Card Details"}
                    {paymentMethod === "bank" && "Bank Transfer"}
                    {paymentMethod === "wallet" && "Wallet Payment"}
                  </CardTitle>
                </CardHeader>
                <CardContent>{renderPaymentForm()}</CardContent>
              </Card>

              {/* Referral Code */}
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                    <Gift className="w-5 h-5 text-primary flex-shrink-0 hidden sm:block" />
                    <Input
                      placeholder="Referral code (optional)"
                      value={referralCode}
                      onChange={(e) => setReferralCode(e.target.value)}
                      className="text-sm"
                    />
                    <Button variant="outline" size="sm" disabled={!referralCode} className="flex-shrink-0">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trip Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Trip Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 text-sm">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-secondary">
                        {trip.operator.charAt(0)}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs sm:text-sm truncate">{trip.operator}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {trip.busType}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 sm:pt-4 space-y-2 sm:space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{trip.from}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {trip.fromTerminal}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-xs sm:text-sm truncate">{trip.to}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {trip.toTerminal}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 sm:pt-4 space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{trip.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Departure</span>
                      <span className="font-medium">{trip.departureTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Passengers</span>
                      <span className="font-medium">{passengers}</span>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3 sm:pt-4">
                    <div className="flex justify-between font-semibold text-base sm:text-lg">
                      <span>Total</span>
                      <span className="text-primary">
                        &#8358;{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      }
    >
      <PaymentContent id={id} />
    </Suspense>
  )
}
