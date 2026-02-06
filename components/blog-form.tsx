"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload, Search, ChevronDown, ChevronUp } from "lucide-react"
import type { Blog } from "@/lib/schemas"
import { useTags, type Tag } from "@/hooks/use-tags"

interface BlogFormProps {
  initial?: Blog
  onSubmit: (data: Omit<Blog, "id" | "createdAt" | "updatedAt">) => void
  isLoading?: boolean
  selectedTags?: string[]
  onTagsChange?: (tags: string[]) => void
}

export function BlogForm({ initial, onSubmit, isLoading = false, selectedTags = [], onTagsChange }: BlogFormProps) {
  const [title, setTitle] = useState(initial?.title || "")
  const [slug, setSlug] = useState(initial?.slug || "")
  const [description, setDescription] = useState(initial?.description || "")
  const [content, setContent] = useState(initial?.content || "")
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "")
  const [coverPreview, setCoverPreview] = useState(initial?.coverImage || "")
  const [published, setPublished] = useState(initial?.published || false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Tags search state
  const [tagSearch, setTagSearch] = useState("")
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
  const tagDropdownRef = useRef<HTMLDivElement>(null)

  const { getAll: getTags, isLoading: isTagsLoading } = useTags()

  useEffect(() => {
    if (initial?.tags) {
      const initialTags = initial.tags.split(",").map(t => t.trim())
      onTagsChange?.(initialTags)
    }
  }, [initial?.tags, onTagsChange])

  useEffect(() => {
    loadTags(tagSearch)
  }, [tagSearch])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tagDropdownRef.current && !tagDropdownRef.current.contains(event.target as Node)) {
        setIsTagDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const loadTags = async (search: string = "") => {
    const response = await getTags(50, 1, search)
    setAvailableTags(response.data.filter(t => !selectedTags.includes(t.name)))
  }

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

  const handleAddTag = (tagName: string) => {
    if (tagName.trim() && !selectedTags.includes(tagName.trim())) {
      onTagsChange?.([...selectedTags, tagName.trim()])
      setTagSearch("")
      loadTags("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    onTagsChange?.(selectedTags.filter((t) => t !== tag))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      slug: slug || title.toLowerCase().replace(/\s+/g, "-"),
      title,
      description,
      content,
      coverImage,
      tags: selectedTags.join(","),
      published,
      publishedAt: published ? new Date().toISOString() : undefined,
      order: initial?.order ?? 0,
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

      {/* Description */}
      <div>
        <Label htmlFor="description">Description *</Label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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

      {/* Tags - Searchable Select */}
      <div ref={tagDropdownRef} className="relative">
        <Label>Tags</Label>
        <div className="relative mt-2">
          <div
            className="border border-border rounded-md bg-background cursor-pointer"
            onClick={() => setIsTagDropdownOpen(!isTagDropdownOpen)}
          >
            <div className="flex items-center px-3 py-2">
              <Search size={16} className="text-muted-foreground mr-2" />
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => {
                  setTagSearch(e.target.value)
                  if (!isTagDropdownOpen) setIsTagDropdownOpen(true)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    if (tagSearch.trim()) {
                      handleAddTag(tagSearch)
                    }
                  }
                }}
                placeholder="Search or add tag (Enter to add)..."
                className="flex-1 bg-transparent outline-none text-sm"
              />
              {isTagDropdownOpen ? (
                <ChevronUp size={16} className="text-muted-foreground" />
              ) : (
                <ChevronDown size={16} className="text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Dropdown */}
          {isTagDropdownOpen && (tagSearch || availableTags.length > 0) && (
            <div className="absolute z-10 w-full mt-1 border border-border rounded-md bg-background shadow-lg max-h-48 overflow-y-auto">
              {isTagsLoading ? (
                <div className="px-3 py-2 text-sm text-muted-foreground">Loading...</div>
              ) : availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <div
                    key={tag.id}
                    className="px-3 py-2 cursor-pointer hover:bg-muted"
                    onClick={() => handleAddTag(tag.name)}
                  >
                    {tag.name}
                  </div>
                ))
              ) : tagSearch ? (
                <div
                  className="px-3 py-2 cursor-pointer hover:bg-muted text-sm"
                  onClick={() => handleAddTag(tagSearch)}
                >
                  Press Enter to add "{tagSearch}"
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedTags.map((tag) => (
              <div key={tag} className="inline-flex items-center gap-2 bg-accent/10 px-3 py-1 rounded-full text-sm">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-destructive"
                >
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
