"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs"
import {
  Search,
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  Globe,
  Sparkles,
  ArrowRight,
  LineChart,
  Bookmark,
  Clock,
  ChevronRight,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { validateTicker } from "@/lib/utils"

const quickTickers = ["AAPL", "TSLA", "RELIANCE", "TCS", "GOOGL"]

const features = [
  {
    icon: <TrendingUp className="h-6 w-6 text-blue-500" />,
    title: "Real-time Analysis",
    description: "Instant AI-powered analysis with current market data and trends",
    gradient: "from-blue-500/20 to-blue-600/5",
  },
  {
    icon: <Globe className="h-6 w-6 text-emerald-500" />,
    title: "Global Markets",
    description: "Support for Indian and international stocks with smart currency detection",
    gradient: "from-emerald-500/20 to-emerald-600/5",
  },
  {
    icon: <BarChart3 className="h-6 w-6 text-purple-500" />,
    title: "Deep Metrics",
    description: "PE ratios, target prices, price changes, and detailed technical analysis",
    gradient: "from-purple-500/20 to-purple-600/5",
  },
  {
    icon: <Shield className="h-6 w-6 text-amber-500" />,
    title: "Risk Assessment",
    description: "Advanced risk analysis with investment recommendations and time horizons",
    gradient: "from-amber-500/20 to-amber-600/5",
  },
  {
    icon: <Zap className="h-6 w-6 text-rose-500" />,
    title: "Lightning Fast",
    description: "Powered by advanced AI models for quick and accurate stock insights",
    gradient: "from-rose-500/20 to-rose-600/5",
  },
  {
    icon: <Sparkles className="h-6 w-6 text-cyan-500" />,
    title: "AI-Powered",
    description: "Smart sentiment analysis and personalized investment recommendations",
    gradient: "from-cyan-500/20 to-cyan-600/5",
  },
]

export default function HomePage() {
  const [ticker, setTicker] = useState("")
  const [error, setError] = useState("")
  const { isSignedIn, user } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn && typeof window !== "undefined") {
      const pendingTicker = sessionStorage.getItem("pendingTicker")
      if (pendingTicker) {
        sessionStorage.removeItem("pendingTicker")
        router.push(`/analyze/${pendingTicker}`)
      }
    }
  }, [isSignedIn, router])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const validation = validateTicker(ticker)

    if (!validation.isValid) {
      setError(validation.message)
      return
    }

    setError("")

    if (isSignedIn) {
      router.push(`/analyze/${validation.cleanTicker}`)
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingTicker", validation.cleanTicker)
      }
    }
  }

  const handleQuickSearch = (t: string) => {
    if (isSignedIn) {
      router.push(`/analyze/${t}`)
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingTicker", t)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-flare">
      {/* ── Header ── */}
      <header className="border-b border-border/50 bg-background/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="relative">
                <TrendingUp className="h-7 w-7 text-primary" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-ping opacity-75" />
              </div>
              <span className="text-xl font-bold gradient-text">tradeo</span>
            </div>

            <div className="flex items-center gap-3">
              {isSignedIn ? (
                <Button
                  onClick={() => router.push("/dashboard")}
                  className="btn-hover gap-2"
                >
                  Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <>
                  <SignInButton mode="modal">
                    <Button variant="ghost" className="btn-hover text-sm">
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <Button className="btn-hover gap-2 shadow-lg shadow-primary/20">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </SignUpButton>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <main className="flex-1">
        <section className="relative">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-20 pb-16 sm:pt-28 sm:pb-20">
            <div className="text-center space-y-8 relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                AI-Powered Stock Analysis
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-responsive-xl font-semibold tracking-tight">
                  <span className="gradient-text-accent">Intelligent</span>
                  <br />
                  <span className="gradient-text">Stock Analysis</span>
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Get AI-powered insights on any stock — from Wall Street to Dalal Street.
                  Real-time data, smart analysis, clear recommendations.
                </p>
              </div>

              {/* Search */}
              <div className="max-w-xl mx-auto space-y-4">
                <form onSubmit={handleSearch}>
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                    <div className="relative flex items-center">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                      <Input
                        type="text"
                        placeholder="Enter a ticker (e.g., AAPL, RELIANCE, TSLA)"
                        value={ticker}
                        onChange={(e) => {
                          setTicker(e.target.value.toUpperCase())
                          setError("")
                        }}
                        className="pl-12 pr-36 h-14 text-base glass border-white/10 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 rounded-2xl bg-background/80"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                      />
                      <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Button
                          type="submit"
                          size="lg"
                          className="btn-hover h-10 rounded-xl px-5 gap-2"
                          disabled={!ticker.trim()}
                        >
                          Analyze
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>

                {error && (
                  <p className="text-red-400 text-sm animate-slide-up">{error}</p>
                )}

                {!isSignedIn && (
                  <p className="text-sm text-muted-foreground">
                    <SignUpButton mode="modal">
                      <Button variant="link" className="p-0 h-auto text-sm text-primary font-medium">
                        Sign up
                      </Button>
                    </SignUpButton>
                    {" "}to save your analysis history and get personalized insights
                  </p>
                )}

                {/* Quick Tickers */}
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  <span className="text-xs text-muted-foreground self-center mr-1">
                    Try:
                  </span>
                  {quickTickers.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setTicker(t)
                        handleQuickSearch(t)
                      }}
                      className="px-3 py-1.5 rounded-lg glass text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white/10 border border-white/10 transition-all duration-200"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Features ── */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pb-24">
          <div className="divider-gradient mb-16" />

          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text">
              Everything You Need
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive stock analysis tools powered by cutting-edge AI
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass card-hover border-0 group fade-in"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.gradient}`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pb-24">
          <div className="divider-gradient mb-16" />

          <div className="text-center mb-14 space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold gradient-text">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to smarter investing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: <Search className="h-6 w-6" />,
                title: "Enter a Ticker",
                desc: "Type any stock ticker — AAPL, RELIANCE, TSLA. We handle both US and Indian markets.",
              },
              {
                step: "02",
                icon: <BarChart3 className="h-6 w-6" />,
                title: "AI Analyzes",
                desc: "Our AI gathers real-time data and generates comprehensive analysis with key insights.",
              },
              {
                step: "03",
                icon: <LineChart className="h-6 w-6" />,
                title: "Get Insights",
                desc: "Receive clear recommendations, sentiment analysis, and risk assessment instantly.",
              },
            ].map((item, index) => (
              <div key={index} className="text-center space-y-4 fade-in" style={{ animationDelay: `${index * 120}ms` }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-2">
                  <div className="text-primary">{item.icon}</div>
                </div>
                <div className="text-xs font-mono text-primary/60">{item.step}</div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl pb-24">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-500/20 to-primary/20" />
            <div className="relative glass-strong p-10 sm:p-14 text-center space-y-6 border border-white/10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-2">
                <Star className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold gradient-text">
                Ready to Start Analyzing?
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Join thousands of investors making smarter decisions with AI-powered insights.
                No credit card required.
              </p>
              {!isSignedIn ? (
                <SignUpButton mode="modal">
                  <Button size="lg" className="btn-hover gap-2 shadow-lg shadow-primary/30 text-base px-8 h-14 rounded-xl">
                    Get Started Free
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </SignUpButton>
              ) : (
                <Button
                  onClick={() => router.push("/dashboard")}
                  size="lg"
                  className="btn-hover gap-2 shadow-lg shadow-primary/30 text-base px-8 h-14 rounded-xl"
                >
                  Go to Dashboard
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>tradeo</span>
            </div>
            <p className="text-xs text-muted-foreground text-center sm:text-right leading-relaxed">
              This is for informational purposes only. Always do your own research before investing.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
