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

export function formatVin(vin: string): string {
  if (vin.length <= 4) return vin
  return vin.slice(0, -4) + "****"
}

export function formatInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function formatAddress(customer: {
  address_line1?: string | null
  city?: string | null
  state?: string | null
  zip?: string | null
}): string {
  const parts = [
    customer.address_line1,
    customer.city,
    customer.state,
    customer.zip,
  ].filter(Boolean)
  return parts.join(", ")
}

export function formatVehicleName(vehicle: {
  year?: number | null
  make?: string | null
  model?: string | null
  sub_model?: string | null
}): string {
  const parts = [vehicle.year, vehicle.make, vehicle.model, vehicle.sub_model].filter(Boolean)
  return parts.join(" ")
}

export function formatMileage(mileage: number): string {
  return new Intl.NumberFormat("en-CA").format(mileage) + " km"
}
