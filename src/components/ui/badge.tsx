import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-bold uppercase",
  {
    variants: {
      variant: {
        default: "bg-primary-fixed text-on-primary-fixed-variant",
        secondary: "bg-secondary-fixed text-on-secondary-fixed-variant",
        tertiary: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
        destructive: "bg-error-container text-on-error-container",
        outline: "border border-outline-variant text-on-surface-variant",
      },
      size: {
        default: "px-2 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
