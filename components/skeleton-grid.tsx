import { SkeletonCard } from "@/components/skeleton-card"

interface SkeletonGridProps {
  count?: number
  columns?: 1 | 2 | 3
}

export function SkeletonGrid({ count = 6, columns = 2 }: SkeletonGridProps) {
  const gridColsClass = {
    1: "grid-cols-1",
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
  }

  return (
    <div className={`grid grid-cols-1 ${gridColsClass[columns]} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
