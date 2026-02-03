"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload } from "lucide-react"
import { Portfolio as PortfolioType } from "@/lib/schemas"
import Image from "next/image"
import { useFile } from "@/hooks/use-file"
import { constants } from "@/lib/constants"

interface PortfolioFormProps {
  initial?: PortfolioType
  onSubmit: (data: Omit<PortfolioType, 'id'>) => void
  isLoading?: boolean
}

export function PortfolioForm({ initial, onSubmit, isLoading = false }: PortfolioFormProps) {
  /**
   * Local State
   */
  const [title, setTitle] = useState(initial?.title || "")
  const [description, setDescription] = useState(initial?.description || "")
  const [imagePreview, setImagePreview] = useState(initial?.image?.publicUrl ?? "/placeholder.svg")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [liveUrl, setLiveUrl] = useState(initial?.liveUrl || "")
  const [repoUrl, setRepoUrl] = useState(initial?.repoUrl || "")
  const [featured, setFeatured] = useState(initial?.featured || false)
  const [techs, setTechs] = useState<string[]>(initial?.technologies || [])
  const [techInput, setTechInput] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  /**
   * Custom Hooks /. Context Management
   */
  const {
    upload,
    _delete
  } = useFile();

  /**
   * Functions
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > constants.MAX_IMAGE_SIZE) {
        alert('Max 5 MB')
        return;
      }

      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleAddTech = () => {
    if (techInput.trim() && !techs.includes(techInput.trim())) {
      setTechs([...techs, techInput.trim()])
      setTechInput("")
    }
  }

  const handleRemoveTech = (tech: string) => {
    setTechs(techs.filter((t) => t !== tech))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    let imageId = initial?.image ?? ""

    // Check if updating image
    if (imageFile) {
      if (imageId){
        // Delete old image from storage
        await _delete(initial?.image?.path)
      }

      // if success, upload new image
      const response = await upload(imageFile)
      imageId = response?.file.id ?? "";
    }

    onSubmit({
      title,
      description,
      image: imageId,
      liveUrl,
      repoUrl,
      featured,
      technologies: techs,
      order: 0
    })

    setImageFile(null)
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
              <Image
                src={imagePreview ?? "public/placeholder.svg"}
                alt="Preview"
                className="w-full h-full object-cover"
                width={100}
                height={100}
              />
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
        {techs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {techs.map((tech) => (
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
          <Label htmlFor="repoUrl">Repository URL</Label>
          <Input
            id="repoUrl"
            value={repoUrl}
            onChange={(e) => setRepoUrl(e.target.value)}
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
