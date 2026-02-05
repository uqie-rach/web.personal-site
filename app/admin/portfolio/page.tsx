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
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [hasNextPage, setHasNextPage] = useState(false)
  const [tempLimit, setTempLimit] = useState("10")

  const { user } = useAuthStore();

  const {
    getAll,
    delete: deletePorto,
    create,
    update,
    isLoading
  } = usePortfolio();

  const router = useRouter()

  const loadPortfolios = async (pageNum: number = 1, pageLimit: number = 10) => {
    try {
      const response = await getAll(pageLimit, pageNum)
      
      if (pageNum === 1) {
        setPortfolios(response.data)
      } else {
        setPortfolios((prev) => [...prev, ...response.data])
      }
      
      setHasNextPage(response.hasNextPage)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (data: Omit<PortfolioType, "id" | "createdAt" | "updatedAt">) => {
    try {
      if (editingId) {
        // Update portfolio -> insert new image
        await update(editingId, data)
        setEditingId(null)

      } else {
        const { order, ...rest } = data;

        // Create new Portfolio
        await create({
          order: 0,
          id: '',
          ownedBy: { id: user?.id },
          ...rest
        })
      }
      loadPortfolios(1, limit)
      setShowForm(false)

      // refresh
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deletePorto(id)
      loadPortfolios(1, limit)
    } catch (err) {
      console.error(err)
    }
  }

  const handleLimitChange = () => {
    const newLimit = parseInt(tempLimit) || 10
    setLimit(newLimit)
    setPage(1)
    loadPortfolios(1, newLimit)
  }

  const handleNextPage = () => {
    const nextPage = page + 1
    setPage(nextPage)
    loadPortfolios(nextPage, limit)
  }

  useEffect(() => {
    loadPortfolios(1, limit)
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
          <PortfolioForm initial={editingItem} onSubmit={handleSubmit} isLoading={isLoading} />
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
            Page {page} • Showing {portfolios.length} items
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
