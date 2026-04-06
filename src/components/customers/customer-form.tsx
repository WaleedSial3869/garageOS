"use client"

import { useForm } from "react-hook-form"
import { X } from "lucide-react"
import { customerSchema, type CustomerInput } from "@/lib/validators"
import type { Customer } from "@/types"

interface CustomerFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer?: Customer
}

export function CustomerForm({ open, onOpenChange, customer }: CustomerFormProps) {
  const isEdit = !!customer

  const { register, handleSubmit, formState: { errors } } = useForm<CustomerInput>({
    defaultValues: customer
      ? {
          first_name: customer.first_name,
          last_name: customer.last_name,
          email: customer.email ?? "",
          phone: customer.phone ?? "",
          phone_secondary: customer.phone_secondary ?? "",
          address_line1: customer.address_line1 ?? "",
          address_line2: customer.address_line2 ?? "",
          city: customer.city ?? "",
          state: customer.state ?? "",
          zip: customer.zip ?? "",
          company_name: customer.company_name ?? "",
          is_fleet: customer.is_fleet,
          notes: customer.notes ?? "",
          preferred_contact: customer.preferred_contact,
          referral_source: customer.referral_source ?? "",
        }
      : {
          preferred_contact: "sms",
          is_fleet: false,
        },
  })

  if (!open) return null

  const onSubmit = (data: CustomerInput) => {
    // In demo mode, just close the modal
    console.log("Customer data:", data)
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/20 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-[650px] rounded-xl shadow-[0px_20px_40px_rgba(11,28,48,0.06)] flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15">
          <h2 className="text-xl font-bold tracking-tight text-on-surface">
            {isEdit ? "Edit Customer" : "New Customer"}
          </h2>
          <button
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                First Name *
              </label>
              <input
                {...register("first_name")}
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                placeholder="First name"
              />
              {errors.first_name && (
                <p className="text-xs text-error">{errors.first_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                Last Name *
              </label>
              <input
                {...register("last_name")}
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                placeholder="Last name"
              />
              {errors.last_name && (
                <p className="text-xs text-error">{errors.last_name.message}</p>
              )}
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Email</label>
              <input
                {...register("email")}
                type="email"
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                placeholder="email@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Phone</label>
              <input
                {...register("phone")}
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                placeholder="(555) 555-5555"
              />
            </div>
          </div>

          {/* Company */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Company Name</label>
              <input
                {...register("company_name")}
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                placeholder="Company name"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Preferred Contact</label>
              <select
                {...register("preferred_contact")}
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
              >
                <option value="sms">SMS</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Address</label>
              <input
                {...register("address_line1")}
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                placeholder="Street address"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <input
                {...register("city")}
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                placeholder="City"
              />
              <input
                {...register("state")}
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                placeholder="Province"
              />
              <input
                {...register("zip")}
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium"
                placeholder="Postal code"
              />
            </div>
          </div>

          {/* Fleet toggle */}
          <div className="flex items-center gap-3">
            <input
              {...register("is_fleet")}
              type="checkbox"
              id="is_fleet"
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20"
            />
            <label htmlFor="is_fleet" className="text-sm font-medium text-on-surface">
              Fleet / Business Account
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Notes</label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium resize-none"
              placeholder="Internal notes about this customer..."
            />
          </div>
        </form>

        {/* Footer */}
        <footer className="p-6 bg-surface-container-low flex items-center justify-end gap-4">
          <button
            className="px-6 py-2.5 text-on-primary-fixed-variant font-bold text-sm hover:underline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-all"
          >
            {isEdit ? "Save Changes" : "Create Customer"}
          </button>
        </footer>
      </div>
    </div>
  )
}
