"use client"

import { useState, useEffect } from "react"
import { Container } from "@/components/container"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table"
import { ExperienceForm } from "@/components/experience-form"
import type { Experience as ExperienceType } from "@/lib/types"
import { Plus, X } from "lucide-react"
import { useExperience } from "@/hooks/use-experience"
import { useRouter } from "next/navigation"
import { Experience } from "@/lib/schemas"
import { useAuthStore } from "@/lib/store/auth-store"
import { toast } from "sonner"
import { toastConfig } from "@/lib/constants"

interface DisplayExperience extends Omit<Experience, 'id'> {
  id: string
  createdAt?: Date
  updatedAt?: Date
}

export default function ExperienceAdmin() {
  const [experiences, setExperiences] = useState<DisplayExperience[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

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
  } = useExperience({
    onSuccess(message) {
      toast.success(message, toastConfig)
    },
    onError(error) {
      toast.error(error, toastConfig)
    },
  });

  const router = useRouter();

  // Methods

  const getExperiences = async () => {
    try {
      const response = await getAll();

      // Filter out items without id
      const validExperiences = response.filter((exp): exp is DisplayExperience => !!exp.id)
      setExperiences(validExperiences)
    } catch {
      toast.error(
        `Failed! ${error}`,
        {
          position: "top-center",
        }
      )
    }
  }

  // Lifecycle methods
  /**
   * Executed on the initial load
   */
  useEffect(() => {
    getExperiences()
  }, [])

  const handleSubmit = async (data: Omit<Experience, "id">) => {
    if (editingId) {
      await update(editingId, data);
      setEditingId(null)
    } else {
      await create({
        ownedBy: { id: user?.id },
        ...data
      });
    }

    getExperiences()
    setTimeout(() => {
      setShowForm(false);
      router.refresh()
    }, 1000);
  }

  const handleDelete = async (id: string) => {
    await _delete(id);

    getExperiences()
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
          <ExperienceForm initial={editingItem ? { 
            id: editingItem.id, 
            title: editingItem.title, 
            company: editingItem.company, 
            location: editingItem.location, 
            startDate: editingItem.startDate, 
            endDate: editingItem.endDate, 
            isCurrently: editingItem.isCurrently, 
            workStyle: editingItem.workStyle, 
            accomplishments: editingItem.accomplishments, 
            order: editingItem.order 
          } : undefined} onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      )}

      <DataTable<DisplayExperience>
        data={experiences}
        columns={[
          { key: "title", label: "Title" },
          { key: "company", label: "Company" },
          { key: "location", label: "Location" },
          {
            key: "isCurrently",
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
        loading={isLoading}
      />
    </Container>
  )
}
