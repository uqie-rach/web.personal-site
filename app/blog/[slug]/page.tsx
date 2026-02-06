"use client";

import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Section } from "@/components/section"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"
import { useBlog } from "@/hooks/use-blog"
import { Skeleton } from "@/components/ui/skeleton"

interface BlogPostProps {
  params: Promise<{
    slug: string
  }>
}

export default function BlogPost({ params }: BlogPostProps) {
  const [slug, setSlug] = useState<string>("")
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const { getById } = useBlog()

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug)
    })
  }, [params])

  useEffect(() => {
    if (slug) {
      getById(slug).then((data) => {
        setPost(data)
        setLoading(false)
      })
    }
  }, [slug, getById])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Section className="pt-32 pb-12 bg-muted/30">
          <Container className="max-w-3xl">
            <Skeleton className="h-8 w-32 mb-6" />
            <Skeleton className="h-10 w-full mb-4" />
            <Skeleton className="h-6 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </Container>
        </Section>
        <Section>
          <Container className="max-w-3xl">
            <Skeleton className="h-64 w-full" />
          </Container>
        </Section>
        <Footer />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Navbar />
        <Container className="text-center py-32">
          <h1 className="mb-4">Post not found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </Container>
      </div>
    )
  }

  // Calculate read time (approximate: 200 words per minute)
  const wordCount = post.content?.split(/\s+/).length || 0
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Article Header */}
      <Section className="pt-32 pb-12 bg-muted/30">
        <Container className="max-w-3xl">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-6 gap-2">
              <ArrowLeft size={16} />
              Back to Blog
            </Button>
          </Link>

          <h1 className="text-balance mb-6">{post.title}</h1>

          <div className="flex flex-col sm:flex-row gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              }) : new Date(post.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric"
              })}
            </div>
            <div className="hidden sm:block">•</div>
            <div>{readTime} min read</div>
            {post.createdBy && (
              <>
                <div className="hidden sm:block">•</div>
                <div>By {post.createdBy.firstName} {post.createdBy.lastName}</div>
              </>
            )}
          </div>
        </Container>
      </Section>

      {/* Article Content */}
      <Section>
        <Container className="max-w-3xl">
          <article className="prose prose-invert max-w-none">
            <div className="prose-sm md:prose space-y-6" dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Tags */}
          {post.tags && (
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.split(",").map((tag: string) => (
                <span key={tag} className="bg-accent/10 px-3 py-1 rounded-full text-sm">
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}

          {/* Article Footer */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Written by</p>
                <p className="font-semibold text-foreground">
                  {post.createdBy?.firstName} {post.createdBy?.lastName}
                </p>
              </div>
              <Link href="/blog">
                <Button>Back to Blog</Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <Footer />
    </div>
  )
}
