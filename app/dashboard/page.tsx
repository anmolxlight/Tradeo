"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser, UserButton } from "@clerk/nextjs"
import {
  Search,
  TrendingUp,
  History,
  Star,
  Calendar,
  BarChart3,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Sparkles,
  LayoutDashboard,
  ArrowLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
      if (!response.ok) throw new Error("Failed to fetch analyses")

      const data = await response.json()
      setAnalyses(data.analyses)
    } catch (err) {
      console.error("Error fetching analyses:", err)
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

  const handleAnalysisClick = (analysis: DatabaseAnalysis) => {
    router.push(`/analyze/${analysis.ticker}`)
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "buy":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
      case "sell":
        return "text-red-500 bg-red-500/10 border-red-500/20"
      default:
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <ArrowUpRight className="h-4 w-4 text-emerald-500" />
      case "bearish":
        return <ArrowDownRight className="h-4 w-4 text-red-500" />
      default:
        return <BarChart3 className="h-4 w-4 text-yellow-500" />
    }
  }

  const stats = [
    {
      label: "Total Analyses",
      value: analyses.length,
      icon: <BarChart3 className="h-4 w-4" />,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Buy Signals",
      value: analyses.filter((a) => a.analysis.recommendation === "buy").length,
      icon: <ArrowUpRight className="h-4 w-4" />,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "Favorites",
      value: analyses.filter((a) => a.is_favorite).length,
      icon: <Star className="h-4 w-4" />,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                size="sm"
                className="btn-hover gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold gradient-text">tradeo</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => router.push("/")}
                variant="ghost"
                size="sm"
                className="btn-hover gap-2 text-muted-foreground hidden sm:flex"
              >
                <LayoutDashboard className="h-4 w-4" />
                Home
              </Button>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 ring-2 ring-primary/20",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 space-y-8">
        {/* ── Welcome ── */}
        <div className="fade-in">
          <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-2">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""} 👋
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg">
            Your intelligent stock analysis dashboard
          </p>
        </div>

        {/* ── New Analysis ── */}
        <Card className="glass border-0 overflow-hidden fade-in">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Plus className="h-5 w-5 text-primary" />
              <span>New Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNewAnalysis} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search ticker (e.g., AAPL, RELIANCE, TSLA)"
                  value={searchTicker}
                  onChange={(e) => {
                    setSearchTicker(e.target.value.toUpperCase())
                    setError("")
                  }}
                  className="pl-10 h-12 glass focus-ring border-white/10"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
              <Button
                type="submit"
                className="btn-hover h-12 gap-2"
                disabled={!searchTicker.trim()}
              >
                Analyze
                <ChevronRight className="h-4 w-4" />
              </Button>
            </form>

            {error && (
              <p className="text-red-400 text-sm mt-3 animate-slide-up">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* ── Stats ── */}
        {analyses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 fade-in">
            {stats.map((stat, i) => (
              <Card key={i} className="glass border-0">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ── Analysis History ── */}
        <div className="space-y-5 fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              <span>Analysis History</span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glass border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="p-6 space-y-3">
                      <div className="skeleton h-4 w-1/3 rounded" />
                      <div className="skeleton h-8 w-2/3 rounded" />
                      <div className="skeleton h-4 w-full rounded" />
                      <div className="skeleton h-4 w-1/2 rounded" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : analyses.length === 0 ? (
            <Card className="glass border-0">
              <CardContent className="py-16 text-center">
                <div className="inline-flex p-4 rounded-2xl bg-primary/10 mb-4">
                  <BarChart3 className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No analyses yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Start analyzing stocks to see your history here. Your insights and recommendations will be saved automatically.
                </p>
                <Button
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement
                    input?.focus()
                  }}
                  className="btn-hover gap-2"
                >
                  <Search className="h-4 w-4" />
                  Analyze a Stock
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyses.map((analysis) => (
                <Card
                  key={analysis.id}
                  className="glass border-0 card-hover cursor-pointer group"
                  onClick={() => handleAnalysisClick(analysis)}
                >
                  <CardContent className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-primary tracking-tight">
                          {analysis.ticker}
                        </span>
                        <div className="flex items-center gap-1">
                          {getSentimentIcon(analysis.analysis.sentiment)}
                          <span className="text-xs text-muted-foreground capitalize">
                            {analysis.analysis.sentiment}
                          </span>
                        </div>
                      </div>

                      {analysis.is_favorite && (
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </div>

                    {/* Price */}
                    <div className="flex items-baseline justify-between">
                      <span className="text-2xl font-bold tabular-nums">
                        {formatCurrency(
                          analysis.stock_data.currentPrice,
                          analysis.stock_data.currency
                        )}
                      </span>
                      <span
                        className={`text-sm font-medium tabular-nums ${
                          analysis.stock_data.priceChange >= 0
                            ? "text-emerald-500"
                            : "text-red-500"
                        }`}
                      >
                        {formatPercentage(analysis.stock_data.priceChange)}
                      </span>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider border ${getRecommendationColor(
                          analysis.analysis.recommendation
                        )}`}
                      >
                        {analysis.analysis.recommendation}
                      </span>
                      <span className="text-xs text-muted-foreground bg-white/5 px-2.5 py-1 rounded-lg capitalize">
                        {analysis.analysis.riskLevel} risk
                      </span>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1 border-t border-white/5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{getRelativeTime(analysis.created_at)}</span>
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
