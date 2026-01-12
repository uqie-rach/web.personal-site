"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload } from "lucide-react"
import type { Portfolio } from "@/lib/types"

interface PortfolioFormProps {
  initial?: Portfolio
  onSubmit: (data: Omit<Portfolio, "id" | "createdAt" | "updatedAt">) => void
  isLoading?: boolean
}

export function PortfolioForm({ initial, onSubmit, isLoading = false }: PortfolioFormProps) {
  const [title, setTitle] = useState(initial?.title || "")
  const [description, setDescription] = useState(initial?.description || "")
  const [image, setImage] = useState(initial?.image || "")
  const [imagePreview, setImagePreview] = useState(initial?.image || "")
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl || "")
  const [repositoryUrl, setRepositoryUrl] = useState(initial?.repositoryUrl || "")
  const [featured, setFeatured] = useState(initial?.featured || false)
  const [techStacks, setTechStacks] = useState<string[]>(initial?.techStacks || [])
  const [techInput, setTechInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setImage(result)
        setImagePreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddTech = () => {
    if (techInput.trim() && !techStacks.includes(techInput.trim())) {
      setTechStacks([...techStacks, techInput.trim()])
      setTechInput("")
    }
  }

  const handleRemoveTech = (tech: string) => {
    setTechStacks(techStacks.filter((t) => t !== tech))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      description,
      image,
      liveUrl,
      repositoryUrl,
      featured,
      techStacks,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Image Upload */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Project Image</Label>
        <div className="flex gap-4">
          <div className="flex-1">
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload image</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          {imagePreview && (
            <div className="w-32 h-32 rounded-lg overflow-hidden border border-border flex-shrink-0">
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <Label htmlFor="title">Project Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E-Commerce Platform"
          className="mt-2"
          required
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Project description..."
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-2 resize-none"
          rows={4}
          required
        />
      </div>

      {/* Tech Stacks */}
      <div>
        <Label>Technologies *</Label>
        <div className="flex gap-2 mt-2 mb-3">
          <Input
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTech())}
            placeholder="Add technology (Enter to add)"
            className="flex-1"
          />
          <Button type="button" onClick={handleAddTech} variant="outline">
            Add
          </Button>
        </div>
        {techStacks.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techStacks.map((tech) => (
              <div key={tech} className="inline-flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full text-sm">
                {tech}
                <button type="button" onClick={() => handleRemoveTech(tech)} className="hover:text-destructive">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* URLs */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="liveUrl">Live URL</Label>
          <Input
            id="liveUrl"
            value={liveUrl}
            onChange={(e) => setLiveUrl(e.target.value)}
            placeholder="https://example.com"
            type="url"
            className="mt-2"
          />
        </div>
        <div>
          <Label htmlFor="repositoryUrl">Repository URL</Label>
          <Input
            id="repositoryUrl"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            placeholder="https://github.com/..."
            type="url"
            className="mt-2"
          />
        </div>
      </div>

      {/* Featured */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="w-4 h-4" />
        <span className="text-sm font-medium">Featured Project</span>
      </label>

      {/* Submit */}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : initial ? "Update Project" : "Create Project"}
      </Button>
    </form>
  )
}
