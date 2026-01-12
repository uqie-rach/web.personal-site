import { Section } from "@/components/section"
import { Container } from "@/components/container"

const techStacks = [
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Framework" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Node.js", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "GraphQL", category: "API" },
  { name: "Docker", category: "DevOps" },
  { name: "AWS", category: "Cloud" },
  { name: "Git", category: "Tools" },
  { name: "Figma", category: "Design" },
  { name: "Jest", category: "Testing" },
]

export function TechStackGrid() {
  return (
    <Section id="tech" className="bg-muted/30">
      <Container>
        <div className="mb-12">
          <h2 className="text-balance mb-4">Technologies & Tools</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            A curated selection of modern tools and technologies I work with to build scalable, performant, and
            maintainable applications.
          </p>
        </div>

        {/* Tech Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {techStacks.map((tech) => (
            <div
              key={tech.name}
              className="group relative p-4 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all duration-300 hover:border-primary/50 cursor-default"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
              <div className="relative text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center group-hover:shadow-md group-hover:shadow-primary/30 transition-all">
                  <span className="text-lg font-bold text-primary">{tech.name.charAt(0)}</span>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {tech.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">{tech.category}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}
