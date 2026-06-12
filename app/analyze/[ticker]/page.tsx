"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  AlertTriangle,
  Clock,
  Star,
  RefreshCw,
  ChevronRight,
  Building2,
  Activity,
  Shield,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StockData, StockAnalysis } from "@/types"
import { formatCurrency, formatPercentage } from "@/lib/utils"

interface AnalysisResponse {
  stockData: StockData
  analysis: StockAnalysis
  analysisId?: string
}

export default function AnalyzePage() {
  const { ticker } = useParams()
  const router = useRouter()
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [data, setData] = useState<AnalysisResponse | null>(null)

  useEffect(() => {
    if (ticker && user) {
      analyzeStock(ticker as string)
    }
  }, [ticker, user])

  const analyzeStock = async (stockTicker: string) => {
    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: stockTicker }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to analyze stock")
      }
      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  const sentimentConfig = (s: string) => {
    switch (s) {
      case "bullish": return { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", icon: <TrendingUp className="h-4 w-4" />, dot: "signal-dot-positive" }
      case "bearish": return { color: "text-red-400", bg: "bg-red-500/10 border-red-500/20", icon: <TrendingDown className="h-4 w-4" />, dot: "signal-dot-negative" }
      default: return { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", icon: <BarChart3 className="h-4 w-4" />, dot: "signal-dot-neutral" }
    }
  }

  const recommendationConfig = (r: string) => {
    switch (r) {
      case "buy": return "tag-positive"
      case "sell": return "tag-negative"
      default: return "tag-neutral"
    }
  }

  const riskConfig = (r: string) => {
    switch (r) {
      case "low": return { color: "text-emerald-400", bg: "bg-emerald-500/10" }
      case "high": return { color: "text-red-400", bg: "bg-red-500/10" }
      default: return { color: "text-amber-400", bg: "bg-amber-500/10" }
    }
  }

  // ── Loading State ──
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-5 max-w-xs mx-auto px-4">
          <div className="flex justify-center gap-1.5">
            <div className="w-2 h-2 bg-primary rounded-full pulse-dot" />
            <div className="w-2 h-2 bg-primary rounded-full pulse-dot" />
            <div className="w-2 h-2 bg-primary rounded-full pulse-dot" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Analyzing <span className="text-primary">{ticker}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Gathering market data and running AI analysis...
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-center gap-1.5 animate-pulse text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              Market data
            </div>
            <div className="flex items-center justify-center gap-1.5 animate-pulse text-xs text-muted-foreground" style={{ animationDelay: "200ms" }}>
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              Financial metrics
            </div>
            <div className="flex items-center justify-center gap-1.5 animate-pulse text-xs text-muted-foreground" style={{ animationDelay: "400ms" }}>
              <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
              AI insights
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Error State ──
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-sm w-full">
          <CardContent className="p-6 text-center space-y-4">
            <div className="inline-flex p-3 rounded-lg bg-destructive/10">
              <AlertTriangle className="h-7 w-7 text-destructive" />
            </div>
            <h3 className="text-base font-semibold">Analysis Failed</h3>
            <p className="text-sm text-muted-foreground">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => router.push("/")}>
                <ArrowLeft className="h-3.5 w-3.5" />
                Home
              </Button>
              <Button onClick={() => analyzeStock(ticker as string)}>
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  const { stockData, analysis } = data
  const sentiment = sentimentConfig(analysis.sentiment)
  const risk = riskConfig(analysis.riskLevel)

  const metrics = [
    {
      label: "Current Price",
      value: formatCurrency(stockData.currentPrice, stockData.currency),
      icon: <DollarSign className="h-4 w-4 text-blue-400" />,
    },
    {
      label: "Target Price",
      value: stockData.targetPrice > 0 ? formatCurrency(stockData.targetPrice, stockData.currency) : "N/A",
      icon: <Target className="h-4 w-4 text-emerald-400" />,
    },
    {
      label: "PE Ratio",
      value: stockData.peRatio > 0 ? stockData.peRatio.toFixed(2) : "N/A",
      icon: <Activity className="h-4 w-4 text-violet-400" />,
    },
    {
      label: "Change",
      value: formatPercentage(stockData.priceChange),
      icon: <Clock className="h-4 w-4 text-amber-400" />,
      valueClass: stockData.priceChange >= 0 ? "num-positive" : "num-negative",
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
              onClick={() => router.push("/dashboard")}
              className="gap-1.5 text-muted-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <div className="w-px h-4 bg-border" />
            <div
              className="flex items-center gap-1.5 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold tracking-tight hidden sm:inline">tradeo</span>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/dashboard")}
           
          >
            Dashboard
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-6 space-y-5">
        {/* ── Stock Header ── */}
        <div className="fade-in space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-secondary">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{stockData.ticker}</h1>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(stockData.lastUpdated).toLocaleString()}
                    <span className="text-border">|</span>
                    <span>{stockData.isIndian ? "NSE/BSE" : "NASDAQ/NYSE"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl sm:text-3xl font-bold tabular">
                {formatCurrency(stockData.currentPrice, stockData.currency)}
              </div>
              <div
                className={`text-sm font-medium tabular ${
                  stockData.priceChange >= 0 ? "num-positive" : "num-negative"
                }`}
              >
                {formatPercentage(stockData.priceChange)}
              </div>
            </div>
          </div>

          {/* ── Metrics ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {metrics.map((m, i) => (
              <Card key={i} className="fade-in" style={{ animationDelay: `${i * 50}ms` }}>
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="flex-shrink-0">{m.icon}</div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{m.label}</div>
                    <div className={`text-sm font-semibold tabular truncate ${m.valueClass || ""}`}>
                      {m.value}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Main: AI Analysis */}
          <div className="lg:col-span-2 space-y-5">
            {/* Analysis */}
            <Card className="accent-line fade-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Analysis
                  <span className={`ml-auto flex items-center gap-1.5 tag ${sentiment.bg} border`}>
                    <div className={`signal-dot ${sentiment.dot}`} />
                    <span className={sentiment.color}>{analysis.sentiment}</span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
                  {analysis.analysis}
                </div>
              </CardContent>
            </Card>

            {/* Key Points */}
            {analysis.keyPoints.length > 0 && (
              <Card className="fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-primary" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2.5">
                    {analysis.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-px">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        </div>
                        <span className="text-sm text-foreground/85 leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Recommendation */}
            <Card className="fade-in">
              <CardHeader>
                <CardTitle>Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`tag ${recommendationConfig(analysis.recommendation)} w-full justify-center py-2 text-sm`}>
                  {analysis.recommendation.toUpperCase()}
                </div>

                <div className="space-y-3 divide-y divide-border/30">
                  <div className="flex justify-between items-center pb-3">
                    <span className="text-xs text-muted-foreground">Sentiment</span>
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${sentiment.color}`}>
                      <div className={`signal-dot ${sentiment.dot}`} />
                      {analysis.sentiment}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-xs text-muted-foreground">Risk Level</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${risk.bg} ${risk.color}`}>
                      {analysis.riskLevel}
                    </span>
                  </div>

                  {analysis.timeHorizon && (
                    <div className="flex justify-between items-center pt-3">
                      <span className="text-xs text-muted-foreground">Time Horizon</span>
                      <span className="text-xs font-medium capitalize">{analysis.timeHorizon}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="fade-in">
              <CardContent className="p-4 space-y-2">
                <Button
                  onClick={() => analyzeStock(ticker as string)}
                  className="w-full gap-1.5"
                  disabled={loading}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                  Refresh Analysis
                </Button>
                <Button
                  variant="outline"
                  className="w-full gap-1.5"
                  onClick={() => router.push("/dashboard")}
                >
                  <Star className="h-3.5 w-3.5" />
                  View History
                </Button>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <div className="flex items-start gap-2 px-1 fade-in">
              <Shield className="h-3.5 w-3.5 text-muted-foreground/50 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-muted-foreground/60 leading-relaxed">
                For informational purposes only. Not financial advice. Always do your own research before investing.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
