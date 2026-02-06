import { ExternalLink, Github, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

interface PortfolioCardProps {
  title: string
  description: string
  publicUrl?: string
  technologies: string[]
  liveUrl?: string
  repositoryUrl?: string
  featured?: boolean
}

export function PortfolioCard({
  title,
  description,
  publicUrl,
  technologies,
  liveUrl,
  repositoryUrl,
  featured = false,
}: PortfolioCardProps) {

  return (
    <div
      className={`group relative overflow-hidden rounded-xl border border-border bg-card hover:bg-muted/50 transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 ${featured ? "md:col-span-2" : ""
        }`}
    >
      {/* Image Section */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent z-10" />
        {publicUrl ? (
          <Image
            width={100}
            height={100}
            src={publicUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-muted to-accent/20 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <ArrowUpRight className="w-10 h-10 text-primary/40" />
            </div>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center">
          <div className="flex gap-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {liveUrl && (
              <Link href={liveUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="gap-2 bg-primary/90 hover:bg-primary">
                  <ExternalLink size={14} />
                  <span>Live Demo</span>
                </Button>
              </Link>
            )}
            {repositoryUrl && (
              <Link href={repositoryUrl} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="secondary" className="gap-2">
                  <Github size={14} />
                  <span>Source</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-5 md:p-6">
        <div className="mb-4">
          <h3 className="text-lg md:text-xl font-semibold mb-2 text-foreground group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        </div>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2">
          {technologies && technologies.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-2.5 py-1 bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary text-xs font-medium rounded-md border border-border/50 hover:border-primary/30 transition-all duration-200"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
