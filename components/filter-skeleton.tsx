export function FilterSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {/* Search bar skeleton */}
      <div className="h-10 bg-muted rounded-md w-full"></div>

      {/* Filter chips skeleton */}
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-32"></div>
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-8 bg-muted rounded-full w-20"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
