"use client"

import { useTheme } from "./theme-provider"
import { Moon, Sun } from "lucide-react"
import { Button } from "./ui/button"

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    if (resolvedTheme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} className="w-9 h-9">
      {resolvedTheme === "dark" ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
