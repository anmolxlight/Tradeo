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
  RefreshCw
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
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticker: stockTicker }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze stock')
      }

      const result = await response.json()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return 'text-green-500'
      case 'bearish': return 'text-red-500'
      default: return 'text-yellow-500'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <TrendingUp className="h-5 w-5" />
      case 'bearish': return <TrendingDown className="h-5 w-5" />
      default: return <BarChart3 className="h-5 w-5" />
    }
  }

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'buy': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'sell': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
  }

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'low': return 'text-green-500'
      case 'high': return 'text-red-500'
      default: return 'text-yellow-500'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-1">
            <div className="w-3 h-3 bg-primary rounded-full pulse-dot"></div>
            <div className="w-3 h-3 bg-primary rounded-full pulse-dot"></div>
            <div className="w-3 h-3 bg-primary rounded-full pulse-dot"></div>
          </div>
          <p className="text-muted-foreground">Analyzing {ticker}...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="glass border-0 max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
            <h3 className="text-xl font-semibold">Analysis Failed</h3>
            <p className="text-muted-foreground">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => router.push('/')}
                variant="outline"
                className="glass"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back Home
              </Button>
              <Button 
                onClick={() => analyzeStock(ticker as string)}
                className="btn-hover"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => router.push('/')}
              variant="ghost"
              size="sm"
              className="btn-hover"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold gradient-text">tradeo</span>
            </div>
          </div>
          
          <Button 
            onClick={() => router.push('/dashboard')}
            variant="outline"
            className="glass"
          >
            Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stock Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                {stockData.ticker}
              </h1>
              <p className="text-muted-foreground">
                Last updated: {new Date(stockData.lastUpdated).toLocaleString()}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold">
                {formatCurrency(stockData.currentPrice, stockData.currency)}
              </div>
              <div className={`text-lg font-medium ${stockData.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {formatPercentage(stockData.priceChange)}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="glass border-0">
              <CardContent className="p-4 text-center">
                <DollarSign className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Current Price</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(stockData.currentPrice, stockData.currency)}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Target Price</div>
                <div className="text-lg font-semibold">
                  {stockData.targetPrice > 0 
                    ? formatCurrency(stockData.targetPrice, stockData.currency)
                    : 'N/A'
                  }
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-4 text-center">
                <BarChart3 className="h-6 w-6 text-purple-500 mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">PE Ratio</div>
                <div className="text-lg font-semibold">
                  {stockData.peRatio > 0 ? stockData.peRatio.toFixed(2) : 'N/A'}
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                <div className="text-sm text-muted-foreground">Change</div>
                <div className={`text-lg font-semibold ${stockData.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatPercentage(stockData.priceChange)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Analysis */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className={getSentimentColor(analysis.sentiment)}>
                    {getSentimentIcon(analysis.sentiment)}
                  </div>
                  <span>AI Analysis</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-invert max-w-none">
                  <p className="text-foreground leading-relaxed whitespace-pre-line">
                    {analysis.analysis}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Key Points */}
            {analysis.keyPoints.length > 0 && (
              <Card className="glass border-0">
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.keyPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-foreground">{point}</span>
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
            <Card className="glass border-0">
              <CardHeader>
                <CardTitle>Recommendation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`px-4 py-3 rounded-lg border text-center font-semibold uppercase tracking-wide ${getRecommendationColor(analysis.recommendation)}`}>
                  {analysis.recommendation}
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sentiment</span>
                    <span className={`font-medium capitalize ${getSentimentColor(analysis.sentiment)}`}>
                      {analysis.sentiment}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Risk Level</span>
                    <span className={`font-medium capitalize ${getRiskColor(analysis.riskLevel)}`}>
                      {analysis.riskLevel}
                    </span>
                  </div>
                  
                  {analysis.timeHorizon && (
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Time Horizon</span>
                      <span className="font-medium capitalize">
                        {analysis.timeHorizon}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card className="glass border-0">
              <CardContent className="p-4 space-y-3">
                <Button 
                  onClick={() => analyzeStock(ticker as string)}
                  className="w-full btn-hover"
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Analysis
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full glass"
                  onClick={() => router.push('/dashboard')}
                >
                  <Star className="h-4 w-4 mr-2" />
                  View History
                </Button>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="glass border-0 border-amber-500/20">
              <CardContent className="p-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium text-amber-500 mb-1">Disclaimer</p>
                    <p>
                      This analysis is for informational purposes only and should not be considered as financial advice. 
                      Always do your own research and consult with a financial advisor before making investment decisions.
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