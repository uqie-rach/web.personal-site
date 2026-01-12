"use client"

import { useEffect, useRef } from "react"

export function AnimatedHero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create floating particles animation
    const particleCount = 15
    const particles: { el: HTMLDivElement; x: number; y: number; vx: number; vy: number }[] = []

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "absolute w-1 h-1 bg-primary rounded-full opacity-30"
      particle.style.left = Math.random() * 100 + "%"
      particle.style.top = Math.random() * 100 + "%"
      container.appendChild(particle)

      particles.push({
        el: particle,
        x: Math.random() * 400,
        y: Math.random() * 400,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      })
    }

    // Animation loop
    const animate = () => {
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce off edges
        if (p.x < 0 || p.x > 400) p.vx *= -1
        if (p.y < 0 || p.y > 400) p.vy *= -1

        // Keep within bounds
        p.x = Math.max(0, Math.min(400, p.x))
        p.y = Math.max(0, Math.min(400, p.y))

        p.el.style.transform = `translate(${p.x}px, ${p.y}px)`
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      particles.forEach((p) => p.el.remove())
    }
  }, [])

  return (
    <div className="relative h-96 md:h-full min-h-96 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-2xl"></div>

      {/* Animated container */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-hidden rounded-2xl"
        style={{ perspective: "1000px" }}
      >
        {/* Central animated element */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Outer rotating ring */}
            <div
              className="absolute inset-0 w-32 h-32 border border-primary/30 rounded-full animate-spin"
              style={{ animationDuration: "8s" }}
            ></div>

            {/* Middle rotating ring */}
            <div
              className="absolute inset-2 w-28 h-28 border border-accent/30 rounded-full"
              style={{ animation: "spin 6s linear infinite reverse" }}
            ></div>

            {/* Inner pulsing circle */}
            <div className="absolute inset-4 w-24 h-24 bg-gradient-to-br from-primary/40 to-accent/40 rounded-full animate-pulse"></div>

            {/* Center dot */}
            <div className="absolute inset-8 w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg shadow-primary/50"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
