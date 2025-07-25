export interface StockData {
  ticker: string
  currentPrice: number
  targetPrice: number
  peRatio: number
  priceChange: number
  isIndian: boolean
  currency: string
  lastUpdated: Date
}

export interface StockAnalysis {
  ticker: string
  sentiment: 'bullish' | 'bearish' | 'neutral'
  recommendation: 'buy' | 'sell' | 'hold'
  analysis: string
  keyPoints: string[]
  riskLevel: 'low' | 'medium' | 'high'
  targetPrice?: number
  timeHorizon?: string
}

export interface AnalysisHistory {
  id: string
  userId: string
  ticker: string
  stockData: StockData
  analysis: StockAnalysis
  createdAt: Date
  isFavorite: boolean
}

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  imageUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

export interface DatabaseProfile {
  id: string
  user_id: string
  email: string
  first_name?: string
  last_name?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface DatabaseAnalysis {
  id: string
  user_id: string
  ticker: string
  stock_data: StockData
  analysis: StockAnalysis
  is_favorite: boolean
  created_at: string
  updated_at: string
}