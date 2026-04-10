"use client"

import { useState } from "react"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Shield,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  Camera,
  Phone,
  Mail,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react"

const menuItems = [
  { id: "profile", label: "Profile", icon: User },
  { id: "security", label: "Security", icon: Shield },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Preferences", icon: Settings },
  { id: "help", label: "Help & Support", icon: HelpCircle },
]

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "08012345678",
  })
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    promotions: true,
    tripReminders: true,
  })

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar isLoggedIn userName="John" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-secondary mb-2">
              Profile & Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-4">
                  {/* Profile Avatar */}
                  <div className="text-center mb-6 pt-4">
                    <div className="relative inline-block">
                      <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center">
                        <span className="text-2xl font-bold text-secondary">
                          JD
                        </span>
                      </div>
                      <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-semibold mt-3">{profileData.fullName}</p>
                    <p className="text-sm text-muted-foreground">
                      {profileData.email}
                    </p>
                  </div>

                  {/* Menu */}
                  <nav className="space-y-1">
                    {menuItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                          activeTab === item.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          {item.label}
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ))}

                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={profileData.fullName}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>
              )}

              {/* Security Tab */}
              {activeTab === "security" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Change Password</h3>

                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <Button>Update Password</Button>
                    </div>

                    <div className="border-t border-border pt-6 space-y-4">
                      <h3 className="font-semibold">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable 2FA</p>
                          <p className="text-sm text-muted-foreground">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive booking confirmations via email
                          </p>
                        </div>
                        <Switch
                          checked={notifications.email}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, email: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-t border-border">
                        <div>
                          <p className="font-medium">SMS Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive trip updates via SMS
                          </p>
                        </div>
                        <Switch
                          checked={notifications.sms}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, sms: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-t border-border">
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive real-time updates on your device
                          </p>
                        </div>
                        <Switch
                          checked={notifications.push}
                          onCheckedChange={(checked) =>
                            setNotifications({ ...notifications, push: checked })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-t border-border">
                        <div>
                          <p className="font-medium">Trip Reminders</p>
                          <p className="text-sm text-muted-foreground">
                            Remind me before my trips
                          </p>
                        </div>
                        <Switch
                          checked={notifications.tripReminders}
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              tripReminders: checked,
                            })
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between py-3 border-t border-border">
                        <div>
                          <p className="font-medium">Promotional Offers</p>
                          <p className="text-sm text-muted-foreground">
                            Receive special deals and discounts
                          </p>
                        </div>
                        <Switch
                          checked={notifications.promotions}
                          onCheckedChange={(checked) =>
                            setNotifications({
                              ...notifications,
                              promotions: checked,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <Card>
                  <CardHeader>
                    <CardTitle>App Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium">Language</p>
                          <p className="text-sm text-muted-foreground">
                            Select your preferred language
                          </p>
                        </div>
                        <Button variant="outline">English</Button>
                      </div>

                      <div className="flex items-center justify-between py-3 border-t border-border">
                        <div>
                          <p className="font-medium">Currency</p>
                          <p className="text-sm text-muted-foreground">
                            Display prices in
                          </p>
                        </div>
                        <Button variant="outline">NGN (&#8358;)</Button>
                      </div>

                      <div className="flex items-center justify-between py-3 border-t border-border">
                        <div>
                          <p className="font-medium">Dark Mode</p>
                          <p className="text-sm text-muted-foreground">
                            Toggle dark theme
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Help Tab */}
              {activeTab === "help" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Help & Support</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link
                        href="/help"
                        className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
                      >
                        <h3 className="font-semibold mb-1">Help Center</h3>
                        <p className="text-sm text-muted-foreground">
                          Browse FAQs and guides
                        </p>
                      </Link>

                      <a
                        href="mailto:support@goroada.com"
                        className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
                      >
                        <h3 className="font-semibold mb-1">Email Support</h3>
                        <p className="text-sm text-muted-foreground">
                          support@goroada.com
                        </p>
                      </a>

                      <a
                        href="tel:+2348012345678"
                        className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
                      >
                        <h3 className="font-semibold mb-1">Phone Support</h3>
                        <p className="text-sm text-muted-foreground">
                          +234 801 234 5678
                        </p>
                      </a>

                      <Link
                        href="/contact"
                        className="p-4 border border-border rounded-lg hover:border-primary transition-colors"
                      >
                        <h3 className="font-semibold mb-1">Live Chat</h3>
                        <p className="text-sm text-muted-foreground">
                          Chat with our support team
                        </p>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
