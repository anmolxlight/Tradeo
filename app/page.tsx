"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs"
import {
  Search,
  TrendingUp,
  ChevronRight,
  Globe,
  BarChart3,
  Shield,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { validateTicker } from "@/lib/utils"

const quickTickers = [
  { symbol: "AAPL", name: "Apple" },
  { symbol: "TSLA", name: "Tesla" },
  { symbol: "RELIANCE", name: "Reliance" },
  { symbol: "GOOGL", name: "Alphabet" },
  { symbol: "TCS", name: "TCS" },
]

const features = [
  {
    icon: <TrendingUp className="h-4 w-4" />,
    title: "Real-time Analysis",
    desc: "Instant AI insights with live market data",
    color: "text-emerald-500",
  },
  {
    icon: <Globe className="h-4 w-4" />,
    title: "Global Markets",
    desc: "US, India, and international exchanges",
    color: "text-blue-500",
  },
  {
    icon: <BarChart3 className="h-4 w-4" />,
    title: "Deep Metrics",
    desc: "PE ratios, targets, and technical analysis",
    color: "text-violet-500",
  },
  {
    icon: <Shield className="h-4 w-4" />,
    title: "Risk Assessment",
    desc: "Risk scoring with investment timeframes",
    color: "text-amber-500",
  },
]

export default function HomePage() {
  const [ticker, setTicker] = useState("")
  const [error, setError] = useState("")
  const { isSignedIn } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn && typeof window !== "undefined") {
      const pending = sessionStorage.getItem("pendingTicker")
      if (pending) {
        sessionStorage.removeItem("pendingTicker")
        router.push(`/analyze/${pending}`)
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

  const goTo = (t: string) => {
    if (isSignedIn) {
      router.push(`/analyze/${t}`)
    } else {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("pendingTicker", t)
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 h-14 flex items-center border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="w-full max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full animate-ping opacity-60" />
            </div>
            <span className="text-sm font-semibold tracking-tight">tradeo</span>
          </div>
          <div className="flex items-center gap-2">
            {isSignedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="gap-1.5"
              >
                Dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <>
                <SignInButton mode="modal">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button size="sm">Get Started</Button>
                </SignUpButton>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 pt-20 pb-12 sm:pt-28 sm:pb-16">
          <div className="text-center space-y-8">
            <h1 className="text-responsive-xl font-bold tracking-tight">
              stock analysis,<br />
              <span className="text-primary">simplified.</span>
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto leading-relaxed">
              AI-powered insights for any stock. One ticker, full analysis.
            </p>

            {/* ── Search ── */}
            <form onSubmit={handleSearch} className="max-w-lg mx-auto">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="text"
                  placeholder="AAPL, RELIANCE, TSLA..."
                  value={ticker}
                  onChange={(e) => {
                    setTicker(e.target.value.toUpperCase())
                    setError("")
                  }}
                  className="pl-10 pr-24 h-12 text-base bg-surface-1 border-border/60 focus:border-primary/50"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!ticker.trim()}
                    className="h-9 gap-1.5 px-4"
                  >
                    Analyze
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              {error && (
                <p className="text-destructive text-xs mt-2 text-left animate-slide-up">{error}</p>
              )}
            </form>

            {/* ── Quick Tickers ── */}
            <div className="flex flex-wrap justify-center gap-1.5">
              {quickTickers.map((t) => (
                <button
                  key={t.symbol}
                  onClick={() => goTo(t.symbol)}
                  className="px-3 py-1.5 rounded-md bg-secondary border border-border/50 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all duration-150"
                >
                  {t.symbol}
                </button>
              ))}
            </div>

            {!isSignedIn && (
              <p className="text-xs text-muted-foreground">
                <SignUpButton mode="modal">
                  <button className="text-primary font-medium hover:underline">
                    Sign up
                  </button>
                </SignUpButton>
                {" "}to save analysis history
              </p>
            )}
          </div>
        </div>

        {/* ── Features ── */}
        <div className="max-w-3xl mx-auto px-4 pb-20">
          <div className="divider-subtle mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div
                key={i}
                className="card p-4 flex items-start gap-3 fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`mt-0.5 ${f.color}`}>{f.icon}</div>
                <div>
                  <h3 className="text-sm font-semibold">{f.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-border/50 py-5">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="font-medium">tradeo</span>
          </div>
          <p className="text-[10px] text-muted-foreground/60">
            For informational purposes only. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  )
}
