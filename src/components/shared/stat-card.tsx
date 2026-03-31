import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: string
    direction: "up" | "down" | "neutral"
  }
  variant?: "default" | "urgent"
  className?: string
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  variant = "default",
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "tonal-card p-6 rounded-xl border border-transparent shadow-sm flex flex-col",
        variant === "urgent" && "border-l-4 border-error/30",
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <span
          className={cn(
            "p-2 rounded-lg",
            variant === "urgent"
              ? "bg-error-container text-error"
              : "bg-blue-50 text-primary"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        {trend && (
          <span
            className={cn(
              "text-xs font-bold px-2 py-1 rounded-full",
              trend.direction === "up" &&
                "text-tertiary bg-tertiary-container/10",
              trend.direction === "down" &&
                "text-error bg-error-container/50",
              trend.direction === "neutral" &&
                "text-blue-600 bg-primary-fixed/50"
            )}
          >
            {trend.value}
          </span>
        )}
      </div>
      <span className="text-sm font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
        {title}
      </span>
      <span className="text-2xl font-extrabold text-on-surface">{value}</span>
    </div>
  )
}
