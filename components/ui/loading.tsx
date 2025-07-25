import { cn } from "@/lib/utils"

interface LoadingProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export function Loading({ className, size = 'md', text }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <div className="flex space-x-1">
        <div className={cn("bg-primary rounded-full pulse-dot", sizeClasses[size])}></div>
        <div className={cn("bg-primary rounded-full pulse-dot", sizeClasses[size])}></div>
        <div className={cn("bg-primary rounded-full pulse-dot", sizeClasses[size])}></div>
      </div>
      {text && (
        <span className="text-muted-foreground text-sm animate-pulse">
          {text}
        </span>
      )}
    </div>
  )
}

export function PageLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loading size="lg" />
        <p className="text-muted-foreground animate-pulse">{message}</p>
      </div>
    </div>
  )
}

export function AnalysisLoading({ ticker }: { ticker?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-2">
          <Loading size="lg" />
          <h3 className="text-xl font-semibold">
            Analyzing {ticker ? ticker.toUpperCase() : 'Stock'}
          </h3>
          <p className="text-muted-foreground">
            Our AI is gathering real-time data and generating insights...
          </p>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-center space-x-2 animate-pulse">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Fetching current market data</span>
          </div>
          <div className="flex items-center justify-center space-x-2 animate-pulse delay-300">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Analyzing financial metrics</span>
          </div>
          <div className="flex items-center justify-center space-x-2 animate-pulse delay-500">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Generating AI insights</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function CardLoading() {
  return (
    <div className="animate-pulse space-y-3 p-6">
      <div className="h-4 bg-muted rounded w-1/2"></div>
      <div className="h-8 bg-muted rounded w-3/4"></div>
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-2/3"></div>
    </div>
  )
}