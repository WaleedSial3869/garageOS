import { cn } from "@/lib/utils"

interface TagBadgeProps {
  label: string
  color?: string
  variant?: "primary" | "secondary" | "tertiary" | "default"
  onRemove?: () => void
  className?: string
}

const variantStyles = {
  primary: "bg-primary-fixed text-on-primary-fixed-variant",
  secondary: "bg-secondary-fixed text-on-secondary-fixed-variant",
  tertiary: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
  default: "bg-surface-container text-on-surface-variant",
}

export function TagBadge({
  label,
  variant = "default",
  onRemove,
  className,
}: TagBadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-0.5 text-[10px] font-bold rounded uppercase inline-flex items-center gap-1",
        variantStyles[variant],
        className
      )}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
        >
          &times;
        </button>
      )}
    </span>
  )
}
