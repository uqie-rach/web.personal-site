"use client"

interface FilterChipProps {
  label: string
  isSelected: boolean
  onClick: () => void
}

export function FilterChip({ label, isSelected, onClick }: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        isSelected
          ? "bg-primary text-primary-foreground shadow-md scale-105"
          : "bg-secondary/20 text-foreground hover:bg-secondary/40"
      }`}
    >
      {label}
    </button>
  )
}
