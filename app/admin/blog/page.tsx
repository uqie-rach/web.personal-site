"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { BlogForm } from "@/components/blog-form"
import { blogStorage } from "@/lib/storage"
import type { BlogPost } from "@/lib/types"
import { Plus, X } from "lucide-react"

export default function BlogAdmin() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = () => {
    setPosts(blogStorage.getAll().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  }

  const handleSubmit = (data: Omit<BlogPost, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      if (editingId) {
        blogStorage.update(editingId, data)
        setEditingId(null)
      } else {
        blogStorage.create(data)
      }
      loadPosts()
      setShowForm(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    blogStorage.delete(id)
    loadPosts()
  }

  const editingItem = editingId ? posts.find((p) => p.id === editingId) : undefined

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Blog Management</h2>
          <p className="text-muted-foreground mt-2">Create and manage blog posts</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="gap-2"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "New Post"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8 max-w-3xl">
          <h3 className="text-lg font-semibold mb-6">{editingId ? "Edit Post" : "New Blog Post"}</h3>
          <BlogForm initial={editingItem} onSubmit={handleSubmit} isLoading={loading} />
        </div>
      )}

      <DataTable<BlogPost>
        data={posts}
        columns={[
          { key: "title", label: "Title" },
          {
            key: "published",
            label: "Status",
            render: (value) => (
              <span className={value ? "text-primary font-semibold" : "text-muted-foreground"}>
                {value ? "Published" : "Draft"}
              </span>
            ),
          },
          {
            key: "tags",
            label: "Tags",
            render: (value) => (
              <div className="flex gap-1 flex-wrap">
                {(value as string[]).slice(0, 2).map((tag) => (
                  <span key={tag} className="bg-accent/10 px-2 py-1 rounded text-xs">
                    {tag}
                  </span>
                ))}
                {(value as string[]).length > 2 && (
                  <span className="text-xs text-muted-foreground">+{(value as string[]).length - 2}</span>
                )}
              </div>
            ),
          },
        ]}
        onEdit={(item) => {
          setEditingId(item.id)
          setShowForm(true)
        }}
        onDelete={handleDelete}
        loading={loading}
      />
    </Container>
  )
}
