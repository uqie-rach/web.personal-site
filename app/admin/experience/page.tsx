"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ExperienceForm } from "@/components/experience-form"
import { experienceStorage } from "@/lib/storage"
import type { Experience } from "@/lib/types"
import { Plus, X } from "lucide-react"

export default function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadExperiences()
  }, [])

  const loadExperiences = () => {
    setExperiences(
      experienceStorage.getAll().sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()),
    )
  }

  const handleSubmit = (data: Omit<Experience, "id" | "createdAt" | "updatedAt">) => {
    setLoading(true)
    try {
      if (editingId) {
        experienceStorage.update(editingId, data)
        setEditingId(null)
      } else {
        experienceStorage.create(data)
      }
      loadExperiences()
      setShowForm(false)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    experienceStorage.delete(id)
    loadExperiences()
  }

  const editingItem = editingId ? experiences.find((e) => e.id === editingId) : undefined

  return (
    <Container className="py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Experience Management</h2>
          <p className="text-muted-foreground mt-2">Manage your work experience</p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null)
            setShowForm(!showForm)
          }}
          className="gap-2"
        >
          {showForm ? <X size={18} /> : <Plus size={18} />}
          {showForm ? "Cancel" : "Add Experience"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold mb-6">{editingId ? "Edit Experience" : "New Experience"}</h3>
          <ExperienceForm initial={editingItem} onSubmit={handleSubmit} isLoading={loading} />
        </div>
      )}

      <DataTable<Experience>
        data={experiences}
        columns={[
          { key: "role", label: "Role" },
          { key: "company", label: "Company" },
          { key: "location", label: "Location" },
          {
            key: "current",
            label: "Status",
            render: (value) => (
              <span className={value ? "text-primary font-semibold" : "text-muted-foreground"}>
                {value ? "Current" : "Past"}
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
