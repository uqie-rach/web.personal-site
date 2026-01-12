"use client"

import { Button } from "@/components/ui/button"
import { FilterChip } from "@/components/filter-chip"

interface FilterOption {
  id: string
  label: string
}

interface FilterSectionProps {
  title: string
  options: FilterOption[]
  selectedIds: string[]
  onSelect: (id: string) => void
  onClear: () => void
  showAllOption?: boolean
}

export function FilterSection({
  title,
  options,
  selectedIds,
  onSelect,
  onClear,
  showAllOption = false,
}: FilterSectionProps) {
  const hasActiveFilter = selectedIds.length > 0

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{title}</p>
        {hasActiveFilter && (
          <Button variant="ghost" size="sm" onClick={onClear} className="text-xs h-8 px-2">
            Clear
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {showAllOption && <FilterChip label="All" isSelected={selectedIds.length === 0} onClick={() => onClear()} />}
        {options.map((option) => (
          <FilterChip
            key={option.id}
            label={option.label}
            isSelected={selectedIds.includes(option.id)}
            onClick={() => onSelect(option.id)}
          />
        ))}
      </div>
    </div>
  )
}
