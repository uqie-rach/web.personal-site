"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import type { Experience } from "@/lib/types"

interface ExperienceFormProps {
  initial?: Experience
  onSubmit: (data: Omit<Experience, "id" | "createdAt" | "updatedAt">) => void
  isLoading?: boolean
}

export function ExperienceForm({ initial, onSubmit, isLoading = false }: ExperienceFormProps) {
  /**
   * Local State
   */
  const [title, setTitle] = useState(initial?.title || "")
  const [company, setCompany] = useState(initial?.company || "")
  const [location, setLocation] = useState(initial?.location || "")
  const [startDate, setStartDate] = useState(
    initial?.startDate ? new Date(initial.startDate).toISOString().split("T")[0] : "",
  )
  const [endDate, setEndDate] = useState(initial?.endDate ? new Date(initial.endDate).toISOString().split("T")[0] : "")
  const [current, setCurrent] = useState(initial?.current || false)
  const [workStyle, setWorkStyle] = useState(initial?.workStyle || "")
  const [accomplishments, setAccomplishments] = useState<string[]>(initial?.accomplishments || [])
  const [accomplishmentInput, setAccomplishmentInput] = useState("")

  /**
   * Context Management / Custom Hooks
   */

  /**
   * Functions
   */
  const handleAddAccomplishment = () => {
    if (accomplishmentInput.trim()) {
      setAccomplishments([...accomplishments, accomplishmentInput.trim()])
      setAccomplishmentInput("")
    }
  }

  const handleRemoveAccomplishment = (index: number) => {
    setAccomplishments(accomplishments.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      title,
      company,
      location,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      current,
      workStyle,
      accomplishments,
    })
    onSubmit({
      title,
      company,
      location,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      current,
      workStyle,
      accomplishments,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="role">Job Title *</Label>
          <Input
            id="role"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Senior Developer"
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Company Name"
            className="mt-2"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="City, Country"
          className="mt-2"
        />
      </div>

      <div>
        <Label htmlFor="workStyle">Work Style</Label>
        <select
          id="workStyle"
          value={workStyle}
          onChange={(e) => setWorkStyle(e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground mt-2"
        >
          <option value="">Select work style</option>
          <option value="Remote">Remote</option>
          <option value="On-site">On-site</option>
          <option value="Hybrid">Hybrid</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date *</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={current}
            className="mt-2"
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={current}
          onChange={(e) => {
            setCurrent(e.target.checked)
            if (e.target.checked) setEndDate("")
          }}
          className="w-4 h-4"
        />
        <span className="text-sm font-medium">Currently working here</span>
      </label>

      <div>
        <Label>Key Accomplishments</Label>
        <div className="flex gap-2 mt-2 mb-3">
          <Input
            value={accomplishmentInput}
            onChange={(e) => setAccomplishmentInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAccomplishment())}
            placeholder="Add accomplishment (Enter to add)"
            className="flex-1"
          />
          <Button type="button" onClick={handleAddAccomplishment} variant="outline">
            Add
          </Button>
        </div>
        {accomplishments.length > 0 && (
          <div className="space-y-2">
            {accomplishments.map((acc, index) => (
              <div key={index} className="flex items-start gap-3 bg-muted/50 p-3 rounded-lg">
                <span className="text-sm flex-1">{acc}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveAccomplishment(index)}
                  className="hover:text-destructive mt-0.5"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : initial ? "Update Experience" : "Create Experience"}
      </Button>
    </form>
  )
}
