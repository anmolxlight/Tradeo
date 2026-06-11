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
  Sparkles,
  ChevronRight,
  Building2,
  Activity,
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
        headers: {
          "Content-Type": "application/json",
        },
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "text-emerald-500"
      case "bearish":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  const getSentimentBg = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return "bg-emerald-500/10 border-emerald-500/20"
      case "bearish":
        return "bg-red-500/10 border-red-500/20"
      default:
        return "bg-yellow-500/10 border-yellow-500/20"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "bullish":
        return <TrendingUp className="h-5 w-5" />
      case "bearish":
        return <TrendingDown className="h-5 w-5" />
      default:
        return <BarChart3 className="h-5 w-5" />
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "buy":
        return "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 ring-1 ring-emerald-500/20"
      case "sell":
        return "bg-red-500/15 text-red-400 border-red-500/25 ring-1 ring-red-500/20"
      default:
        return "bg-yellow-500/15 text-yellow-400 border-yellow-500/25 ring-1 ring-yellow-500/20"
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "text-emerald-500"
      case "high":
        return "text-red-500"
      default:
        return "text-yellow-500"
    }
  }

  const getRiskBg = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-emerald-500/10"
      case "high":
        return "bg-red-500/10"
      default:
        return "bg-yellow-500/10"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full pulse-dot"></div>
            <div className="w-3 h-3 bg-primary rounded-full pulse-dot"></div>
            <div className="w-3 h-3 bg-primary rounded-full pulse-dot"></div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold">
              Analyzing <span className="text-primary">{ticker}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Gathering real-time data and generating AI-powered insights...
            </p>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2 animate-pulse">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span>Market data</span>
            </div>
            <div className="flex items-center justify-center gap-2 animate-pulse" style={{ animationDelay: "200ms" }}>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span>Financial metrics</span>
            </div>
            <div className="flex items-center justify-center gap-2 animate-pulse" style={{ animationDelay: "400ms" }}>
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              <span>AI insights</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="glass border-0 max-w-md w-full">
          <CardContent className="p-8 text-center space-y-5">
            <div className="inline-flex p-4 rounded-2xl bg-red-500/10">
              <AlertTriangle className="h-10 w-10 text-red-500" />
            </div>
            <h3 className="text-xl font-semibold">Analysis Failed</h3>
            <p className="text-muted-foreground text-sm">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="glass gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back Home
              </Button>
              <Button
                onClick={() => analyzeStock(ticker as string)}
                className="btn-hover gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) {
    return null
  }

  const { stockData, analysis } = data

  const metrics = [
    {
      label: "Current Price",
      value: formatCurrency(stockData.currentPrice, stockData.currency),
      icon: <DollarSign className="h-5 w-5 text-blue-500" />,
      bg: "from-blue-500/20 to-blue-600/5",
    },
    {
      label: "Target Price",
      value:
        stockData.targetPrice > 0
          ? formatCurrency(stockData.targetPrice, stockData.currency)
          : "N/A",
      icon: <Target className="h-5 w-5 text-emerald-500" />,
      bg: "from-emerald-500/20 to-emerald-600/5",
    },
    {
      label: "PE Ratio",
      value: stockData.peRatio > 0 ? stockData.peRatio.toFixed(2) : "N/A",
      icon: <Activity className="h-5 w-5 text-purple-500" />,
      bg: "from-purple-500/20 to-purple-600/5",
    },
    {
      label: "Change",
      value: formatPercentage(stockData.priceChange),
      icon: <Clock className="h-5 w-5 text-amber-500" />,
      bg: "from-amber-500/20 to-amber-600/5",
      valueColor: stockData.priceChange >= 0 ? "text-emerald-500" : "text-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/dashboard")}
                variant="ghost"
                size="sm"
                className="btn-hover gap-2 text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Button>
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
                <TrendingUp className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold gradient-text hidden sm:inline">
                  tradeo
                </span>
              </div>
            </div>

            <Button
              onClick={() => router.push("/dashboard")}
              variant="outline"
              size="sm"
              className="glass gap-2"
            >
              Dashboard
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 space-y-8">
        {/* ── Stock Header ── */}
        <div className="fade-in space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="inline-flex p-2.5 rounded-xl bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
                  {stockData.ticker}
                </h1>
                <span className="text-xs text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
                  {stockData.isIndian ? "NSE/BSE" : "NASDAQ/NYSE"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                Last updated: {new Date(stockData.lastUpdated).toLocaleString()}
              </p>
            </div>

            <div className="text-right">
              <div className="text-3xl sm:text-4xl font-bold tabular-nums">
                {formatCurrency(stockData.currentPrice, stockData.currency)}
              </div>
              <div
                className={`text-lg font-medium tabular-nums ${
                  stockData.priceChange >= 0 ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {formatPercentage(stockData.priceChange)}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {metrics.map((metric, i) => (
              <Card
                key={i}
                className="glass border-0 card-hover"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <CardContent className="p-4 text-center space-y-2">
                  <div className={`inline-flex p-2 rounded-lg bg-gradient-to-br ${metric.bg}`}>
                    {metric.icon}
                  </div>
                  <div className="text-xs text-muted-foreground">{metric.label}</div>
                  <div
                    className={`text-base sm:text-lg font-semibold tabular-nums ${
                      metric.valueColor || ""
                    }`}
                  >
                    {metric.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ── Analysis Content ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main: AI Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* AI Analysis Card */}
            <Card className="glass border-0 overflow-hidden fade-in">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>AI Analysis</span>
                  <span
                    className={`ml-auto flex items-center gap-1.5 text-xs font-normal px-2.5 py-1 rounded-full border ${getSentimentBg(
                      analysis.sentiment
                    )}`}
                  >
                    {getSentimentIcon(analysis.sentiment)}
                    <span className={`capitalize ${getSentimentColor(analysis.sentiment)}`}>
                      {analysis.sentiment}
                    </span>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {analysis.analysis}
                </div>
              </CardContent>
            </Card>

            {/* Key Points */}
            {analysis.keyPoints.length > 0 && (
              <Card className="glass border-0 fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Key Insights</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                        </div>
                        <span className="text-sm sm:text-base text-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recommendation */}
            <Card className="glass border-0 fade-in">
              <CardHeader>
                <CardTitle className="text-lg">Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div
                  className={`px-5 py-4 rounded-xl border text-center font-bold uppercase tracking-wider text-base ${getRecommendationColor(
                    analysis.recommendation
                  )}`}
                >
                  {analysis.recommendation}
                </div>

                <div className="space-y-3 divide-y divide-white/5">
                  <div className="flex justify-between items-center pb-3">
                    <span className="text-sm text-muted-foreground">Sentiment</span>
                    <span
                      className={`text-sm font-semibold capitalize flex items-center gap-1.5 ${getSentimentColor(
                        analysis.sentiment
                      )}`}
                    >
                      {getSentimentIcon(analysis.sentiment)}
                      {analysis.sentiment}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm text-muted-foreground">Risk Level</span>
                    <span
                      className={`text-sm font-semibold capitalize px-2.5 py-1 rounded-lg ${getRiskBg(
                        analysis.riskLevel
                      )} ${getRiskColor(analysis.riskLevel)}`}
                    >
                      {analysis.riskLevel}
                    </span>
                  </div>

                  {analysis.timeHorizon && (
                    <div className="flex justify-between items-center pt-3">
                      <span className="text-sm text-muted-foreground">Time Horizon</span>
                      <span className="text-sm font-semibold capitalize">
                        {analysis.timeHorizon}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="glass border-0 fade-in">
              <CardContent className="p-4 space-y-3">
                <Button
                  onClick={() => analyzeStock(ticker as string)}
                  className="w-full btn-hover gap-2"
                  disabled={loading}
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  Refresh Analysis
                </Button>

                <Button
                  variant="outline"
                  className="w-full glass gap-2"
                  onClick={() => router.push("/dashboard")}
                >
                  <Star className="h-4 w-4" />
                  View History
                </Button>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="glass border-0 bg-amber-500/5 border-amber-500/10 fade-in">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    <p className="font-medium text-amber-500 mb-1">Disclaimer</p>
                    <p>
                      This analysis is for informational purposes only and should not be considered
                      as financial advice. Always do your own research and consult with a financial
                      advisor before making investment decisions.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
