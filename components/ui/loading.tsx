export function Loading() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-primary rounded-full pulse-dot" />
      <div className="w-2 h-2 bg-primary rounded-full pulse-dot" />
      <div className="w-2 h-2 bg-primary rounded-full pulse-dot" />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-3 w-1/4" />
      <div className="skeleton h-6 w-1/2" />
      <div className="skeleton h-3 w-full" />
      <div className="skeleton h-3 w-2/3" />
    </div>
  )
}
