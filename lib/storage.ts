// Mock storage layer - can be replaced with real database/API
import type { Portfolio, Experience, BlogPost, TechStack, AdminUser } from "./types"

const STORAGE_PREFIX = "portfolio_"

// Portfolio
export const portfolioStorage = {
  getAll: (): Portfolio[] => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}portfolios`)
    return data ? JSON.parse(data) : []
  },
  getById: (id: string): Portfolio | null => {
    const all = portfolioStorage.getAll()
    return all.find((p) => p.id === id) || null
  },
  create: (portfolio: Omit<Portfolio, "id" | "createdAt" | "updatedAt">): Portfolio => {
    const newPortfolio: Portfolio = {
      ...portfolio,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const all = portfolioStorage.getAll()
    all.push(newPortfolio)
    localStorage.setItem(`${STORAGE_PREFIX}portfolios`, JSON.stringify(all))
    return newPortfolio
  },
  update: (id: string, updates: Partial<Portfolio>): Portfolio => {
    const all = portfolioStorage.getAll()
    const index = all.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Portfolio not found")
    all[index] = { ...all[index], ...updates, updatedAt: new Date() }
    localStorage.setItem(`${STORAGE_PREFIX}portfolios`, JSON.stringify(all))
    return all[index]
  },
  delete: (id: string): void => {
    const all = portfolioStorage.getAll()
    const filtered = all.filter((p) => p.id !== id)
    localStorage.setItem(`${STORAGE_PREFIX}portfolios`, JSON.stringify(filtered))
  },
}

// Experience
export const experienceStorage = {
  getAll: (): Experience[] => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}experience`)
    return data ? JSON.parse(data) : []
  },
  getById: (id: string): Experience | null => {
    const all = experienceStorage.getAll()
    return all.find((e) => e.id === id) || null
  },
  create: (experience: Omit<Experience, "id" | "createdAt" | "updatedAt">): Experience => {
    const newExperience: Experience = {
      ...experience,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const all = experienceStorage.getAll()
    all.push(newExperience)
    localStorage.setItem(`${STORAGE_PREFIX}experience`, JSON.stringify(all))
    return newExperience
  },
  update: (id: string, updates: Partial<Experience>): Experience => {
    const all = experienceStorage.getAll()
    const index = all.findIndex((e) => e.id === id)
    if (index === -1) throw new Error("Experience not found")
    all[index] = { ...all[index], ...updates, updatedAt: new Date() }
    localStorage.setItem(`${STORAGE_PREFIX}experience`, JSON.stringify(all))
    return all[index]
  },
  delete: (id: string): void => {
    const all = experienceStorage.getAll()
    const filtered = all.filter((e) => e.id !== id)
    localStorage.setItem(`${STORAGE_PREFIX}experience`, JSON.stringify(filtered))
  },
}

// Blog Posts
export const blogStorage = {
  getAll: (): BlogPost[] => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}blog`)
    return data ? JSON.parse(data) : []
  },
  getById: (id: string): BlogPost | null => {
    const all = blogStorage.getAll()
    return all.find((b) => b.id === id) || null
  },
  create: (post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): BlogPost => {
    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const all = blogStorage.getAll()
    all.push(newPost)
    localStorage.setItem(`${STORAGE_PREFIX}blog`, JSON.stringify(all))
    return newPost
  },
  update: (id: string, updates: Partial<BlogPost>): BlogPost => {
    const all = blogStorage.getAll()
    const index = all.findIndex((b) => b.id === id)
    if (index === -1) throw new Error("Blog post not found")
    all[index] = { ...all[index], ...updates, updatedAt: new Date() }
    localStorage.setItem(`${STORAGE_PREFIX}blog`, JSON.stringify(all))
    return all[index]
  },
  delete: (id: string): void => {
    const all = blogStorage.getAll()
    const filtered = all.filter((b) => b.id !== id)
    localStorage.setItem(`${STORAGE_PREFIX}blog`, JSON.stringify(filtered))
  },
}

// Tech Stack
export const techStackStorage = {
  getAll: (): TechStack[] => {
    const data = localStorage.getItem(`${STORAGE_PREFIX}tech_stack`)
    return data ? JSON.parse(data) : []
  },
  getById: (id: string): TechStack | null => {
    const all = techStackStorage.getAll()
    return all.find((t) => t.id === id) || null
  },
  create: (tech: Omit<TechStack, "id" | "createdAt" | "updatedAt">): TechStack => {
    const newTech: TechStack = {
      ...tech,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const all = techStackStorage.getAll()
    all.push(newTech)
    localStorage.setItem(`${STORAGE_PREFIX}tech_stack`, JSON.stringify(all))
    return newTech
  },
  update: (id: string, updates: Partial<TechStack>): TechStack => {
    const all = techStackStorage.getAll()
    const index = all.findIndex((t) => t.id === id)
    if (index === -1) throw new Error("Tech stack not found")
    all[index] = { ...all[index], ...updates, updatedAt: new Date() }
    localStorage.setItem(`${STORAGE_PREFIX}tech_stack`, JSON.stringify(all))
    return all[index]
  },
  delete: (id: string): void => {
    const all = techStackStorage.getAll()
    const filtered = all.filter((t) => t.id !== id)
    localStorage.setItem(`${STORAGE_PREFIX}tech_stack`, JSON.stringify(filtered))
  },
}

// Admin authentication
export const authStorage = {
  login: (email: string, password: string): AdminUser | null => {
    if (email === "admin@portfolio.com" && password === "admin123") {
      const user: AdminUser = {
        id: "1",
        email,
        password,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      localStorage.setItem(`${STORAGE_PREFIX}user`, JSON.stringify(user))
      localStorage.setItem(`${STORAGE_PREFIX}token`, "mock-jwt-token")
      return user
    }
    return null
  },
  logout: (): void => {
    localStorage.removeItem(`${STORAGE_PREFIX}user`)
    localStorage.removeItem(`${STORAGE_PREFIX}token`)
  },
  getCurrentUser: (): AdminUser | null => {
    const user = localStorage.getItem(`${STORAGE_PREFIX}user`)
    return user ? JSON.parse(user) : null
  },
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(`${STORAGE_PREFIX}.isAuthenticated`)
  },
}
