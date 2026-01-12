"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Trash2, Edit2 } from "lucide-react"

interface Column<T> {
  key: keyof T
  label: string
  render?: (value: any, item: T) => React.ReactNode
}

interface DataTableProps<T extends { id: string }> {
  data: T[]
  columns: Column<T>[]
  onEdit?: (item: T) => void
  onDelete?: (id: string) => void
  loading?: boolean
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  onEdit,
  onDelete,
  loading = false,
}: DataTableProps<T>) {
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50 border-b border-border">
          <tr>
            {columns.map((col) => (
              <th key={String(col.key)} className="px-6 py-3 text-left text-sm font-medium">
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-6 py-8 text-center">
                <p className="text-muted-foreground">No items found</p>
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className="px-6 py-4 text-sm">
                    {col.render ? col.render(item[col.key], item) : String(item[col.key])}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {onEdit && (
                        <Button size="sm" variant="outline" onClick={() => onEdit(item)} disabled={loading}>
                          <Edit2 size={16} />
                        </Button>
                      )}
                      {onDelete && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (confirm("Are you sure?")) {
                              onDelete(item.id)
                            }
                          }}
                          disabled={loading}
                          className="hover:bg-destructive/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
