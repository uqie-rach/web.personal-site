"use client"

import { motion } from "framer-motion"
import {
  SiNextdotjs,
  SiNestjs,
  SiAngular,
  SiGo,
  SiTypescript,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiNginx,
  SiPython,
  SiJenkins,
  SiJest,
  SiGit,
} from "react-icons/si"

const techStackItems = [
  { name: "Next.js", icon: SiNextdotjs, color: "text-black dark:text-white" },
  { name: "Next.js", icon: SiNextdotjs, color: "text-black dark:text-white" },
  { name: "Nest.js", icon: SiNestjs, color: "text-red-600" },
  { name: "Angular", icon: SiAngular, color: "text-red-500" },
  { name: "Go", icon: SiGo, color: "text-cyan-400" },
  { name: "TypeScript", icon: SiTypescript, color: "text-blue-600" },
  { name: "TailwindCSS", icon: SiTailwindcss, color: "text-cyan-500" },
  { name: "MongoDB", icon: SiMongodb, color: "text-green-500" },
  { name: "PostgreSQL", icon: SiPostgresql, color: "text-blue-700" },
  { name: "Redis", icon: SiRedis, color: "text-red-600" },
  { name: "Docker", icon: SiDocker, color: "text-blue-500" },
  { name: "Nginx", icon: SiNginx, color: "text-green-600" },
  { name: "Python", icon: SiPython, color: "text-blue-400" },
  { name: "Jenkins", icon: SiJenkins, color: "text-red-700" },
  { name: "Jest", icon: SiJest, color: "text-red-500" },
  { name: "Git", icon: SiGit, color: "text-orange-600" },
]

export function TechStackSlider() {
  // Duplicate items for seamless infinite scroll
  const duplicatedItems = [...techStackItems, ...techStackItems]

  return (
    <section className="w-screen relative py-20 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
      {/* Tilted container */}
      <div className="relative h-80">
        <motion.div
          className="absolute inset-0 flex items-center"
          style={{
            rotateZ: -40,
          }}
        >
          {/* Slider track */}
          <motion.div
            className="flex gap-8 whitespace-nowrap"
            animate={{
              x: [0, -2400],
            }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          >
            {duplicatedItems.map((tech, index) => {
              const Icon = tech.icon
              return (
                <motion.div
                  key={`${tech.name}-${index}`}
                  className="flex flex-col items-center justify-center gap-2 min-w-max px-4"
                  whileHover={{
                    scale: 1.1,
                    y: -5,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                  }}
                >
                  {/* Icon container - stays upright */}
                  <motion.div
                    style={{
                      rotateZ: 40,
                    }}
                    className="flex items-center justify-center"
                  >
                    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-lg hover:shadow-primary/20 transition-shadow duration-300">
                      <Icon className={`${tech.color} w-10 h-10`} />
                    </div>
                  </motion.div>

                  {/* Label - stays upright */}
                  <motion.p
                    style={{
                      rotateZ: 40,
                    }}
                    className="mt-2 text-sm font-semibold text-foreground text-center whitespace-normal w-20"
                  >
                    {tech.name}
                  </motion.p>
                </motion.div>
              )
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Gradient fade edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
    </section>
  )
}
