import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface SectionProps {
  id?: string
  className?: string
  children: ReactNode
}

export function Section({ id, className, children }: SectionProps) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}
