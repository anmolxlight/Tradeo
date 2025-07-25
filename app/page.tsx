"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser, SignInButton, SignUpButton } from "@clerk/nextjs"
import { Search, TrendingUp, BarChart3, Shield, Zap, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { validateTicker } from "@/lib/utils"

export default function HomePage() {
  const [ticker, setTicker] = useState("")
  const [error, setError] = useState("")
  const { isSignedIn, user } = useUser()
  const router = useRouter()

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
      // Store the ticker for after authentication
      sessionStorage.setItem('pendingTicker', validation.cleanTicker)
      // Redirect to sign-in will be handled by the sign-in button
    }
  }

  const features = [
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-500" />,
      title: "Real-time Analysis",
      description: "Get instant AI-powered analysis with current market data and trends"
    },
    {
      icon: <Globe className="h-8 w-8 text-green-500" />,
      title: "Global Markets",
      description: "Support for both Indian and international stocks with accurate currency detection"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-500" />,
      title: "Comprehensive Metrics",
      description: "PE ratios, target prices, price changes, and detailed technical analysis"
    },
    {
      icon: <Shield className="h-8 w-8 text-amber-500" />,
      title: "Risk Assessment",
      description: "Advanced risk analysis with investment recommendations and time horizons"
    },
    {
      icon: <Zap className="h-8 w-8 text-red-500" />,
      title: "Lightning Fast",
      description: "Powered by advanced AI models for quick and accurate stock insights"
    }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">tradeo</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <Button 
                onClick={() => router.push('/dashboard')}
                className="btn-hover"
              >
                Dashboard
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton mode="modal">
                  <Button variant="ghost" className="btn-hover">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button className="btn-hover">
                    Get Started
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-responsive-xl font-extralight tracking-tight gradient-text">
              tradeo
            </h1>
            <p className="text-xl text-muted-foreground font-normal">
              intelligent stock analysis, simplified ✨
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-lg mx-auto space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter stock ticker (e.g., AAPL, RELIANCE, TSLA)"
                  value={ticker}
                  onChange={(e) => {
                    setTicker(e.target.value)
                    setError("")
                  }}
                  className="pl-12 h-14 text-lg glass focus-ring border-0"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-hover"
                disabled={!ticker.trim()}
              >
                Analyze
              </Button>
            </form>
            
            {error && (
              <p className="text-red-400 text-sm animate-slide-up">{error}</p>
            )}
            
            {!isSignedIn && (
              <p className="text-sm text-muted-foreground">
                <SignUpButton mode="modal">
                  <Button variant="link" className="p-0 h-auto text-sm text-primary">
                    Sign up
                  </Button>
                </SignUpButton>
                {" "}to save your analysis history
              </p>
            )}
          </div>

          {/* Quick Examples */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {['AAPL', 'TSLA', 'RELIANCE', 'TCS', 'GOOGL'].map((example) => (
              <Button
                key={example}
                variant="outline"
                size="sm"
                onClick={() => setTicker(example)}
                className="glass hover:bg-white/10 border-white/20 text-xs"
              >
                {example}
              </Button>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-24 px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold gradient-text mb-4">
              Why Choose tradeo?
            </h2>
            <p className="text-lg text-muted-foreground">
              Advanced AI-powered stock analysis with real-time data and comprehensive insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="glass card-hover border-0">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-24 text-center space-y-8 px-4">
          <div className="glass p-8 rounded-2xl border-0">
            <h2 className="text-3xl font-semibold gradient-text mb-4">
              Ready to start analyzing?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Join thousands of investors making smarter decisions with AI-powered insights
            </p>
            {!isSignedIn && (
              <SignUpButton mode="modal">
                <Button size="lg" className="btn-hover">
                  Get Started Free
                </Button>
              </SignUpButton>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 tradeo. This is for informational purposes only. Always do your own research before investing.</p>
        </div>
      </footer>
    </div>
  )
}