"use client"

import Link from "next/link"
import { Section } from "@/components/section"
import { Container } from "@/components/container"
import { PortfolioCard } from "@/components/portfolio-card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

const projects = [
  {
    title: "E-Commerce Platform",
    description:
      "A full-stack e-commerce platform with real-time inventory management, payment processing, and admin dashboard. Built with Next.js and PostgreSQL.",
    techStacks: ["Next.js", "React", "TypeScript", "PostgreSQL", "Stripe"],
    liveUrl: "#",
    repositoryUrl: "#",
    featured: true,
  },
  {
    title: "Task Management App",
    description: "Collaborative task management tool with real-time updates, team workspaces, and detailed analytics.",
    techStacks: ["React", "Firebase", "Tailwind CSS"],
    liveUrl: "#",
    repositoryUrl: "#",
  },
  {
    title: "Design System",
    description: "Comprehensive component library with documentation, built with React and Storybook.",
    techStacks: ["React", "Storybook", "TypeScript"],
    repositoryUrl: "#",
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time analytics dashboard with interactive charts and customizable widgets.",
    techStacks: ["Next.js", "Recharts", "Tailwind CSS"],
    liveUrl: "#",
  },
  {
    title: "Mobile App",
    description: "Cross-platform mobile application for fitness tracking with social features.",
    techStacks: ["React Native", "Firebase", "Redux"],
    repositoryUrl: "#",
  },
]

export function PortfolioSection() {
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
          {projects.map((project, index) => (
            <PortfolioCard key={index} {...project} />
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
