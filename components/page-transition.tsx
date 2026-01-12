"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: PageTransitionProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return <div className={`transition-all duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>{children}</div>
}
