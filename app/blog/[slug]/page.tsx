import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Section } from "@/components/section"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"

interface BlogPostProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPost({ params }: BlogPostProps) {
  // Sample blog post data - in production, fetch from database or file system
  const posts: Record<string, any> = {
    "building-scalable-applications": {
      title: "Building Scalable Applications with Next.js",
      timestamp: "Dec 15, 2024",
      readTime: 8,
      author: "Uqie",
      content: `
        <h2>Introduction</h2>
        <p>
          Building scalable applications requires careful planning and architectural decisions. 
          Next.js provides powerful tools to help you create applications that grow with your needs.
        </p>
        
        <h2>Server Components</h2>
        <p>
          React Server Components revolutionize how we think about data fetching and rendering. 
          They allow you to fetch data directly in components without creating API routes.
        </p>
        
        <h3>Benefits</h3>
        <ul>
          <li>Direct database access</li>
          <li>Reduced bundle size</li>
          <li>Better security</li>
          <li>Simplified data fetching</li>
        </ul>
        
        <h2>Caching Strategies</h2>
        <p>
          Implementing proper caching is crucial for performance. Next.js offers multiple caching layers
          including static generation, incremental static regeneration, and dynamic rendering.
        </p>
      `,
    },
    "react-performance-optimization": {
      title: "React Performance Optimization Tips",
      timestamp: "Dec 10, 2024",
      readTime: 6,
      author: "Uqie",
      content: `
        <h2>Performance Matters</h2>
        <p>
          React applications can become slow as they grow. Understanding performance profiling and optimization
          techniques is essential for maintaining responsive applications.
        </p>
        
        <h2>Key Optimization Techniques</h2>
        <h3>Code Splitting</h3>
        <p>Break your application into smaller chunks that load only when needed.</p>
        
        <h3>Memoization</h3>
        <p>Use React.memo and useMemo to prevent unnecessary re-renders.</p>
        
        <h3>Lazy Loading</h3>
        <p>Defer loading of components and assets until they're needed.</p>
      `,
    },
  }
  let slug = (await params).slug;
  const post = posts[slug]

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
              {post.timestamp}
            </div>
            <div className="hidden sm:block">•</div>
            <div>{post.readTime} min read</div>
            <div className="hidden sm:block">•</div>
            <div>By {post.author}</div>
          </div>
        </Container>
      </Section>

      {/* Article Content */}
      <Section>
        <Container className="max-w-3xl">
          <article className="prose prose-invert max-w-none">
            <div className="prose-sm md:prose space-y-6" dangerouslySetInnerHTML={{ __html: post.content }} />
          </article>

          {/* Article Footer */}
          <div className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Written by</p>
                <p className="font-semibold text-foreground">{post.author}</p>
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
