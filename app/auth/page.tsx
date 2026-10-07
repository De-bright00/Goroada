"use client"

import { useState, Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"
import { Shield, Ticket, CreditCard, Bus, Eye, EyeOff } from "lucide-react"

function AuthContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode") || "login"
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState(mode === "signup" ? "signup" : "login")

  // Form states
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const [signupName, setSignupName] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupPhone, setSignupPhone] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)

  // Redirect if user is already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("goroada_user")
    if (savedUser) {
      router.push("/")
    }
  }, [router])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginEmail || !loginPassword) {
      toast.error("Please enter both email and password")
      return
    }

    try {
      setLoading(true)

      if (supabase) {
        // Attempt Supabase login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail,
          password: loginPassword,
        })

        if (!error && data.user) {
          const userSession = {
            id: data.user.id,
            email: data.user.email,
            fullName: data.user.user_metadata?.full_name || loginEmail.split("@")[0],
            phone: data.user.user_metadata?.phone_number || "08012345678",
          }
          localStorage.setItem("goroada_user", JSON.stringify(userSession))
          toast.success("Welcome back!")
          router.push("/")
          return
        }
        console.warn("Supabase auth error, falling back to mock login:", error?.message)
      }

      // Local mock login fallback
      const mockSession = {
        id: "00000000-0000-0000-0000-000000000000",
        email: loginEmail,
        fullName: loginEmail.split("@")[0],
        phone: "08012345678",
      }
      localStorage.setItem("goroada_user", JSON.stringify(mockSession))
      toast.success("Logged in successfully (Sandbox)!")
      router.push("/")

    } catch (err: any) {
      toast.error(err.message || "An error occurred during login")
    } finally {
      setLoading(false)
    }
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!signupName || !signupEmail || !signupPhone || !signupPassword) {
      toast.error("Please fill in all signup fields")
      return
    }
    if (!acceptTerms) {
      toast.error("You must accept the terms of service")
      return
    }

    try {
      setLoading(true)

      if (supabase) {
        // Attempt Supabase registration
        const { data, error } = await supabase.auth.signUp({
          email: signupEmail,
          password: signupPassword,
          options: {
            data: {
              full_name: signupName,
              phone_number: signupPhone,
            },
          },
        })

        if (!error && data.user) {
          const userSession = {
            id: data.user.id,
            email: data.user.email,
            fullName: signupName,
            phone: signupPhone,
          }
          localStorage.setItem("goroada_user", JSON.stringify(userSession))
          toast.success("Account created! Check your email for verification link.")
          router.push("/")
          return
        }
        console.warn("Supabase registration error, falling back to mock signup:", error?.message)
      }

      // Local mock signup fallback
      const mockSession = {
        id: "00000000-0000-0000-0000-000000000000",
        email: signupEmail,
        fullName: signupName,
        phone: signupPhone,
      }
      localStorage.setItem("goroada_user", JSON.stringify(mockSession))
      toast.success("Account created successfully (Sandbox)!")
      router.push("/")

    } catch (err: any) {
      toast.error(err.message || "An error occurred during sign up")
    } finally {
      setLoading(false)
    }
  }

  const benefits = [
    { icon: Bus, text: "Access to 50+ verified transport operators" },
    { icon: CreditCard, text: "Secure and easy payment options" },
    { icon: Ticket, text: "Digital tickets sent to your phone" },
    { icon: Shield, text: "24/7 customer support" },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary p-12 flex-col justify-between">
        <Logo className="text-white [&_span]:text-white" />

        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-4 text-balance">
              Travel smarter across cities
            </h1>
            <p className="text-lg text-secondary-foreground/70">
              Join thousands of Nigerians who book their intercity trips with
              Goroada.
            </p>
          </div>

          <div className="space-y-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="flex items-center gap-4 text-white"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-secondary-foreground/90">
                  {benefit.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-sm text-secondary-foreground/50">
          &copy; {new Date().getFullYear()} Goroada. All rights reserved.
        </p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" className="cursor-pointer">Login</TabsTrigger>
              <TabsTrigger value="signup" className="cursor-pointer">Sign Up</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login" className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-secondary">
                  Welcome back
                </h2>
                <p className="text-muted-foreground">
                  Login to access your account
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleLoginSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email Address</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox id="remember" />
                  <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                    Remember me
                  </Label>
                </div>

                <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                  {loading ? "Authenticating..." : "Continue"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" className="w-full cursor-pointer" onClick={() => {
                  setLoginEmail("guest@goroada.com")
                  setLoginPassword("guest123")
                }}>
                  Guest Profile
                </Button>
                <Button variant="outline" className="w-full cursor-pointer" onClick={() => {
                  setLoginEmail("admin@goroada.com")
                  setLoginPassword("admin123")
                }}>
                  Admin Profile
                </Button>
              </div>
            </TabsContent>

            {/* Sign Up Form */}
            <TabsContent value="signup" className="space-y-6">
              <div className="space-y-2 text-center">
                <h2 className="text-2xl font-bold text-secondary">
                  Create an account
                </h2>
                <p className="text-muted-foreground">
                  Start booking trips with Goroada
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSignupSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email Address</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-phone">Phone Number</Label>
                  <Input
                    id="signup-phone"
                    type="tel"
                    placeholder="08012345678"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="terms"
                    className="mt-1 cursor-pointer"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </Label>
                </div>

                <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    }>
      <AuthContent />
    </Suspense>
  )
}
