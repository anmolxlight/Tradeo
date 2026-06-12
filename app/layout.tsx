import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "tradeo - stock analysis, simplified",
  description: "AI-powered stock analysis with real-time insights for global markets",
  keywords: ["stock analysis", "AI", "trading", "financial analysis"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "tradeo",
    description: "AI-powered stock analysis with real-time insights",
    type: "website",
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
          colorPrimary: "#22c55e",
          colorBackground: "#0f1117",
          colorInputBackground: "#151921",
          colorInputText: "#f0f2f5",
        },
        elements: {
          formButtonPrimary: "btn-primary",
          card: "surface-1",
          headerTitle: "font-semibold",
          headerSubtitle: "text-muted-foreground",
        },
      }}
    >
      <html lang="en" className="dark">
        <body className={inter.className}>
          <div className="min-h-screen">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  )
}
