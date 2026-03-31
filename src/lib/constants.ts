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
