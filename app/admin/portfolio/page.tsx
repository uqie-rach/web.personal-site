"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { PortfolioForm } from "@/components/portfolio-form"
import { portfolioStorage } from "@/lib/storage"
import type { Portfolio } from "@/lib/types"
import { Plus, X } from "lucide-react"

export default function PortfolioAdmin() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadPortfolios()
  }, [])

  const loadPortfolios = () => {
    setPortfolios(portfolioStorage.getAll())
  }

  const handleSubmit = (data: Omit<Portfolio, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      if (editingId) {
        portfolioStorage.update(editingId, data)
        setEditingId(null)
      } else {
        portfolioStorage.create(data)
      }
      loadPortfolios()
      setShowForm(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    portfolioStorage.delete(id)
    loadPortfolios()
  }

  const editingItem = editingId ? portfolios.find((p) => p.id === editingId) : undefined

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Portfolio Management</h2>
          <p className="text-muted-foreground mt-2">Manage your project portfolio</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="gap-2"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Project"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6">{editingId ? "Edit Project" : "New Project"}</h3>
          <PortfolioForm initial={editingItem} onSubmit={handleSubmit} isLoading={loading} />
        </div>
      )}

      <DataTable<Portfolio>
        data={portfolios}
        columns={[
          { key: "title", label: "Title" },
          {
            key: "techStacks",
            label: "Technologies",
            render: (value) => (
              <div className="flex gap-1 flex-wrap">
                {(value as string[]).slice(0, 2).map((tech) => (
                  <span key={tech} className="bg-primary/10 px-2 py-1 rounded text-xs">
                    {tech}
                  </span>
                ))}
                {(value as string[]).length > 2 && (
                  <span className="text-xs text-muted-foreground">+{(value as string[]).length - 2}</span>
                )}
              </div>
            ),
          },
          {
            key: "featured",
            label: "Featured",
            render: (value) => (
              <span className={value ? "text-primary font-semibold" : "text-muted-foreground"}>
                {value ? "Yes" : "No"}
              </span>
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
