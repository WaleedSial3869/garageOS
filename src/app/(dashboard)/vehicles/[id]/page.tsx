"use client"

import { useParams, useRouter } from "next/navigation"
import {
  ChevronRight, Car, User, Wrench, Gauge, Fuel, Settings2,
  Cog, Calendar,
} from "lucide-react"
import { formatVehicleName, formatDate, formatCurrency } from "@/lib/formatters"
import { getDemoVehicle, getDemoCustomer, demoOrders } from "@/lib/demo-data"
import { cn } from "@/lib/utils"

export default function VehicleDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const vehicle = getDemoVehicle(id)
  const customer = vehicle ? getDemoCustomer(vehicle.customer_id) : null
  const orders = demoOrders.filter((o) => o.vehicle_id === id)

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold text-on-surface mb-2">Vehicle not found</h2>
        <p className="text-sm text-on-surface-variant mb-4">This vehicle doesn&apos;t exist or has been deleted.</p>
        <button
          onClick={() => router.back()}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Go Back
        </button>
      </div>
    )
  }

  const vehicleName = formatVehicleName(vehicle)

  const specs = [
    { label: "Year", value: vehicle.year, icon: Calendar },
    { label: "Make", value: vehicle.make, icon: Car },
    { label: "Model", value: vehicle.model, icon: Car },
    { label: "Trim", value: vehicle.sub_model, icon: Settings2 },
    { label: "Engine", value: vehicle.engine, icon: Cog },
    { label: "Transmission", value: vehicle.transmission, icon: Cog },
    { label: "Drivetrain", value: vehicle.drivetrain, icon: Settings2 },
    { label: "Fuel Type", value: vehicle.fuel_type, icon: Fuel },
    { label: "Color", value: vehicle.color, icon: Car },
    { label: "Doors", value: vehicle.doors, icon: Car },
  ].filter((s) => s.value)

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-6">
        <button onClick={() => router.push("/customers")} className="hover:text-primary transition-colors">
          Customers
        </button>
        <ChevronRight className="h-3 w-3" />
        {customer && (
          <>
            <button
              onClick={() => router.push(`/customers/${customer.id}`)}
              className="hover:text-primary transition-colors"
            >
              {customer.company_name || `${customer.first_name} ${customer.last_name}`}
            </button>
            <ChevronRight className="h-3 w-3" />
          </>
        )}
        <span className="text-on-surface font-semibold">{vehicleName}</span>
      </nav>

      {/* Vehicle Header */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm mb-8 ring-1 ring-outline-variant/10">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
            <Car className="h-10 w-10" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-1">{vehicleName}</h1>
            {vehicle.vin && (
              <p className="text-sm font-mono text-on-surface-variant tracking-wider mb-2">
                VIN: {vehicle.vin.slice(0, -6)}<span className="font-bold text-on-surface">{vehicle.vin.slice(-6)}</span>
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-on-surface-variant">
              {vehicle.license_plate && (
                <span className="px-3 py-1 bg-surface-container-low rounded-lg font-bold text-xs">
                  {vehicle.license_plate}
                </span>
              )}
              {customer && (
                <button
                  onClick={() => router.push(`/customers/${customer.id}`)}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  <User className="h-4 w-4" />
                  {customer.company_name || `${customer.first_name} ${customer.last_name}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Specs */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-on-surface mb-4">Specifications</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {specs.map((spec) => (
                <div key={spec.label} className="bg-surface-container-lowest p-4 rounded-xl ring-1 ring-outline-variant/10">
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider mb-1">{spec.label}</p>
                  <p className="text-sm font-bold text-on-surface">{String(spec.value)}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Service History */}
          <section>
            <h2 className="text-lg font-bold text-on-surface mb-4">Service History</h2>
            <div className="bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm ring-1 ring-outline-variant/10">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low/50">
                  <tr className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                    <th className="px-6 py-4">Order #</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Services</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-sm text-on-surface-variant">
                        No service history yet
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id} className="hover:bg-surface-container-low transition-colors cursor-pointer">
                        <td className="px-6 py-4 text-sm font-bold text-primary">
                          #WO-{order.order_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(order.created_at)}</td>
                        <td className="px-6 py-4 text-sm text-on-surface">{order.services_summary}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded-full uppercase">
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-right">{formatCurrency(order.grand_total)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          {/* Quick Info */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm ring-1 ring-outline-variant/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
              <Gauge className="h-4 w-4" /> Vehicle Info
            </h3>
            <div className="space-y-4">
              {vehicle.license_plate && (
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase mb-1">License Plate</p>
                  <p className="text-sm font-bold text-on-surface">{vehicle.license_plate} ({vehicle.license_state})</p>
                </div>
              )}
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase mb-1">Added</p>
                <p className="text-sm font-semibold text-on-surface">{formatDate(vehicle.created_at)}</p>
              </div>
              {vehicle.production_date && (
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase mb-1">Production Date</p>
                  <p className="text-sm font-semibold text-on-surface">{formatDate(vehicle.production_date)}</p>
                </div>
              )}
              {vehicle.notes && (
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase mb-1">Notes</p>
                  <p className="text-xs text-on-surface leading-relaxed">{vehicle.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
