import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import {
  Target,
  Eye,
  Heart,
  Shield,
  Award,
  TrendingUp,
} from "lucide-react"

const stats = [
  { label: "Transport Operators", value: "10+" },
  { label: "Routes Covered", value: "0" },
  { label: "Happy Travelers", value: "0" },
  { label: "Average Rating", value: "5.0" },
]

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description:
      "We partner only with verified transport operators who meet our strict safety standards.",
  },
  {
    icon: Heart,
    title: "Customer Focus",
    description:
      "Every decision we make is guided by what's best for our travelers and partners.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We strive to deliver the best travel booking experience in Nigeria.",
  },
  {
    icon: TrendingUp,
    title: "Innovation",
    description:
      "We continuously improve our platform to make intercity travel more convenient.",
  },
]



export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-secondary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Making Intercity Travel in Nigeria{" "}
              <span className="text-primary">Better for Everyone</span>
            </h1>
            <p className="text-lg md:text-xl text-secondary-foreground/80 max-w-3xl mx-auto text-pretty">
              Goroada is transforming how Nigerians travel between cities by
              connecting passengers with verified transport operators through a
              simple, reliable booking platform.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl md:text-4xl font-bold text-primary">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What is Goroada */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-secondary mb-6">
                  What is Goroada?
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Goroada is Nigeria&apos;s leading marketplace for intercity
                    road travel. We connect passengers with trusted transport
                    operators, making it easy to search, compare, and book bus
                    tickets online.
                  </p>
                  <p>
                    Founded in 2021, we set out to solve the challenges of
                    intercity travel in Nigeria - the uncertainty, the long
                    queues at motor parks, and the lack of transparency in
                    pricing and service quality.
                  </p>
                  <p>
                    Today, Goroada serves hundreds of thousands of travelers
                    across Nigeria, partnering with over 50 verified transport
                    operators to cover more than 100 routes connecting major
                    cities.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 h-80 flex items-center justify-center">
                <div className="text-center">
                  <Image
                    src="/images/logo.png"
                    alt="Goroada"
                    width={280}
                    height={100}
                    className="mx-auto"
                    style={{ width: "auto", height: "auto", maxWidth: "280px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-primary/20">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-4">
                    Our Mission
                  </h3>
                  <p className="text-muted-foreground">
                    To make intercity travel in Nigeria safe, convenient, and
                    accessible for everyone. We&apos;re building the
                    infrastructure that enables millions of Nigerians to travel
                    smarter by providing transparent pricing, verified
                    operators, and seamless booking experiences.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-secondary/20">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center mb-6">
                    <Eye className="w-7 h-7 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold text-secondary mb-4">
                    Our Vision
                  </h3>
                  <p className="text-muted-foreground">
                    A continent where road travel is predictable, efficient, and
                    fully integrated into the digital economy. We envision
                    becoming the infrastructure layer for road travel across
                    Africa.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Long-Term Strategy */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-secondary mb-6">
                Long-Term Strategy
              </h2>
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-12 border border-border">
                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  Goroada&apos;s mission is to redefine mobility in Africa. The
                  platform seeks to become the infrastructure layer for road
                  travel, providing a seamless, trusted, and data-driven
                  ecosystem.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                  <div className="bg-card rounded-xl p-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-secondary mb-2">
                      Influence Pricing
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Drive fair and transparent pricing across the industry
                      through data and market insights.
                    </p>
                  </div>
                  <div className="bg-card rounded-xl p-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-secondary mb-2">
                      Optimise Utilisation
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Help operators maximise vehicle utilisation and reduce
                      empty trips across routes.
                    </p>
                  </div>
                  <div className="bg-card rounded-xl p-6">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    <h4 className="font-semibold text-secondary mb-2">
                      Actionable Insights
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Provide data-driven insights for operators, governments,
                      and logistics partners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary mb-4">
                Our Values
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at Goroada
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-secondary mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Experience Better Travel?
            </h2>
            <p className="text-white/80 mb-8">
              Join hundreds of thousands of Nigerians who trust Goroada for
              their intercity travel needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
                asChild
              >
                <Link href="/">Book Your First Trip</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
