"use client"

import { useState, useMemo, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Section } from "@/components/section"
import { Container } from "@/components/container"
import { PortfolioCard } from "@/components/portfolio-card"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageTransition } from "@/components/page-transition"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { usePortfolio } from "@/hooks/use-portfolio"
import { Portfolio } from "@/lib/schemas"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [allTechs, setAllTechs] = useState<string[] | []>([])
  const [projects, setProjects] = useState<Portfolio[] | []>([])

  const { getAll } = usePortfolio();

  useEffect(() => {
    getAll()
      .then(res => {
        const tempTechs = [...new Set(res.map(r => r.technologies).flat())]
        
        setProjects(res)
        setAllTechs(tempTechs)
      })
  }, [])


  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesTech = selectedTechs.length === 0 || selectedTechs.some((tech) => project.technologies.includes(tech))

      return matchesSearch && matchesTech
    })
  }, [searchQuery, selectedTechs, projects])

  const toggleTech = (tech: string) => {
    setSelectedTechs((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTechs([])
  }

  return (
    <ErrorBoundary>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />

          {/* Header */}
          <Section className="pt-32 pb-12 bg-muted/30">
            <Container>
              <div className="max-w-2xl">
                <h1 className="text-balance mb-4">All Projects</h1>
                <p className="text-lg text-muted-foreground">
                  Explore my complete portfolio of projects. Filter by technology or search by project name.
                </p>
              </div>
            </Container>
          </Section>

          {/* Filters */}
          <Section>
            <Container>
              <div className="space-y-6">
                {/* Search Bar */}
                <div>
                  <Input
                    placeholder="Search projects by name or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Filter by Technology:</p>
                    {(searchQuery || selectedTechs.length > 0) && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8 px-2">
                        Clear Filters
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {allTechs && allTechs.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => toggleTech(tech)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedTechs.includes(tech)
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-secondary/20 text-foreground hover:bg-secondary/40"
                          }`}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{filteredProjects.length}</span> project
                    {filteredProjects.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </Container>
          </Section>

          {/* Projects Grid */}
          <Section>
            <Container>
              {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                  {filteredProjects.map((project, index) => (
                    <PortfolioCard key={index} {...project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No projects found matching your filters.</p>
                  <Button variant="outline" onClick={clearFilters} className="bg-transparent">
                    Clear Filters
                  </Button>
                </div>
              )}
            </Container>
          </Section>

          <Footer />
        </div>
      </PageTransition>
    </ErrorBoundary>
  )
}
