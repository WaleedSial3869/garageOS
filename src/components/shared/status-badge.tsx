import { cn } from "@/lib/utils"

type OrderStatus =
  | "draft"
  | "sent"
  | "waiting_approval"
  | "approved"
  | "in_progress"
  | "on_hold"
  | "completed"
  | "invoiced"
  | "paid"
  | "void"
  | "archived"

const statusStyles: Record<OrderStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-primary-fixed text-primary",
  waiting_approval: "bg-secondary-fixed text-on-secondary-fixed-variant",
  approved: "bg-tertiary-container/20 text-tertiary",
  in_progress: "bg-primary-fixed text-primary",
  on_hold: "bg-error-container text-on-error-container",
  completed: "bg-tertiary-container/20 text-tertiary",
  invoiced: "bg-surface-container-high text-on-surface",
  paid: "bg-tertiary-container/20 text-tertiary",
  void: "bg-slate-100 text-slate-400",
  archived: "bg-slate-100 text-slate-400",
}

const statusLabels: Record<OrderStatus, string> = {
  draft: "DRAFT",
  sent: "SENT",
  waiting_approval: "WAITING APPROVAL",
  approved: "APPROVED",
  in_progress: "IN PROGRESS",
  on_hold: "ON HOLD",
  completed: "COMPLETED",
  invoiced: "INVOICED",
  paid: "PAID",
  void: "VOID",
  archived: "ARCHIVED",
}

interface StatusBadgeProps {
  status: string
  size?: "sm" | "md"
  className?: string
}

export function StatusBadge({ status, size = "sm", className }: StatusBadgeProps) {
  const key = status as OrderStatus
  const styles = statusStyles[key] || "bg-slate-100 text-slate-600"
  const label = statusLabels[key] || status.toUpperCase().replace(/_/g, " ")

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-bold uppercase",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-3 py-1 text-xs",
        styles,
        className
      )}
    >
      {label}
    </span>
  )
}
