"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { use } from "react"
import {
  Mail, Phone, MapPin, MessageSquare, Pencil, MoreVertical,
  Car, ChevronRight, BarChart3, CalendarClock, StickyNote,
  Send, Info, PlusCircle, ArrowLeft,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency, formatDate, formatVin, formatVehicleName, formatPhone, formatAddress, formatInitials } from "@/lib/formatters"
import {
  getDemoCustomer,
  getDemoVehiclesForCustomer,
  getDemoOrdersForCustomer,
  demoCustomerStats,
} from "@/lib/demo-data"
import { TagBadge } from "@/components/shared/tag-badge"
import { EmptyState } from "@/components/shared/empty-state"
import { CustomerForm } from "@/components/customers/customer-form"
import { VehicleForm } from "@/components/vehicles/vehicle-form"

type Tab = "overview" | "vehicles" | "orders" | "invoices" | "payments" | "messages" | "notes"

const tabs: { key: Tab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "vehicles", label: "Vehicles" },
  { key: "orders", label: "Orders" },
  { key: "invoices", label: "Invoices" },
  { key: "payments", label: "Payments" },
  { key: "messages", label: "Messages" },
  { key: "notes", label: "Notes" },
]

export default function CustomerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [showEditCustomer, setShowEditCustomer] = useState(false)
  const [showAddVehicle, setShowAddVehicle] = useState(false)

  const customer = getDemoCustomer(id)
  const vehicles = getDemoVehiclesForCustomer(id)
  const orders = getDemoOrdersForCustomer(id)
  const stats = demoCustomerStats[id]

  if (!customer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-xl font-bold text-on-surface mb-2">Customer not found</h2>
        <p className="text-sm text-on-surface-variant mb-4">This customer doesn&apos;t exist or has been deleted.</p>
        <button
          onClick={() => router.push("/customers")}
          className="text-sm font-semibold text-primary hover:underline"
        >
          Back to Customers
        </button>
      </div>
    )
  }

  const initials = formatInitials(customer.first_name, customer.last_name)
  const displayName = customer.company_name || `${customer.first_name} ${customer.last_name}`

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium text-on-surface-variant mb-6">
        <button onClick={() => router.push("/customers")} className="hover:text-primary transition-colors">
          Customers
        </button>
        <ChevronRight className="h-3 w-3" />
        <span className="text-on-surface font-semibold">{displayName}</span>
      </nav>

      {/* Customer Header Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm mb-8 ring-1 ring-outline-variant/10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start md:items-center gap-6">
            {/* Avatar */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-primary/20">
              {initials}
            </div>
            {/* Info */}
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">{displayName}</h1>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-on-surface-variant">
                {customer.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" />{customer.email}
                  </span>
                )}
                {customer.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" />{formatPhone(customer.phone)}
                  </span>
                )}
                {customer.address_line1 && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />{formatAddress(customer)}
                  </span>
                )}
              </div>
              {/* Tags */}
              <div className="flex items-center gap-2 pt-2">
                {customer.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-widest rounded-full">
                    {tag}
                  </span>
                ))}
                <button className="px-3 py-1 border border-dashed border-outline-variant text-outline hover:text-primary hover:border-primary text-[10px] font-bold uppercase tracking-widest rounded-full transition-colors flex items-center gap-1">
                  <PlusCircle className="h-3 w-3" />Add
                </button>
              </div>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button className="bg-primary hover:bg-primary-container text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all shadow-md active:scale-95">
              <MessageSquare className="h-4 w-4" /> Message
            </button>
            <button className="bg-surface-container text-on-surface hover:bg-surface-container-high px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95">
              <Mail className="h-4 w-4" /> Email
            </button>
            <button
              onClick={() => setShowEditCustomer(true)}
              className="bg-surface-container text-on-surface hover:bg-surface-container-high px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all active:scale-95"
            >
              <Pencil className="h-4 w-4" /> Edit
            </button>
            <button className="p-2.5 rounded-lg hover:bg-surface-container text-outline transition-colors">
              <MoreVertical className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center border-b border-outline-variant/30 mb-8 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap",
              activeTab === tab.key
                ? "border-b-2 border-primary text-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Vehicles Section */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-bold text-on-surface">Vehicles</h2>
                <button className="text-sm font-semibold text-primary hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                    className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow group ring-1 ring-outline-variant/10 cursor-pointer"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2.5 bg-surface-container-low rounded-xl text-primary">
                        <Car className="h-6 w-6" />
                      </div>
                      <span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded-full">
                        ACTIVE
                      </span>
                    </div>
                    <h3 className="font-bold text-on-surface mb-1">{formatVehicleName(vehicle)}</h3>
                    <p className="text-xs text-on-surface-variant mb-4">
                      VIN: {vehicle.vin ? formatVin(vehicle.vin) : "N/A"}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-outline-variant/10 text-xs">
                      <span className="text-on-surface-variant">Last Service: {formatDate(vehicle.updated_at)}</span>
                      <span className="font-bold text-primary">Details &rarr;</span>
                    </div>
                  </div>
                ))}
                {/* Add Vehicle Card */}
                <button
                  onClick={() => setShowAddVehicle(true)}
                  className="border-2 border-dashed border-outline-variant hover:border-primary hover:bg-blue-50/50 transition-all rounded-2xl p-5 flex flex-col items-center justify-center gap-2 group min-h-[160px]"
                >
                  <PlusCircle className="h-8 w-8 text-outline-variant group-hover:text-primary" />
                  <span className="text-sm font-bold text-on-surface-variant group-hover:text-primary">Add Vehicle</span>
                </button>
              </div>
            </section>

            {/* Recent Orders */}
            <section>
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-lg font-bold text-on-surface">Recent Orders</h2>
                <button className="text-sm font-semibold text-primary hover:underline">New Order</button>
              </div>
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
                          No orders yet
                        </td>
                      </tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id} className="hover:bg-surface-container-low transition-colors cursor-pointer">
                          <td className="px-6 py-4 text-sm font-bold text-primary">
                            #{order.order_type === "repair_order" ? "WO" : "EST"}-{order.order_number}
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

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-8">
            {/* Customer Stats */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm ring-1 ring-outline-variant/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-6 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" /> Customer Stats
              </h3>
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Total Visits</p>
                  <p className="text-xl font-extrabold text-on-surface">{stats?.total_visits ?? 0}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Total Spent</p>
                  <p className="text-xl font-extrabold text-primary">{formatCurrency(stats?.total_spent ?? 0)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Average Ticket</p>
                  <p className="text-lg font-bold text-on-surface">{formatCurrency(stats?.average_ticket ?? 0)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Last Visit</p>
                  <p className="text-lg font-bold text-on-surface">{stats?.last_visit ? formatDate(stats.last_visit) : "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Member Since</p>
                  <p className="text-sm font-semibold text-on-surface">{formatDate(customer.customer_since)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-tighter mb-1">Outstanding</p>
                  <p className={cn("text-sm font-bold", (stats?.outstanding ?? 0) > 0 ? "text-error" : "text-on-surface")}>
                    {formatCurrency(stats?.outstanding ?? 0)}
                  </p>
                </div>
              </div>
            </div>

            {/* Upcoming Card */}
            <div className="bg-surface-container-low rounded-2xl p-6 shadow-sm border border-primary-container/20">
              <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-5 flex items-center gap-2">
                <CalendarClock className="h-4 w-4" /> Upcoming
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white flex flex-col items-center justify-center shrink-0 shadow-sm border border-slate-100">
                    <span className="text-[8px] font-bold text-error uppercase">Nov</span>
                    <span className="text-sm font-extrabold text-on-surface">18</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface leading-tight">Next Appointment</h4>
                    <p className="text-xs text-on-surface-variant">Winterization Service (09:00 AM)</p>
                  </div>
                </div>
                <div className="p-4 bg-white/50 rounded-xl border border-white">
                  <h4 className="text-xs font-bold text-on-surface-variant flex items-center gap-1.5 mb-1">
                    <Info className="h-3 w-3 text-tertiary" /> Recommended
                  </h4>
                  <p className="text-xs text-on-surface font-semibold">Rear Brake Fluid Flush</p>
                  <p className="text-[10px] text-on-surface-variant">Suggested within 500 miles</p>
                </div>
              </div>
            </div>

            {/* Notes Card */}
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm ring-1 ring-outline-variant/10">
              <h3 className="text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-4 flex items-center gap-2">
                <StickyNote className="h-4 w-4" /> Notes
              </h3>
              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 pr-1">
                {customer.notes ? (
                  <div className="space-y-1">
                    <p className="text-xs text-on-surface leading-relaxed">{customer.notes}</p>
                    <p className="text-[9px] font-bold text-outline uppercase tracking-wider">
                      {formatDate(customer.updated_at)} &bull; Admin
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant">No notes yet.</p>
                )}
              </div>
              <div className="relative">
                <input
                  className="w-full text-xs bg-surface-container-low border-none rounded-xl py-3 pl-4 pr-10 focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50"
                  placeholder="Type a note..."
                  type="text"
                />
                <button className="absolute right-2 top-1.5 p-1.5 text-primary hover:bg-white rounded-lg transition-colors">
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab !== "overview" && (
        <EmptyState
          icon={activeTab === "vehicles" ? Car : BarChart3}
          title={`${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} coming soon`}
          description={`The ${activeTab} tab will be available in a future update.`}
        />
      )}

      {/* Modals */}
      {showEditCustomer && (
        <CustomerForm
          open={showEditCustomer}
          onOpenChange={setShowEditCustomer}
          customer={customer}
        />
      )}
      {showAddVehicle && (
        <VehicleForm
          open={showAddVehicle}
          onOpenChange={setShowAddVehicle}
          customerId={id}
        />
      )}
    </div>
  )
}
