import { SignIn } from '@clerk/nextjs'
import { TrendingUp } from 'lucide-react'

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <TrendingUp className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold gradient-text">tradeo</span>
          </div>
          <h2 className="text-xl text-muted-foreground">
            Sign in to your account
          </h2>
        </div>

        {/* Clerk Sign In Component */}
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "glass border-0",
                headerTitle: "gradient-text",
                headerSubtitle: "text-muted-foreground",
                formButtonPrimary: "bg-primary hover:bg-primary/90 text-primary-foreground btn-hover",
                formFieldInput: "focus-ring",
                footerActionLink: "text-primary hover:text-primary/80",
              },
            }}
            redirectUrl="/dashboard"
          />
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            New to tradeo?{' '}
            <a href="/sign-up" className="text-primary hover:text-primary/80">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}