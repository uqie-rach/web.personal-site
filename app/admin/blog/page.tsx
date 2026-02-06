"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { BlogForm } from "@/components/blog-form"
import { useBlog } from "@/hooks/use-blog"
import { useTags, type Tag } from "@/hooks/use-tags"
import type { Blog as BlogSchema } from "@/lib/schemas"
import { Plus, X, Search, ChevronDown, ChevronUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store/auth-store"
import { toast } from "sonner"
import { toastConfig } from "@/lib/constants"

interface DisplayBlog extends Omit<BlogSchema, 'id'> {
  id: string
  createdAt?: Date
  updatedAt?: Date
}

export default function BlogAdmin() {
  const [posts, setPosts] = useState<DisplayBlog[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [tempLimit, setTempLimit] = useState("10")

  // Tags state
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [tagSearch, setTagSearch] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false)
  const tagDropdownRef = useRef<HTMLDivElement>(null)

  // Global Contexts / Custom hooks
  const {
    user
  } = useAuthStore();

  const {
    create,
    delete: _delete,
    update,
    getAll,
    isLoading,
    error
  } = useBlog({
    onSuccess(message) {
      toast.success(message, toastConfig)
    },
    onError(error) {
      toast.error(error, toastConfig)
    },
  });

  const {
    getAll: getTags,
    isLoading: isTagsLoading
  } = useTags();

  const router = useRouter();

  // Methods

  const getPosts = async (pageNum: number = 1, pageLimit: number = 10) => {
    try {
      const response = await getAll(pageLimit, pageNum);

      // Filter out items without id
      const validPosts = response.data
        .filter((post): post is DisplayBlog => !!post.id)

      if (pageNum === 1) {
        setPosts(validPosts)
      } else {
        setPosts((prev) => [...prev, ...validPosts])
      }

      setHasNextPage(response.hasNextPage)
    } catch {
      toast.error(
        `Failed! ${error}`,
        {
          position: "top-center",
        }
      )
    }
  }

  const loadTags = useCallback(async (search: string = "") => {
    const response = await getTags(50, 1, search)
    setAvailableTags(response.data.filter(t => !selectedTags.includes(t.name)))
  }, [getTags, selectedTags])

  // Lifecycle methods
  useEffect(() => {
    getPosts(1, limit)
  }, [])

  useEffect(() => {
    loadTags(tagSearch)
  }, [tagSearch, loadTags])

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

  const handleSubmit = async (data: Omit<BlogSchema, "id">) => {
    if (editingId) {
      await update(editingId, data);
      setEditingId(null)
    } else {
      console.log(data, user?.id)
      await create({
        createdBy: { id: user?.id },
        ...data
      });
    }

    getPosts(1, limit)
    setTimeout(() => {
      setShowForm(false);
      router.refresh()
    }, 1000);
  }

  const handleDelete = async (id: string) => {
    await _delete(id);

    getPosts(1, limit)
  }

  const handleLimitChange = () => {
    const newLimit = parseInt(tempLimit) || 10
    setLimit(newLimit)
    setPage(1)
    getPosts(1, newLimit)
  }

  const handleNextPage = () => {
    const nextPage = page + 1
    setPage(nextPage)
    getPosts(nextPage, limit)
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
            setSelectedTags([])
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
          <BlogForm 
            initial={editingItem} 
            onSubmit={handleSubmit} 
            isLoading={isLoading}
            selectedTags={selectedTags}
            onTagsChange={setSelectedTags}
          />
        </div>
      )}

      <DataTable<DisplayBlog>
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
        ]}
        onEdit={(item) => {
          setEditingId(item.id)
          setShowForm(true)
        }}
        onDelete={handleDelete}
        loading={isLoading}
      />

      {/* Pagination Controls */}
      <div className="mt-8 space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium">Items per page:</label>
          <input
            type="number"
            min="1"
            max="100"
            value={tempLimit}
            onChange={(e) => setTempLimit(e.target.value)}
            onBlur={handleLimitChange}
            onKeyPress={(e) => e.key === "Enter" && handleLimitChange()}
            className="w-20 px-3 py-2 border border-border rounded-md text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-muted-foreground">
            Page {page} • Showing {posts.length} items
          </span>
          {hasNextPage && (
            <Button onClick={handleNextPage} disabled={isLoading} size="sm">
              Load More
            </Button>
          )}
        </div>
      </div>
    </Container>
  )
}
