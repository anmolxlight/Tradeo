import { SignIn } from "@clerk/nextjs"
import { TrendingUp, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        {/* Header */}
        <div className="text-center">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
            <TrendingUp className="h-7 w-7 text-primary" />
          </div>
          <h2 className="text-2xl font-bold gradient-text mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm">Sign in to your tradeo account</p>
        </div>

        {/* Clerk Component */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "glass border-0 shadow-xl shadow-black/20",
                headerTitle: "gradient-text hidden",
                headerSubtitle: "text-muted-foreground hidden",
                header: "hidden",
                formButtonPrimary:
                  "bg-primary hover:bg-primary/90 text-primary-foreground btn-hover shadow-lg shadow-primary/20",
                formFieldInput:
                  "focus-ring glass border-white/10 bg-background/80",
                footerActionLink: "text-primary hover:text-primary/80",
                socialButtonsBlockButton:
                  "glass border-white/10 hover:bg-white/10",
                identityPreviewEditButton: "text-primary",
                formFieldLabel: "text-muted-foreground",
              },
            }}
            redirectUrl="/dashboard"
          />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          New to tradeo?{" "}
          <Link href="/sign-up" className="text-primary hover:text-primary/80 font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
