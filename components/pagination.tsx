"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 py-8 flex-wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-transparent"
      >
        <ChevronLeft size={16} className="mr-1" /> Previous
      </Button>

      <div className="flex gap-1">
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          // Show pages around current page
          if (totalPages <= 5) return i + 1
          if (i === 0) return 1
          if (i === 4) return totalPages
          if (i === 1 && currentPage <= 3) return currentPage
          if (i === 3 && currentPage > totalPages - 3) return currentPage
          return currentPage - 1 + i
        }).map((page, idx) => {
          const isValid = page && page >= 1 && page <= totalPages
          if (!isValid) return null

          return (
            <Button
              key={idx}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={currentPage !== page ? "bg-transparent" : ""}
            >
              {page}
            </Button>
          )
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-transparent"
      >
        Next <ChevronRight size={16} className="ml-1" />
      </Button>
    </div>
  )
}
