"use client"

import Link from "next/link"
import { Section } from "@/components/section"
import { Container } from "@/components/container"
import { PortfolioCard } from "@/components/portfolio-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Portfolio } from "@/lib/schemas"
import { usePortfolio } from "@/hooks/use-portfolio"

export function PortfolioSection() {
  const [portfolios, setPortfolios] = useState<Portfolio[] | []>([])
  const [loading, setLoading] = useState(true)

  const { getAll } = usePortfolio();

  useEffect(() => {
    getAll()
      .then(res => {
        setPortfolios(res.data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  // Get featured projects (first 4)
  const featuredProjects = portfolios.slice(0, 4)

  return (
    <Section id="portfolio" className="bg-gradient-to-b from-background to-muted/20">
      <Container>
        <div className="mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-balance mb-3">Featured Projects</h2>
              <p className="text-lg text-muted-foreground max-w-xl">
                A curated selection of projects showcasing my expertise in building modern web applications.
              </p>
            </div>
            <Link href="/projects" className="hidden md:inline-flex">
              <Button variant="outline" className="gap-2 hover:bg-primary/5">
                View All Projects
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border bg-card overflow-hidden animate-pulse">
                <div className="h-48 md:h-56 bg-muted" />
                <div className="p-5 md:p-6 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-muted rounded-full" />
                    <div className="h-6 w-20 bg-muted rounded-full" />
                    <div className="h-6 w-14 bg-muted rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : featuredProjects.length > 0 ? (
            featuredProjects.map((ports, index) => (
              <PortfolioCard 
                key={index} 
                {...ports}
              />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground">No projects to display</p>
            </div>
          )}
        </div>

        <div className="text-center md:hidden">
          <Link href="/projects">
            <Button className="glow-primary">
              View All Projects <ArrowRight className="ml-2" size={18} />
            </Button>
          </Link>
        </div>
      </Container>
    </Section>
  )
}
