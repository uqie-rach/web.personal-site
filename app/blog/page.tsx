"use client"

import { useState, useMemo } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Section } from "@/components/section"
import { Container } from "@/components/container"
import { BlogCard } from "@/components/blog-card"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageTransition } from "@/components/page-transition"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BlogPost {
  slug: string
  title: string
  description: string
  timestamp: string
  readTime: number
  category: string
  categorySlug: string
}

const allBlogPosts: BlogPost[] = [
  {
    slug: "building-scalable-applications",
    title: "Building Scalable Applications with Next.js",
    description:
      "A comprehensive guide to architecting performant web applications. Learn about server components, caching strategies, and optimization techniques.",
    timestamp: "Dec 15, 2024",
    readTime: 8,
    category: "Performance",
    categorySlug: "performance",
  },
  {
    slug: "react-performance-optimization",
    title: "React Performance Optimization Tips",
    description:
      "Discover practical techniques to improve your React app performance. From memo to useDeferredValue, understand the tools available to developers.",
    timestamp: "Dec 10, 2024",
    readTime: 6,
    category: "React",
    categorySlug: "react",
  },
  {
    slug: "typescript-best-practices",
    title: "TypeScript Best Practices in 2024",
    description:
      "Master TypeScript with industry best practices. Type safety, error handling, and advanced typing patterns for production applications.",
    timestamp: "Dec 1, 2024",
    readTime: 10,
    category: "TypeScript",
    categorySlug: "typescript",
  },
  {
    slug: "css-grid-layouts",
    title: "Mastering CSS Grid Layouts",
    description:
      "Learn how to create complex responsive layouts with CSS Grid. Examples range from simple grids to sophisticated multi-column designs.",
    timestamp: "Nov 25, 2024",
    readTime: 7,
    category: "CSS",
    categorySlug: "css",
  },
  {
    slug: "api-design-patterns",
    title: "RESTful API Design Patterns",
    description:
      "Best practices for designing robust and maintainable REST APIs. Cover versioning, error handling, authentication, and documentation.",
    timestamp: "Nov 18, 2024",
    readTime: 9,
    category: "Backend",
    categorySlug: "backend",
  },
  {
    slug: "web-accessibility",
    title: "Building Accessible Web Experiences",
    description:
      "A guide to creating inclusive web applications. ARIA, semantic HTML, keyboard navigation, and testing for accessibility compliance.",
    timestamp: "Nov 10, 2024",
    readTime: 8,
    category: "Accessibility",
    categorySlug: "accessibility",
  },
  {
    slug: "nextjs-server-actions",
    title: "Mastering Next.js Server Actions",
    description:
      "Deep dive into Next.js Server Actions for handling form submissions and mutations. Learn about error handling and best practices.",
    timestamp: "Nov 5, 2024",
    readTime: 7,
    category: "Next.js",
    categorySlug: "nextjs",
  },
  {
    slug: "tailwind-css-advanced",
    title: "Advanced Tailwind CSS Techniques",
    description:
      "Explore advanced Tailwind CSS features including custom utilities, plugin development, and performance optimization strategies.",
    timestamp: "Oct 28, 2024",
    readTime: 8,
    category: "CSS",
    categorySlug: "css",
  },
]

const allCategories = Array.from(new Set(allBlogPosts.map((p) => p.category)))
  .map((cat) => ({
    label: cat,
    slug: allBlogPosts.find((p) => p.category === cat)?.categorySlug || cat.toLowerCase(),
  }))
  .sort((a, b) => a.label.localeCompare(b.label))

const POSTS_PER_PAGE = 6

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredPosts = useMemo(() => {
    return allBlogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !selectedCategory || post.categorySlug === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory])

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = filteredPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory(null)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
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
                <h1 className="text-balance mb-4">Blog</h1>
                <p className="text-lg text-muted-foreground">
                  Thoughts on web development, design, and building digital products. Latest insights and tutorials.
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
                    placeholder="Search blog posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Filter by Category:</p>
                    {(searchQuery || selectedCategory) && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs h-8 px-2">
                        Clear Filters
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSelectedCategory(null)
                        setCurrentPage(1)
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                        !selectedCategory
                          ? "bg-primary text-primary-foreground shadow-md"
                          : "bg-secondary/20 text-foreground hover:bg-secondary/40"
                      }`}
                    >
                      All Posts
                    </button>
                    {allCategories.map((cat) => (
                      <button
                        key={cat.slug}
                        onClick={() => {
                          setSelectedCategory(cat.slug)
                          setCurrentPage(1)
                        }}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                          selectedCategory === cat.slug
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-secondary/20 text-foreground hover:bg-secondary/40"
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Results Count */}
                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{paginatedPosts.length}</span> of{" "}
                    <span className="font-semibold text-foreground">{filteredPosts.length}</span> post
                    {filteredPosts.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </Container>
          </Section>

          {/* Blog Grid */}
          <Section>
            <Container>
              {paginatedPosts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 animate-fade-in">
                    {paginatedPosts.map((post) => (
                      <BlogCard key={post.slug} {...post} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 py-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="bg-transparent"
                      >
                        Previous
                      </Button>

                      <div className="flex gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                            className={currentPage !== page ? "bg-transparent" : ""}
                          >
                            {page}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="bg-transparent"
                      >
                        Next
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No blog posts found matching your filters.</p>
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
