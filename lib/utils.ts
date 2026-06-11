import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface TickerValidation {
  isValid: boolean
  cleanTicker: string
  message: string
}

export function validateTicker(ticker: string): TickerValidation {
  if (!ticker || !ticker.trim()) {
    return { isValid: false, cleanTicker: "", message: "Please enter a stock ticker" }
  }

  const cleanTicker = ticker.trim().toUpperCase()
  
  // Basic validation: 1-10 alphanumeric characters
  if (!/^[A-Z0-9.]{1,10}$/.test(cleanTicker)) {
    return { 
      isValid: false, 
      cleanTicker, 
      message: "Invalid ticker symbol. Please enter a valid stock ticker (e.g., AAPL, RELIANCE, TSLA)"
    }
  }

  return { isValid: true, cleanTicker, message: "" }
}

export function formatCurrency(amount: number, currency: string = "$"): string {
  if (currency === "₹" || currency === "INR") {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? "+" : ""
  return `${sign}${value.toFixed(2)}%`
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date))
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + "..."
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  const diffMs = now.getTime() - target.getTime()
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMinutes < 1) return "just now"
  if (diffMinutes < 60) return `${diffMinutes}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return formatDate(date)
}
