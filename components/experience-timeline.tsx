"use client"

import { Section } from "@/components/section"
import { Container } from "@/components/container"
import { MapPin, Calendar } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface ExperienceItem {
  role: string
  company: string
  location: string
  startDate: string
  endDate: string
  workingStyle: string
  description: string[]
}

const experiences: ExperienceItem[] = [
  {
    role: "Fullstack AI Engineer",
    company: "Kazokku | Tukar.ai",
    location: "Brunei",
    startDate: "Jul 2025",
    endDate: "Sep 2025",
    workingStyle: "Full-time",
    description: [
      "Architected and developed AI-powered mobile app (React Native) with NestJS backend and custom ML engine using Python + FastAPI",
      "Designed end-to-end system workflow including prompt routing and model engine orchestration",
    ],
  },
  {
    role: "Fullstack Engineer",
    company: "PT. Aira Teknologi Indonesia | Bikinkonten.ai",
    location: "Malang, Indonesia",
    startDate: "Apr 2025",
    endDate: "Present",
    workingStyle: "Full-time",
    description: [
      "Architected and developed B2B features for AI content generation platform",
      "Integrated Google Gemini API for text, image, and video generation workflows",
    ],
  },
  {
    role: "Fullstack Engineer",
    company: "Ekata Tech Indonesia",
    location: "Malang, Indonesia",
    startDate: "Apr 2025",
    endDate: "Present",
    workingStyle: "Full-time",
    description: [
      "Developed and deployed RESTful APIs, increasing performance by ~30% through optimized database structure and backend logic",
      "Implemented scalable backend architecture and CI/CD pipelines",
    ],
  },
  {
    role: "Fullstack Engineer",
    company: "Tenang AI",
    location: "Yogyakarta, Indonesia",
    startDate: "Aug 2024",
    endDate: "Oct 2024",
    workingStyle: "Full-time",
    description: [
      "Designed full system architecture and database schema",
      "Applied island architecture and optimized UI rendering → improved page performance by ~85%",
      "Implemented advanced image optimization → significantly reduced initial load time",
    ],
  },
  {
    role: "Software Engineer Intern",
    company: "Zegasoft",
    location: "South Jakarta, Indonesia",
    startDate: "Mar 2024",
    endDate: "Nov 2024",
    workingStyle: "Internship",
    description: [
      "Implemented Firebase Auth & Storage in React Native app",
      "Designed PostgreSQL schema, boosting query speed by ~25%",
      "Documented APIs, improving frontend development efficiency by ~15%",
    ],
  },
  {
    role: "Frontend Developer Intern",
    company: "Core Initiative Studio",
    location: "Depok, Indonesia",
    startDate: "Aug 2023",
    endDate: "Sep 2024",
    workingStyle: "Internship",
    description: [
      "Built interactive e-commerce pages using Vue.js",
      "Enhanced UX through smooth API-driven UI and dynamic product interaction",
    ],
  },
]

export function ExperienceTimeline() {
  const [showAll, setShowAll] = useState(false)
  const displayedExperiences = showAll ? experiences : experiences.slice(0, 3)

  return (
    <Section id="experience">
      <Container className="max-w-4xl">
        <div className="mb-12">
          <h2 className="text-balance mb-4">Professional Experience</h2>
          <p className="text-lg text-muted-foreground">
            My career journey building impactful products and collaborating with talented teams.
          </p>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          <AnimatePresence>
            {displayedExperiences.map((exp, index) => (
              <motion.div
                key={`${exp.company}-${exp.role}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative pl-8 pb-8"
              >
                {/* Timeline line */}
                {index !== displayedExperiences.length - 1 && (
                  <div className="absolute left-3 top-8 w-0.5 h-24 bg-border" />
                )}

                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-7 h-7 bg-primary rounded-full border-2 border-background shadow-sm" />

                {/* Content */}
                <div className="group cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-primary font-medium">{exp.company}</p>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar size={16} />
                      {exp.startDate} — {exp.endDate}
                    </div>
                  </div>

                  {/* Meta info */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      {exp.location}
                    </div>
                    <div className="hidden sm:block">•</div>
                    <div>{exp.workingStyle}</div>
                  </div>

                  {/* Description */}
                  <ul className="space-y-2">
                    {exp.description.map((desc, i) => (
                      <li key={i} className="text-muted-foreground text-sm flex gap-3">
                        <span className="text-primary mt-1">→</span>
                        <span>{desc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {!showAll && experiences.length > 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex justify-center mt-12"
          >
            <Button onClick={() => setShowAll(true)} variant="outline" className="bg-transparent hover:bg-accent/10">
              Show All Experience
            </Button>
          </motion.div>
        )}
      </Container>
    </Section>
  )
}
