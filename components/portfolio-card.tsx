import { ExternalLink, Github } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface PortfolioCardProps {
  title: string
  description: string
  image?: string
  technologies: string[]
  liveUrl?: string
  repositoryUrl?: string
  featured?: boolean
}

export function PortfolioCard({
  title,
  description,
  technologies,
  liveUrl,
  repositoryUrl,
  featured = false,
}: PortfolioCardProps) {

  return (
    <div
      className={`group relative overflow-hidden rounded-lg border border-border bg-card hover:bg-muted/50 transition-all duration-300 hover:border-primary/50 hover:shadow-md ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative p-6 flex flex-col h-full">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{description}</p>
        </div>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 mb-6 mt-auto">
          {technologies && technologies.map((tech) => (
            <span
              key={tech}
              className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex gap-3 pt-4 border-t border-border">
          {liveUrl && (
            <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="ghost" className="gap-2">
                <ExternalLink size={16} />
                <span className="text-xs">Live</span>
              </Button>
            </Link>
          )}
          {repositoryUrl && (
            <Link href={repositoryUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="ghost" className="gap-2">
                <Github size={16} />
                <span className="text-xs">Code</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
