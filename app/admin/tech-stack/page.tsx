"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { TechStackForm } from "@/components/tech-stack-form"
import { techStackStorage } from "@/lib/storage"

import { Plus, X } from "lucide-react"
import { useTechStack } from "@/hooks/use-tech-stack"
import { TechStack } from "@/lib/schemas"

export default function TechStackAdmin() {
  const [techs, setTechs] = useState<TechStack[] | []>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<TechStack["category"] | "all">("all")

  const { getAll } = useTechStack();

  useEffect(() => {
    loadTechs()
  }, [])

  const loadTechs = () => {
    getAll()
      .then(res => {
        setTechs(res)
      })
  }

  const handleSubmit = (data: Omit<TechStack, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      if (editingId) {
        techStackStorage.update(editingId, data)
        setEditingId(null)
      } else {
        techStackStorage.create(data)
      }
      loadTechs()
      setShowForm(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    techStackStorage.delete(id)
    loadTechs()
  }

  const editingItem = editingId ? techs.find((t) => t.id === editingId) : undefined
  const filteredTechs = filter === "all" ? techs : techs.filter((t) => t.category === filter)

  const categoryLabels = {
    frontend: "Frontend",
    backend: "Backend",
    design: "Design",
    devops: "DevOps",
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
          <TechStackForm initial={editingItem} onSubmit={handleSubmit} isLoading={loading} />
        </div>
      )}

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
          All
        </Button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Button
            key={key}
            variant={filter === key ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(key as TechStack["category"])}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* Group by category */}
      <div className="space-y-8">
        {["frontend", "backend", "design", "devops"].map((category) => {
          const categoryTechs = filteredTechs.filter((t) => t.category === (category as TechStack["category"]))
          if (categoryTechs.length === 0) return null

          return (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 text-primary">
                {categoryLabels[category as keyof typeof categoryLabels]}
              </h3>
              <DataTable<TechStack>
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
                loading={loading}
              />
            </div>
          )
        })}
      </div>
    </Container>
  )
}
