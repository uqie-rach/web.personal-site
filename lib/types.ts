import { Portfolio as PortfolioSchema } from "./schemas"

export interface ImageType {
  id: string
  path: string
  publicUrl: string
}

export interface Portfolio {
  id: string
  title: string
  description: string
  image?: ImageType
  techStacks: string[]
  liveUrl?: string
  repoUrl?: string
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: Date
  endDate?: Date
  current: boolean
  workStyle: string
  accomplishments: string[]
  createdAt: Date
  updatedAt: Date
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage?: string
  tags: string[]
  published: boolean
  publishedAt?: Date
  createdAt: Date
  updatedAt: Date
}

export interface TechStack {
  id: string
  name: string
  category: string
  icon?: string
  proficiency: "beginner" | "intermediate" | "advanced" | "expert"
  createdAt: Date
  updatedAt: Date
}

export interface AdminUser {
  id: string
  email: string
  password: string
  role: "admin" | "editor"
  createdAt: Date
  updatedAt: Date
}

export interface LoginResponse {
  refreshToken: string
  token: string
  tokenExpires: string
  user: User
}

export interface User {
  id: string
  email: string
  provider: string
  socialId: string
  firstName: string
  lastName: string
  role: Role
  status: Status
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
  portfolios: PortfolioSchema[]
}

export interface Role {
  id: string
  name: string
}

export interface Status {
  id: string
  name: string
}