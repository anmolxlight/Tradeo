"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser, UserButton } from "@clerk/nextjs"
import {
  Search,
  TrendingUp,
  History,
  Star,
  BarChart3,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ArrowLeft,
  ChevronRight,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CardSkeleton } from "@/components/ui/loading"
import { DatabaseAnalysis } from "@/types"
import { formatCurrency, formatPercentage, validateTicker, getRelativeTime } from "@/lib/utils"

export default function DashboardPage() {
  const { user } = useUser()
  const router = useRouter()
  const [analyses, setAnalyses] = useState<DatabaseAnalysis[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTicker, setSearchTicker] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      fetchAnalyses()
      if (typeof window !== "undefined") {
        const pendingTicker = sessionStorage.getItem("pendingTicker")
        if (pendingTicker) {
          sessionStorage.removeItem("pendingTicker")
          router.push(`/analyze/${pendingTicker}`)
        }
      }
    }
  }, [user, router])

  const fetchAnalyses = async () => {
    try {
      const response = await fetch("/api/analyze")
      if (!response.ok) throw new Error("Failed to fetch")
      const data = await response.json()
      setAnalyses(data.analyses)
    } catch {
      console.error("Error fetching analyses")
    } finally {
      setLoading(false)
    }
  }

  const handleNewAnalysis = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateTicker(searchTicker)
    if (!validation.isValid) {
      setError(validation.message)
      return
    }
    setError("")
    router.push(`/analyze/${validation.cleanTicker}`)
  }

  const getRecommendationTag = (r: string) => {
    switch (r) {
      case "buy": return "tag-positive"
      case "sell": return "tag-negative"
      default: return "tag-neutral"
    }
  }

  const getSentimentIndicator = (s: string) => {
    switch (s) {
      case "bullish": return "signal-dot-positive"
      case "bearish": return "signal-dot-negative"
      default: return "signal-dot-neutral"
    }
  }

  const stats = [
    {
      label: "Analyses",
      value: analyses.length,
      icon: <BarChart3 className="h-3.5 w-3.5" />,
      color: "text-blue-400",
    },
    {
      label: "Buy Signals",
      value: analyses.filter((a) => a.analysis.recommendation === "buy").length,
      icon: <ArrowUpRight className="h-3.5 w-3.5" />,
      color: "text-emerald-400",
    },
    {
      label: "Favorites",
      value: analyses.filter((a) => a.is_favorite).length,
      icon: <Star className="h-3.5 w-3.5" />,
      color: "text-amber-400",
    },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 h-14 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="w-full max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="gap-1.5 text-muted-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Home</span>
            </Button>
            <div className="w-px h-4 bg-border" />
            <div
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold tracking-tight">tradeo</span>
            </div>
          </div>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 ring-2 ring-border",
              },
            }}
          />
        </div>
      </nav>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* ── Welcome ── */}
        <div className="fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-1">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground">
            Your stock analysis dashboard
          </p>
        </div>

        {/* ── New Analysis ── */}
        <Card className="fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-4 w-4 text-primary" />
              New Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNewAnalysis} className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="AAPL, RELIANCE, TSLA..."
                  value={searchTicker}
                  onChange={(e) => {
                    setSearchTicker(e.target.value.toUpperCase())
                    setError("")
                  }}
                  className="pl-9 h-10"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
              <Button type="submit" disabled={!searchTicker.trim()} className="gap-1.5">
                Analyze
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </form>
            {error && (
              <p className="text-destructive text-xs mt-2 animate-slide-up">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* ── Stats ── */}
        {analyses.length > 0 && (
          <div className="grid grid-cols-3 gap-3 fade-in">
            {stats.map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center gap-3">
                  <div className={`${stat.color}`}>{stat.icon}</div>
                  <div>
                    <div className="text-lg font-bold tabular">{stat.value}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── History ── */}
        <div className="space-y-4 fade-in">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold">Analysis History</h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : analyses.length === 0 ? (
            <Card>
              <CardContent className="py-14 text-center">
                <div className="inline-flex p-3 rounded-lg bg-secondary mb-3">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-1">No analyses yet</h3>
                <p className="text-sm text-muted-foreground mb-5 max-w-sm mx-auto">
                  Search for a stock ticker above to get your first AI-powered analysis.
                </p>
                <Button
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement
                    input?.focus()
                  }}
                 
                >
                  <Search className="h-4 w-4" />
                  Analyze a Stock
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {analyses.map((a) => (
                <Card
                  key={a.id}
                  className="card-interactive cursor-pointer"
                  onClick={() => router.push(`/analyze/${a.ticker}`)}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold tracking-tight">{a.ticker}</span>
                        <div className="flex items-center gap-1">
                          <div className={`signal-dot ${getSentimentIndicator(a.analysis.sentiment)}`} />
                          <span className="text-[10px] text-muted-foreground capitalize">
                            {a.analysis.sentiment}
                          </span>
                        </div>
                      </div>
                      {a.is_favorite && (
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold tabular">
                        {formatCurrency(a.stock_data.currentPrice, a.stock_data.currency)}
                      </span>
                      <span
                        className={`text-xs font-medium tabular ${
                          a.stock_data.priceChange >= 0 ? "num-positive" : "num-negative"
                        }`}
                      >
                        {formatPercentage(a.stock_data.priceChange)}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5">
                      <span className={`tag ${getRecommendationTag(a.analysis.recommendation)}`}>
                        {a.analysis.recommendation}
                      </span>
                      <span className="tag tag-default capitalize">
                        {a.analysis.riskLevel} risk
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground/70 pt-1 border-t border-border/30">
                      <Clock className="h-3 w-3" />
                      <span>{getRelativeTime(a.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
