"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { PortfolioForm } from "@/components/portfolio-form"
import { Plus, X } from "lucide-react"
import { useAuthStore } from "@/lib/store/auth-store"
import { Portfolio as PortfolioType } from "@/lib/schemas"
import { usePortfolio } from "@/hooks/use-portfolio"
import { useRouter } from "next/navigation"

export default function PortfolioAdmin() {
  const [portfolios, setPortfolios] = useState<PortfolioType[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { user } = useAuthStore();

  const {
    getAll,
    delete: deletePorto,
    create,
    update
  } = usePortfolio();

  const router = useRouter()

  const loadPortfolios = () => {
    getAll()
      .then(res => {
        setPortfolios(res)
      })
  }

  const handleSubmit = (data: Omit<PortfolioType, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)

    try {
      if (editingId) {
        // Update portfolio -> insert new image
        update(editingId, data)
        setEditingId(null)

      } else {
        const { order, ...rest } = data;

        // Create new Portfolio
        create({
          order: 0,
          id: '',
          ownedBy: { id: user?.id },
          ...rest
        })
      }
      loadPortfolios()
      setShowForm(false)

      // refresh
    } finally {
      setLoading(false)
      setTimeout(() => {
        router.refresh()
      }, 1000);
    }
  }

  const handleDelete = (id: string) => {
    deletePorto(id)
    loadPortfolios()

    setTimeout(() => {
      router.refresh()
    }, 1000);
  }


  useEffect(() => {
    loadPortfolios()
  }, [])

  useEffect(() => {
    loadPortfolios
  }, [create, update, handleDelete])

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

      <DataTable<PortfolioType>
        data={portfolios}
        columns={[
          { key: "title", label: "Title" },
          {
            key: "technologies",
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
        onDelete={(id) => {
          handleDelete(id)
        }}
        loading={loading}
      />
    </Container>
  )
}
