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

  const { getAll } = usePortfolio();

  useEffect(() => {
    getAll()
      .then(res => {
        setPortfolios(res)
      })
  }, [])

  return (
    <Section id="portfolio" className="bg-muted/30">
      <Container>
        <div className="mb-12">
          <h2 className="text-balance mb-4">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A selection of projects I've built, demonstrating my expertise in full-stack development, design, and
            problem-solving.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {portfolios && portfolios.map((ports, index) => (
            <PortfolioCard key={index} {...ports} />
          ))}
        </div>

        <div className="text-center">
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
