import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Section } from "@/components/section"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { ErrorBoundary } from "@/components/error-boundary"
import { PageTransition } from "@/components/page-transition"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { PortfolioSection } from "@/components/portfolio-section"
import { ExperienceTimeline } from "@/components/experience-timeline"
import { AnimatedHero } from "@/components/animated-hero"
import { TechStackSlider } from "@/components/tech-stack-slider"

export const metadata: Metadata = {
  title: "Uqie | Full Stack Developer & Designer",
  description:
    "Full stack developer specializing in creating elegant digital experiences. View my portfolio, experience, and expertise in modern web development.",
  keywords: ["full stack developer", "web development", "React", "Next.js", "portfolio"],
  openGraph: {
    title: "Uqie | Full Stack Developer",
    description: "Modern minimalist portfolio showcasing projects, experience, and technical expertise",
    type: "website",
  },
}

export default function Home() {
  return (
    <ErrorBoundary>
      <PageTransition>
        <div className="min-h-screen bg-background">
          <Navbar />

          {/* Hero Section */}
          <Section className="pt-32 pb-20 flex items-center">
            <Container className="grid md:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="animate-fade-in space-y-6">
                <div>
                  <p className="text-sm font-semibold text-primary mb-3 tracking-wide">FULL STACK DEVELOPER</p>
                  <h1 className="text-balance text-foreground">Crafting elegant digital experiences</h1>
                  <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
                    I design and build beautiful, performant web applications that solve real problems. Passionate about
                    clean code, great design, and creating meaningful user experiences.
                  </p>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="#portfolio">
                    <Button className="glow-primary w-full sm:w-auto">
                      View My Work <ArrowRight className="ml-2" size={18} />
                    </Button>
                  </Link>
                  <Link href="#contact">
                    <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                      Get In Touch
                    </Button>
                  </Link>
                </div>

                {/* Social Links */}
                <div className="flex gap-4 pt-6">
                  <Link
                    href="https://github.com/uqie-rach"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    GitHub
                  </Link>
                  <Link
                    href="https://linkedin.com/in/achmadfrachmadie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    LinkedIn
                  </Link>
                  <Link
                    href="mailto:achmadfurqonrachmadie@gmail.com"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Email
                  </Link>
                </div>
              </div>

              <AnimatedHero />
            </Container>
          </Section>

          {/* About Section */}
          <Section id="about" className="bg-muted/30">
            <Container className="max-w-3xl">
              <h2 className="text-balance mb-8">About Me</h2>
              <div className="space-y-6 text-muted-foreground leading-relaxed">
                <p>
                  I'm a passionate full stack developer with a keen eye for design and user experience. My journey in
                  tech started with a curiosity about how things work, which evolved into a love for building elegant
                  solutions to complex problems.
                </p>
                <p>
                  Over the years, I've worked on diverse projects ranging from startups to established companies, always
                  focusing on clean architecture, performance optimization, and delightful user interfaces.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new technologies, contributing to open source, or
                  sharing knowledge with the developer community through writing and speaking.
                </p>
              </div>
            </Container>
          </Section>

          {/* Portfolio Section */}
          <PortfolioSection />

          {/* Experience Timeline */}
          <ExperienceTimeline />

          {/* Tech Stack Section */}
          <TechStackSlider />

          <Footer />
        </div>
      </PageTransition>
    </ErrorBoundary>
  )
}
