"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { TechStackForm } from "@/components/tech-stack-form"
import { Plus, X } from "lucide-react"
import { useTechStack } from "@/hooks/use-tech-stack"
import { TechStack } from "@/lib/schemas"
import { toast } from "sonner"
import { toastConfig } from "@/lib/constants"

interface DisplayTechStack extends Omit<TechStack, 'id'> {
  id: string
  createdAt?: Date
  updatedAt?: Date
}

export default function TechStackAdmin() {
  const [techs, setTechs] = useState<DisplayTechStack[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<TechStack["category"] | "all">("all")
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [tempLimit, setTempLimit] = useState("10")

  const {
    create,
    delete: _delete,
    update,
    getAll,
    isLoading,
    error,
  } = useTechStack({
    onSuccess(message) {
      toast.success(message, toastConfig)
    },
    onError(error) {
      toast.error(error, toastConfig)
    },
  })

  useEffect(() => {
    loadTechs(1, limit)
  }, [])

  const loadTechs = async (pageNum: number = 1, pageLimit: number = 10) => {
    try {
      const response = await getAll(pageLimit, pageNum);
      // Filter out items without id and normalize category to match schema enum
      const validTechs = response.data
        .filter((tech): tech is DisplayTechStack => !!tech.id)
        .map((tech) => ({
          ...tech,
          category: (tech.category.charAt(0).toUpperCase() + tech.category.slice(1)) as TechStack["category"],
        }))
      
      if (pageNum === 1) {
        setTechs(validTechs)
      } else {
        setTechs((prev) => [...prev, ...validTechs])
      }
      
      setHasNextPage(response.hasNextPage)
    } catch {
      toast.error(
        `Failed to load tech stack! ${error}`,
        {
          position: "top-center",
        }
      )
    }
  }

  const handleSubmit = async (data: Omit<TechStack, "id">) => {
    if (editingId) {
      await update(editingId, data);
      setEditingId(null)
    } else {
      await create(data);
    }
    loadTechs(1, limit)
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    await _delete(id);
    loadTechs(1, limit)
  }

  const handleLimitChange = () => {
    const newLimit = parseInt(tempLimit) || 10
    setLimit(newLimit)
    setPage(1)
    loadTechs(1, newLimit)
  }

  const handleNextPage = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadTechs(nextPage, limit)
  }

  const editingItem = editingId ? techs.find((t) => t.id === editingId) : undefined
  const filteredTechs = filter === "all" ? techs : techs.filter((t) => t.category === filter)

  // Dynamically get unique categories from data
  const uniqueCategories = Array.from(new Set(techs.map((t) => t.category)))
  const categoryLabels: Record<string, string> = {
    all: "All",
    ...Object.fromEntries(uniqueCategories.map((cat) => [cat, cat])),
  }

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Tech Stack Management</h2>
          <p className="text-muted-foreground mt-2">Manage your technology skills</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="gap-2"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Technology"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6">{editingId ? "Edit Technology" : "New Technology"}</h3>
          <TechStackForm initial={editingItem} onSubmit={handleSubmit} isLoading={isLoading} categories={uniqueCategories} />
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All
        </Button>
        {uniqueCategories.map((category) => (
          <Button
            key={category}
            variant={filter === category ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(category)}
          >
            {categoryLabels[category]}
          </Button>
        ))}
      </div>

      {/* Group by category */}
      <div className="space-y-8">
        {uniqueCategories.map((category) => {
          const categoryTechs = filteredTechs.filter((t) => t.category === category)
          if (categoryTechs.length === 0) return null

          return (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 text-primary">
                {categoryLabels[category]}
              </h3>
              <DataTable<DisplayTechStack>
                data={categoryTechs}
                columns={[
                  { key: "name", label: "Name" },
                  {
                    key: "proficiency",
                    label: "Proficiency",
                    render: (value) => <span className="capitalize font-medium">{value}</span>,
                  },
                ]}
                onEdit={(item) => {
                  setEditingId(item.id)
                  setShowForm(true)
                }}
                onDelete={handleDelete}
                loading={isLoading}
              />
            </div>
          )
        })}
      </div>

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
            Page {page} • Showing {techs.length} items
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
