import { format, formatDistanceToNow } from "date-fns"

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
  }).format(amount)
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  if (cleaned.length === 11 && cleaned[0] === "1") {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  return phone
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy")
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "MMM dd, yyyy h:mm a")
}

export function formatTimeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export function formatOrderNumber(
  orderNumber: number,
  orderType: string
): string {
  const prefix =
    orderType === "estimate"
      ? "EST"
      : orderType === "invoice"
        ? "INV"
        : "RO"
  return `${prefix}-${orderNumber}`
}
