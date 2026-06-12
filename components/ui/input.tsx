import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "input h-10 px-3 w-full",
          className
        )}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
