"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Home, Briefcase, BookOpen, MoreHorizontal, Zap } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Projects", href: "/projects", icon: Briefcase },
]

const addOnsMenu = [{ label: "Compound Interest Calculator", href: "/features", icon: Zap }]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-bold text-xl tracking-tight text-foreground hover:text-primary transition-colors duration-300"
          >
            Uqie
          </Link>

          {/* Desktop Menu - Icon Only */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} title={item.label}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`transition-all duration-300 relative group ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10 scale-110"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon size={20} />
                    {/* Tooltip */}
                    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      {item.label}
                    </span>
                  </Button>
                </Link>
              )
            })}

            {/* Add-Ons Dropdown */}
            <div className="relative group ml-2 pl-2 border-l border-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpenDropdown(openDropdown === "addons" ? null : "addons")}
                className="text-muted-foreground hover:text-foreground transition-all duration-300 group"
              >
                <MoreHorizontal size={20} />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Add-Ons
                </span>
              </Button>

              {/* Dropdown Menu */}
              {openDropdown === "addons" && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50 animate-fade-in">
                  {addOnsMenu.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setOpenDropdown(null)}
                        className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors"
                      >
                        <Icon size={16} className="text-primary" />
                        <span>{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Theme Toggle & Mobile Menu */}
          <div className="flex items-center gap-2">
            <ThemeToggle />

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent/10 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-sm pb-4 space-y-2 animate-fade-in">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-sm font-medium transition-all duration-300 ${
                    isActive(item.href) ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}

            <div className="border-t border-border pt-2 mt-2">
              <p className="text-xs font-semibold text-muted-foreground px-4 mb-2">Add-Ons</p>
              {addOnsMenu.map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="block pl-5">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
