"use client"

interface SkeletonProps {
  count?: number
  height?: string
  className?: string
}

export function SkeletonLine({ height = "1rem", className = "" }: SkeletonProps) {
  return <div className={`bg-muted/50 rounded-md animate-pulse ${className}`} style={{ height }} />
}

export function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <SkeletonLine height="1.5rem" className="w-3/4" />
      <SkeletonLine height="1rem" />
      <SkeletonLine height="1rem" className="w-5/6" />
      <div className="flex gap-2 pt-4">
        <SkeletonLine height="2rem" className="w-20" />
        <SkeletonLine height="2rem" className="w-20" />
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 6 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
