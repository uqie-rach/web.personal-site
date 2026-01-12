"use client"

import { useState, useMemo, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Section } from "@/components/section"
import { Container } from "@/components/container"
import { BlogCard } from "@/components/blog-card"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageTransition } from "@/components/page-transition"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useBlog } from "@/hooks/use-blog"
import { Blog } from "@/lib/schemas"

interface BlogPost {
  slug: string
  title: string
  description: string
  timestamp: string
  readTime: number
  category: string
  categorySlug: string
}

const POSTS_PER_PAGE = 6

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [allCategories, setAllCategories] = useState<string[] | []>([]);
  const [blogs, setBlogs] = useState<Blog[] | []>([])

  const { getAll } = useBlog()

  const filteredPosts = useMemo(() => {
    console.log(blogs)
    return blogs.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = !selectedCategory || post.tags.toLowerCase() === selectedCategory

      console.log(matchesSearch, matchesCategory)
      return matchesSearch && matchesCategory
    })
  }, [searchQuery, selectedCategory, blogs])

  useEffect(() => {
    getAll()
      .then(res => {
        setBlogs(res)
        setAllCategories(res.map(r => r.tags))
        // setSelectedCategory(null)
      })
  }, [])

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
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${!selectedCategory
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "bg-secondary/20 text-foreground hover:bg-secondary/40"
                        }`}
                    >
                      All Posts
                    </button>
                    {allCategories && allCategories.map((cat) => {
                      return (
                        <button
                          key={cat.toLowerCase()}
                          onClick={() => {
                            setSelectedCategory(cat.toLowerCase())
                            setCurrentPage(1)
                          }}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${selectedCategory === cat.toLowerCase()
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-secondary/20 text-foreground hover:bg-secondary/40"
                            }`}
                        >
                          {cat}
                        </button>
                      )
                    })}
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
