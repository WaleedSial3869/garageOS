import { cn } from "@/lib/utils"
import { formatInitials } from "@/lib/formatters"

interface AvatarProps {
  firstName: string
  lastName: string
  imageUrl?: string | null
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-16 h-16 text-xl",
  xl: "w-20 h-20 md:w-24 md:h-24 text-3xl",
}

export function Avatar({
  firstName,
  lastName,
  imageUrl,
  size = "md",
  className,
}: AvatarProps) {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${firstName} ${lastName}`}
        className={cn(
          "rounded-full object-cover",
          sizeClasses[size],
          className
        )}
      />
    )
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20",
        sizeClasses[size],
        className
      )}
    >
      {formatInitials(firstName, lastName)}
    </div>
  )
}
