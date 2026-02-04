import { z } from "zod"

// Portfolio Schema
export const portfolioSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  image: z.any(),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  liveUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  repoUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  order: z.number().optional(),
})

export type Portfolio = z.infer<typeof portfolioSchema>

// Experience Schema
export const experienceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Job title is required").max(100, "Title must be less than 100 characters"),
  company: z.string().min(1, "Company name is required").max(100, "Company name must be less than 100 characters"),
  location: z.string().min(1, "Location is required").max(50, "Location must be less than 50 characters"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().or(z.literal("")),
  isCurrently: z.boolean().default(false),
  workStyle: z.enum(["Full-time", "Part-time", "Contract", "Freelance"], {
    errorMap: () => ({ message: "Please select a valid work style" }),
  }),
  description: z.array(z.string()).min(1, "Description is required").max(500, "Description must be less than 500 characters").default([]),
  accomplishments: z.array(z.string().max(200, "Max 200 characters")).default([]),
  order: z.number().default(0),
})

export type Experience = z.infer<typeof experienceSchema>

// Blog Schema
export const blogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required").max(150, "Title must be less than 150 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  excerpt: z.string().optional(),
  description: z.string().min(1, "Description is required").max(200, "Description must be less than 200 characters"),
  content: z.string().min(1, "Content is required").max(50000, "Content must be less than 50000 characters"),
  coverImage: z.string().min(1, "Cover image is required"),
  tags: z.string().min(1, "At least one tag is required"),
  published: z.boolean().default(false),
  publishedAt: z.string().optional(),
  order: z.number().default(0),
})

export type Blog = z.infer<typeof blogSchema>

// Tech Stack Schema
export const techStackSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Technology name is required").max(50, "Name must be less than 50 characters"),
  category: z.enum(["Frontend", "Backend", "DevOps", "Design", "Other"], {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  icon: z.string().min(1, "Icon is required"),
  proficiency: z.enum(["Beginner", "Intermediate", "Advanced", "Expert"], {
    errorMap: () => ({ message: "Please select a valid proficiency level" }),
  }),
  order: z.number().default(0),
})

export type TechStack = z.infer<typeof techStackSchema>

// Auth Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export type LoginFormData = z.infer<typeof loginSchema>
