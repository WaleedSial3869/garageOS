export interface Shop {
  id: string
  name: string
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  zip: string | null
  country: string
  phone: string | null
  email: string | null
  website: string | null
  logo_url: string | null
  tax_rate: number
  labor_rate: number
  currency: string
  timezone: string
  business_hours: Record<string, { open: string; close: string } | null>
  settings: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface TeamMember {
  id: string
  shop_id: string
  auth_user_id: string | null
  first_name: string
  last_name: string
  email: string
  phone: string | null
  role: "owner" | "admin" | "service_writer" | "technician" | "apprentice"
  avatar_url: string | null
  color: string
  hourly_rate: number | null
  commission_type: string | null
  commission_rate: number | null
  is_active: boolean
  permissions: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  shop_id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  phone_secondary: string | null
  address_line1: string | null
  address_line2: string | null
  city: string | null
  state: string | null
  zip: string | null
  company_name: string | null
  is_fleet: boolean
  is_tax_exempt: boolean
  tags: string[]
  notes: string | null
  preferred_contact: "email" | "sms" | "phone"
  customer_since: string
  referral_source: string | null
  created_at: string
  updated_at: string
}

export interface Vehicle {
  id: string
  shop_id: string
  customer_id: string
  vin: string | null
  year: number | null
  make: string | null
  model: string | null
  sub_model: string | null
  body_style: string | null
  engine: string | null
  engine_size: string | null
  fuel_type: string | null
  transmission: string | null
  drivetrain: string | null
  doors: number | null
  color: string | null
  license_plate: string | null
  license_state: string | null
  unit_number: string | null
  photo_url: string | null
  production_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  shop_id: string
  order_number: number
  order_type: "estimate" | "repair_order" | "invoice"
  status: string
  workflow_status: string
  customer_id: string | null
  vehicle_id: string | null
  service_writer_id: string | null
  customer_request: string | null
  tech_recommendation: string | null
  internal_notes: string | null
  parts_subtotal: number
  labor_subtotal: number
  subtotal: number
  discount_type: "percentage" | "fixed" | null
  discount_value: number
  discount_amount: number
  tax_rate: number | null
  tax_amount: number
  fees: number
  grand_total: number
  amount_paid: number
  balance_due: number
  tags: string[]
  payment_terms: string
  customer_po: string | null
  due_date: string | null
  completed_at: string | null
  invoiced_at: string | null
  paid_at: string | null
  approval_token: string | null
  approved_at: string | null
  approved_by: string | null
  mileage_in: number | null
  mileage_out: number | null
  kanban_position: number
  created_at: string
  updated_at: string
  // Joined relations
  customer?: Customer
  vehicle?: Vehicle
  service_writer?: TeamMember
}

export interface Tag {
  id: string
  shop_id: string
  name: string
  color: string
  entity_type: "order" | "customer" | "vehicle" | "labor" | "part"
  created_at: string
}
