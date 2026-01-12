import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface BlogCardProps {
  slug: string
  title: string
  description: string
  timestamp: string
  readTime?: number
  category?: string
}

export function BlogCard({ slug, title, description, timestamp, readTime = 5, category }: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <article className="group cursor-pointer p-6 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all duration-300 hover:border-primary/50 hover:shadow-md">
        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {title}
              </h3>
              {category && (
                <Badge variant="secondary" className="flex-shrink-0">
                  {category}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{description}</p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                {timestamp}
              </div>
              <div>{readTime} min read</div>
            </div>
            <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </article>
    </Link>
  )
}
