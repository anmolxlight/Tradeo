import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
// Note: @clerk/themes not available in this version
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "tradeo - intelligent stock analysis, simplified",
  description: "AI-powered stock analysis for both Indian and international stocks with real-time insights",
  keywords: ["stock analysis", "AI", "trading", "investment", "financial analysis"],
  authors: [{ name: "tradeo" }],
  creator: "tradeo",
  publisher: "tradeo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: "tradeo - intelligent stock analysis, simplified",
    description: "AI-powered stock analysis for both Indian and international stocks with real-time insights",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "tradeo",
  },
  twitter: {
    card: "summary_large_image",
    title: "tradeo - intelligent stock analysis, simplified",
    description: "AI-powered stock analysis for both Indian and international stocks with real-time insights",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#3b82f6",
          colorBackground: "#0a0a0a",
          colorInputBackground: "#1a1a1a",
          colorInputText: "#ffffff",
        },
        elements: {
          formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground",
          card: "glass",
          headerTitle: "gradient-text",
          headerSubtitle: "text-muted-foreground",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={inter.className}>
          <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}