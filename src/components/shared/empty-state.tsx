import { type LucideIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-4 bg-surface-container-low rounded-full mb-4">
        <Icon className="h-8 w-8 text-on-surface-variant" />
      </div>
      <h3 className="text-lg font-bold text-on-surface mb-2">{title}</h3>
      <p className="text-sm text-on-surface-variant max-w-md mb-6">
        {description}
      </p>
      {action && (
        <Button variant="gradient" onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  )
}
