export const ORDER_STATUSES = [
  "draft",
  "sent",
  "waiting_approval",
  "approved",
  "in_progress",
  "on_hold",
  "completed",
  "invoiced",
  "paid",
  "void",
  "archived",
] as const

export const WORKFLOW_STATUSES = [
  "estimates",
  "approved_work",
  "in_progress",
  "invoices",
] as const

export const TEAM_ROLES = [
  "owner",
  "admin",
  "service_writer",
  "technician",
  "apprentice",
] as const

export const PAYMENT_METHODS = [
  "cash",
  "credit_card",
  "debit",
  "check",
  "e_transfer",
  "other",
] as const

export const INSPECTION_CONDITIONS = [
  "good",
  "monitor",
  "attention",
  "immediate",
  "not_inspected",
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]
export type WorkflowStatus = (typeof WORKFLOW_STATUSES)[number]
export type TeamRole = (typeof TEAM_ROLES)[number]
export type PaymentMethod = (typeof PAYMENT_METHODS)[number]
export type InspectionCondition = (typeof INSPECTION_CONDITIONS)[number]

export const PREFERRED_CONTACT_METHODS = ["email", "sms", "phone"] as const
export type PreferredContact = (typeof PREFERRED_CONTACT_METHODS)[number]

export const REFERRAL_SOURCES = [
  "walk_in",
  "google",
  "yelp",
  "referral",
  "social_media",
  "other",
] as const

export const CA_PROVINCES = [
  "AB", "BC", "MB", "NB", "NL", "NS", "NT", "NU", "ON", "PE", "QC", "SK", "YT",
] as const

export const VEHICLE_FUEL_TYPES = [
  "Gasoline",
  "Diesel",
  "Electric",
  "Hybrid",
  "Plug-in Hybrid",
  "Flex Fuel",
] as const

export const VEHICLE_TRANSMISSIONS = [
  "Automatic",
  "Manual",
  "CVT",
] as const

export const VEHICLE_DRIVETRAINS = [
  "FWD",
  "RWD",
  "AWD",
  "4WD",
] as const
