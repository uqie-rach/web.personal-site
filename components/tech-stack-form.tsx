"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import type { TechStack } from "@/lib/types"

interface TechStackFormProps {
  initial?: TechStack
  onSubmit: (data: Omit<TechStack, "id" | "createdAt" | "updatedAt">) => void
  isLoading?: boolean
}

export function TechStackForm({ initial, onSubmit, isLoading = false }: TechStackFormProps) {
  const [name, setName] = useState(initial?.name || "")
  const [category, setCategory] = useState<TechStack["category"]>(initial?.category || "frontend")
  const [icon, setIcon] = useState(initial?.icon || "")
  const [iconPreview, setIconPreview] = useState(initial?.icon || "")
  const [proficiency, setProficiency] = useState<TechStack["proficiency"]>(initial?.proficiency || "intermediate")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setIcon(result)
        setIconPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      category,
      icon,
      proficiency,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Icon Upload */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Technology Icon</Label>
        <div className="flex gap-4">
          <div className="flex-1">
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload icon</p>
              <p className="text-xs text-muted-foreground">PNG, SVG, JPG up to 2MB</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleIconUpload} className="hidden" />
          </div>

          {iconPreview && (
            <div className="w-24 h-24 rounded-lg overflow-hidden border border-border flex-shrink-0 flex items-center justify-center bg-muted/50">
              <img src={iconPreview || "/placeholder.svg"} alt="Preview" className="w-16 h-16 object-contain" />
            </div>
          )}
        </div>
      </div>

      {/* Name */}
      <div>
        <Label htmlFor="name">Technology Name *</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="React"
          className="mt-2"
          required
        />
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category">Category *</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as TechStack["category"])}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-2"
          required
        >
          <option value="frontend">Frontend</option>
          <option value="backend">Backend</option>
          <option value="design">Design</option>
          <option value="devops">DevOps</option>
        </select>
      </div>

      {/* Proficiency */}
      <div>
        <Label htmlFor="proficiency">Proficiency Level *</Label>
        <select
          id="proficiency"
          value={proficiency}
          onChange={(e) => setProficiency(e.target.value as TechStack["proficiency"])}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-2"
          required
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : initial ? "Update Technology" : "Add Technology"}
      </Button>
    </form>
  )
}
