import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefix?: string
  suffix?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, prefix, suffix, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {prefix && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-lg font-medium">
              {prefix}
            </span>
          )}
          <input
            type={type}
            className={cn(
              "flex h-14 w-full rounded-lg border border-[#E5E7EB] bg-white px-4 text-lg text-[#1A1A1A] transition-all duration-200",
              "placeholder:text-[#9CA3AF]",
              "focus:outline-none focus:ring-2 focus:ring-[#E07A5F]/20 focus:border-[#E07A5F]",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[#F9FAFB]",
              error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
              prefix && "pl-10",
              suffix && "pr-16",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6B7280] text-sm">
              {suffix}
            </span>
          )}
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
