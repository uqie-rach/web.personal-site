"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "light" | "dark" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const storedTheme = localStorage.getItem("theme") as Theme | null
    const initialTheme = storedTheme || "system"
    setThemeState(initialTheme)
    applyTheme(initialTheme)
  }, [])

  const applyTheme = (themeToApply: Theme) => {
    const htmlElement = document.documentElement
    let finalTheme: "light" | "dark"

    if (themeToApply === "system") {
      finalTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    } else {
      finalTheme = themeToApply
    }

    setResolvedTheme(finalTheme)

    if (finalTheme === "dark") {
      htmlElement.classList.add("dark")
    } else {
      htmlElement.classList.remove("dark")
    }
  }

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("theme", newTheme)
    applyTheme(newTheme)
  }

  return <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider")
  }
  return context
}
