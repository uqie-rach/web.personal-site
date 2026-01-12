"use client"

import { Section } from "@/components/section"
import { Container } from "@/components/container"
import { MapPin, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Experience } from "@/lib/schemas"
import { useExperience } from "@/hooks/use-experience"
import { extractStrings } from "@/lib/utils"

export function ExperienceTimeline() {
  const [showAll, setShowAll] = useState(false)

  // experimental real setup
  const [exps, setExps] = useState<Experience[] | []>([])

  const { getAll } = useExperience();

  useEffect(() => {
    getAll().then((res) => {
      setExps(res)
    })
  }, [])


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
            {exps?.slice(0, showAll ? exps.length : 3).map((exp, index) => (
              <motion.div
                key={`${exp.company}-${exp.title}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="relative pl-8 pb-8"
              >
                {/* Timeline line */}
                {index !== exps?.length - 1 && (
                  <div className="absolute left-3 top-8 w-0.5 h-24 bg-border" />
                )}

                {/* Timeline dot */}
                <div className="absolute left-0 top-1.5 w-7 h-7 bg-primary rounded-full border-2 border-background shadow-sm" />

                {/* Content */}
                <div className="group cursor-pointer">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {exp.title}
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
                    <div>{exp.workStyle}</div>
                  </div>

                  {/* Description */}
                  <ul className="space-y-2">
                    {exp?.description && exp?.description.map((desc, i) => (
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

        {!showAll && exps && exps?.length > 2 && (
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
