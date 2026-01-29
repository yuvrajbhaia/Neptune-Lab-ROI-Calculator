import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  // Use basic number formatting without any locale-specific currency formatting
  // This avoids the superscript issue with Indian rupee symbol
  const formatted = amount.toLocaleString('en-IN', {
    maximumFractionDigits: 0,
    useGrouping: true,
  });
  // Manually prefix with rupee symbol
  return `₹${formatted}`;
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num)
}
