import { z } from "zod/v4"

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const registerSchema = z.object({
  shopName: z.string().min(1, "Shop name is required"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const customerSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().optional().default(""),
  phone: z.string().optional().default(""),
  phone_secondary: z.string().optional().default(""),
  address_line1: z.string().optional().default(""),
  address_line2: z.string().optional().default(""),
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  zip: z.string().optional().default(""),
  company_name: z.string().optional().default(""),
  is_fleet: z.boolean().default(false),
  is_tax_exempt: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
  notes: z.string().optional().default(""),
  preferred_contact: z.enum(["email", "sms", "phone"]).default("sms"),
  referral_source: z.string().optional().default(""),
})

export const vehicleSchema = z.object({
  customer_id: z.string().min(1, "Customer is required"),
  vin: z.string().optional().default(""),
  year: z.number().int().min(1900).max(2035).optional(),
  make: z.string().optional().default(""),
  model: z.string().optional().default(""),
  sub_model: z.string().optional().default(""),
  body_style: z.string().optional().default(""),
  engine: z.string().optional().default(""),
  engine_size: z.string().optional().default(""),
  fuel_type: z.string().optional().default(""),
  transmission: z.string().optional().default(""),
  drivetrain: z.string().optional().default(""),
  doors: z.number().int().optional(),
  color: z.string().optional().default(""),
  license_plate: z.string().optional().default(""),
  license_state: z.string().optional().default(""),
  unit_number: z.string().optional().default(""),
  notes: z.string().optional().default(""),
  mileage: z.number().int().positive().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type CustomerInput = z.infer<typeof customerSchema>
export type VehicleInput = z.infer<typeof vehicleSchema>
