import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "ghost" | "outline"
    size?: "sm" | "md" | "lg"
  }
>(({ className, variant = "primary", size = "md", ...props }, ref) => {
  const variants = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    outline: "btn-outline",
  }

  const sizes = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-sm",
  }

  return (
    <button
      ref={ref}
      className={cn(variants[variant], sizes[size], className)}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
