import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { CompoundCalculator } from "@/components/compound-calculator"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageTransition } from "@/components/page-transition"
import { Container } from "@/components/container"
import { Section } from "@/components/section"

export const metadata: Metadata = {
  title: "Features | Uqie",
  description: "Explore advanced tools and features including compound interest calculator with real-time projections.",
  keywords: ["calculator", "features", "tools", "compound interest"],
  openGraph: {
    title: "Features | Uqie",
    description: "Advanced tools and calculators",
    type: "website",
  },
}

export default function FeaturesPage() {
  return (
    <ErrorBoundary>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />

          {/* Hero Section */}
          <Section className="pt-32 pb-12">
            <Container className="max-w-3xl">
              <div className="text-center space-y-4 animate-fade-in">
                <p className="text-sm font-semibold text-primary tracking-wide">FEATURES & TOOLS</p>
                <h1 className="text-balance text-foreground">Advanced Tools for Financial Planning</h1>
                <p className="text-lg text-muted-foreground">
                  Explore powerful utilities designed to help you make informed financial decisions and understand the
                  power of compound interest.
                </p>
              </div>
            </Container>
          </Section>

          {/* Compound Interest Calculator */}
          <CompoundCalculator />

          <Footer />
        </div>
      </PageTransition>
    </ErrorBoundary>
  )
}
