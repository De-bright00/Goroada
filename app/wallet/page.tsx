"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"

// Mock wallet data
const walletData = {
  balance: 25000,
  transactions: [
    {
      id: "1",
      type: "credit",
      description: "Wallet Funded",
      amount: 20000,
      date: "Apr 10, 2024",
      status: "completed",
    },
    {
      id: "2",
      type: "debit",
      description: "Trip Payment - Lagos to Abuja",
      amount: 18500,
      date: "Apr 8, 2024",
      status: "completed",
    },
    {
      id: "3",
      type: "credit",
      description: "Refund - Cancelled Trip",
      amount: 15000,
      date: "Apr 5, 2024",
      status: "completed",
    },
    {
      id: "4",
      type: "credit",
      description: "Wallet Funded",
      amount: 10000,
      date: "Apr 1, 2024",
      status: "completed",
    },
    {
      id: "5",
      type: "debit",
      description: "Trip Payment - Lagos to Ibadan",
      amount: 3500,
      date: "Mar 28, 2024",
      status: "completed",
    },
  ],
}

const quickAmounts = [5000, 10000, 20000, 50000]

export default function WalletPage() {
  const [fundAmount, setFundAmount] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)

  const getTransactionIcon = (type: string) => {
    if (type === "credit") {
      return (
        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
          <ArrowDownLeft className="w-5 h-5 text-green-600" />
        </div>
      )
    }
    return (
      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
        <ArrowUpRight className="w-5 h-5 text-red-600" />
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn userName="John" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary mb-2">Wallet</h1>
            <p className="text-muted-foreground">
              Manage your Goroada wallet and transactions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Balance Card */}
            <Card className="lg:col-span-1 bg-secondary text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <span className="font-medium">Goroada Wallet</span>
                </div>

                <div className="mb-6">
                  <p className="text-sm text-white/70 mb-1">Available Balance</p>
                  <p className="text-4xl font-bold">
                    &#8358;{walletData.balance.toLocaleString()}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="flex-1 bg-primary hover:bg-primary/90">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Funds
                      </Button>
                    </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Fund Your Wallet</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Enter Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="Enter amount"
                          value={fundAmount}
                          onChange={(e) => setFundAmount(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Quick Select</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {quickAmounts.map((amount) => (
                            <Button
                              key={amount}
                              variant="outline"
                              size="sm"
                              onClick={() => setFundAmount(amount.toString())}
                              className={
                                fundAmount === amount.toString()
                                  ? "border-primary bg-primary/10"
                                  : ""
                              }
                            >
                              &#8358;{amount.toLocaleString()}
                            </Button>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        disabled={!fundAmount || parseInt(fundAmount) < 1000}
                      >
                        Continue to Payment
                      </Button>

                      <p className="text-xs text-center text-muted-foreground">
                        Minimum funding amount is &#8358;1,000
                      </p>
                    </div>
                  </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="flex-1">
                    <ArrowUpRight className="w-4 h-4 mr-2" />
                    Withdraw
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Transactions */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                {walletData.transactions.length > 0 ? (
                  <div className="space-y-4">
                    {walletData.transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between py-3 border-b border-border last:border-0"
                      >
                        <div className="flex items-center gap-4">
                          {getTransactionIcon(transaction.type)}
                          <div>
                            <p className="font-medium">
                              {transaction.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{transaction.date}</span>
                              {getStatusIcon(transaction.status)}
                            </div>
                          </div>
                        </div>
                        <p
                          className={`font-semibold ${
                            transaction.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "credit" ? "+" : "-"}&#8358;
                          {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No transactions yet
                    </h3>
                    <p className="text-muted-foreground">
                      Your transaction history will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Why use Goroada Wallet?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Faster Checkout</p>
                    <p className="text-sm text-muted-foreground">
                      Pay for trips instantly without entering card details
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Quick Refunds</p>
                    <p className="text-sm text-muted-foreground">
                      Get instant refunds to your wallet for cancelled trips
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Exclusive Offers</p>
                    <p className="text-sm text-muted-foreground">
                      Get special discounts when you pay with wallet
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
