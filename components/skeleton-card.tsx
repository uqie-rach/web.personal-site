export function SkeletonCard() {
  return (
    <div className="border border-border rounded-lg p-4 bg-card space-y-4 animate-pulse">
      <div className="h-6 bg-muted rounded w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
      </div>
      <div className="flex gap-2 pt-2">
        <div className="h-8 bg-muted rounded-full w-16"></div>
        <div className="h-8 bg-muted rounded-full w-16"></div>
      </div>
    </div>
  )
}
