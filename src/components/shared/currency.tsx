import { cn } from "@/lib/utils"

interface CurrencyProps {
  amount: number
  className?: string
}

const formatter = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
})

export function Currency({ amount, className }: CurrencyProps) {
  return <span className={cn(className)}>{formatter.format(amount)}</span>
}

export function formatCurrency(amount: number): string {
  return formatter.format(amount)
}
