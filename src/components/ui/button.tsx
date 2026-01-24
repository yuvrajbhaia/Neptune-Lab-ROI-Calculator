import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-[#E07A5F] text-white hover:bg-[#C96A51] focus-visible:ring-[#E07A5F]",
        secondary:
          "border-2 border-[#E07A5F] bg-transparent text-[#E07A5F] hover:bg-[#E07A5F]/10 focus-visible:ring-[#E07A5F]",
        outline:
          "border border-[#E5E7EB] bg-white text-[#1A1A1A] hover:bg-[#F9FAFB] focus-visible:ring-[#E5E7EB]",
        ghost:
          "text-[#6B7280] hover:text-[#1A1A1A] hover:bg-[#F3F4F6] focus-visible:ring-[#E5E7EB]",
        link: "text-[#E07A5F] underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        default: "h-11 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
