"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload } from "lucide-react"
import type { BlogPost } from "@/lib/types"

interface BlogFormProps {
  initial?: BlogPost
  onSubmit: (data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => void
  isLoading?: boolean
}

export function BlogForm({ initial, onSubmit, isLoading = false }: BlogFormProps) {
  const [title, setTitle] = useState(initial?.title || "")
  const [slug, setSlug] = useState(initial?.slug || "")
  const [excerpt, setExcerpt] = useState(initial?.excerpt || "")
  const [content, setContent] = useState(initial?.content || "")
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "")
  const [coverPreview, setCoverPreview] = useState(initial?.coverImage || "")
  const [tags, setTags] = useState<string[]>(initial?.tags || [])
  const [tagInput, setTagInput] = useState("")
  const [published, setPublished] = useState(initial?.published || false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setCoverImage(result)
        setCoverPreview(result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      title,
      excerpt,
      content,
      coverImage,
      tags,
      published,
      publishedAt: published ? new Date() : undefined,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Cover Image */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Cover Image</Label>
        <div className="flex gap-4">
          <div className="flex-1">
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={24} className="mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload cover</p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          {coverPreview && (
            <div className="w-32 h-32 rounded-lg overflow-hidden border border-border flex-shrink-0">
              <img src={coverPreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Title & Slug */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value)
              if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
            }}
            placeholder="Blog post title"
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="blog-post-url"
            className="mt-2"
            required
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <Label htmlFor="excerpt">Excerpt *</Label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short summary of the post"
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-2 resize-none"
          rows={2}
          required
        />
      </div>

      {/* Content */}
      <div>
        <Label htmlFor="content">Content *</Label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your blog post content here..."
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-2 resize-none font-mono text-sm"
          rows={12}
          required
        />
        <p className="text-xs text-muted-foreground mt-2">Supports Markdown formatting</p>
      </div>

      {/* Tags */}
      <div>
        <Label>Tags</Label>
        <div className="flex gap-2 mt-2 mb-3">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
            placeholder="Add tag (Enter to add)"
            className="flex-1"
          />
          <Button type="button" onClick={handleAddTag} variant="outline">
            Add
          </Button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <div key={tag} className="inline-flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full text-sm">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Published */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="w-4 h-4"
        />
        <span className="text-sm font-medium">Publish this post</span>
      </label>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : initial ? "Update Post" : "Create Post"}
      </Button>
    </form>
  )
}
