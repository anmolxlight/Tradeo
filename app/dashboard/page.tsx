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
  Filter,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatabaseAnalysis } from "@/types"
import { formatCurrency, formatPercentage, validateTicker } from "@/lib/utils"
import { format } from "date-fns"

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
      
      // Check for pending ticker from pre-authentication search
      if (typeof window !== 'undefined') {
        const pendingTicker = sessionStorage.getItem('pendingTicker')
        if (pendingTicker) {
          sessionStorage.removeItem('pendingTicker')
          router.push(`/analyze/${pendingTicker}`)
        }
      }
    }
  }, [user, router])

  const fetchAnalyses = async () => {
    try {
      const response = await fetch('/api/analyze')
      if (!response.ok) throw new Error('Failed to fetch analyses')
      
      const data = await response.json()
      setAnalyses(data.analyses)
    } catch (err) {
      console.error('Error fetching analyses:', err)
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
      case 'buy': return 'text-green-500 bg-green-500/10'
      case 'sell': return 'text-red-500 bg-red-500/10'
      default: return 'text-yellow-500 bg-yellow-500/10'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish': return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'bearish': return <ArrowDownRight className="h-4 w-4 text-red-500" />
      default: return <BarChart3 className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => router.push('/')}
            >
              <TrendingUp className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold gradient-text">tradeo</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              onClick={() => router.push('/')}
              variant="ghost"
              className="btn-hover hidden sm:flex"
            >
              Home
            </Button>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8"
                }
              }}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            Welcome back, {user?.firstName || 'Investor'}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Your intelligent stock analysis dashboard
          </p>
        </div>

        {/* Quick Analysis Section */}
        <Card className="glass border-0 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>New Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNewAnalysis} className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter stock ticker (e.g., AAPL, RELIANCE, TSLA)"
                  value={searchTicker}
                  onChange={(e) => {
                    setSearchTicker(e.target.value)
                    setError("")
                  }}
                  className="pl-10 focus-ring"
                />
              </div>
              <Button 
                type="submit" 
                className="btn-hover"
                disabled={!searchTicker.trim()}
              >
                Analyze
              </Button>
            </form>
            
            {error && (
              <p className="text-red-400 text-sm mt-2 animate-slide-up">{error}</p>
            )}
          </CardContent>
        </Card>

        {/* Analysis History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold flex items-center space-x-2">
              <History className="h-6 w-6" />
              <span>Analysis History</span>
            </h2>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" className="glass">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glass border-0">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-3">
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-8 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : analyses.length === 0 ? (
            <Card className="glass border-0">
              <CardContent className="p-12 text-center">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No analyses yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start by analyzing your first stock to see insights here
                </p>
                <Button 
                  onClick={() => {
                    const input = document.querySelector('input[type="text"]') as HTMLInputElement
                    input?.focus()
                  }}
                  className="btn-hover"
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyses.map((analysis) => (
                <Card 
                  key={analysis.id} 
                  className="glass border-0 card-hover cursor-pointer"
                  onClick={() => handleAnalysisClick(analysis)}
                >
                  <CardContent className="p-6 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-primary">
                          {analysis.ticker}
                        </span>
                        {getSentimentIcon(analysis.analysis.sentiment)}
                      </div>
                      
                      {analysis.is_favorite && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>

                    {/* Price Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">
                          {formatCurrency(analysis.stock_data.currentPrice, analysis.stock_data.currency)}
                        </span>
                        <span className={`text-sm font-medium ${analysis.stock_data.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {formatPercentage(analysis.stock_data.priceChange)}
                        </span>
                      </div>
                    </div>

                    {/* Recommendation */}
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold uppercase ${getRecommendationColor(analysis.analysis.recommendation)}`}>
                        {analysis.analysis.recommendation}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {analysis.analysis.riskLevel} risk
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{format(new Date(analysis.created_at), 'MMM dd, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {analyses.length > 0 && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {analyses.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Analyses
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">
                  {analyses.filter(a => a.analysis.recommendation === 'buy').length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Buy Recommendations
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-0">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-500 mb-1">
                  {analyses.filter(a => a.is_favorite).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Favorites
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}