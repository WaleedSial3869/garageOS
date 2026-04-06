"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  DollarSign, Users, TrendingUp, AlertTriangle, Search,
  Filter, ArrowUpDown, Upload, Download, UserPlus, MoreVertical,
  Car,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { formatCurrency, formatPhone, formatDate } from "@/lib/formatters"
import { getDemoCustomersWithStats, type CustomerWithStats } from "@/lib/demo-data"
import { useDebounce } from "@/hooks/use-debounce"
import { CustomerForm } from "@/components/customers/customer-form"
import { TagBadge } from "@/components/shared/tag-badge"

type FilterTab = "all" | "active" | "inactive"

export default function CustomersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<FilterTab>("all")
  const [showNewCustomer, setShowNewCustomer] = useState(false)
  const debouncedSearch = useDebounce(searchQuery)

  const allCustomers = getDemoCustomersWithStats()

  const filtered = useMemo(() => {
    let result = allCustomers

    // Filter by tab
    if (activeTab === "active") {
      result = result.filter((c) => {
        if (!c.last_visit) return false
        const daysSince = (Date.now() - new Date(c.last_visit).getTime()) / (1000 * 60 * 60 * 24)
        return daysSince <= 90
      })
    } else if (activeTab === "inactive") {
      result = result.filter((c) => {
        if (!c.last_visit) return true
        const daysSince = (Date.now() - new Date(c.last_visit).getTime()) / (1000 * 60 * 60 * 24)
        return daysSince > 90
      })
    }

    // Search
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (c) =>
          c.first_name.toLowerCase().includes(q) ||
          c.last_name.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.includes(q) ||
          c.company_name?.toLowerCase().includes(q)
      )
    }

    return result
  }, [allCustomers, activeTab, debouncedSearch])

  // Stats
  const totalCustomers = allCustomers.length
  const activeCount = allCustomers.filter((c) => {
    if (!c.last_visit) return false
    const daysSince = (Date.now() - new Date(c.last_visit).getTime()) / (1000 * 60 * 60 * 24)
    return daysSince <= 90
  }).length
  const avgTicket = allCustomers.length > 0
    ? allCustomers.reduce((sum, c) => sum + c.total_spent, 0) / allCustomers.filter(c => c.total_spent > 0).length
    : 0
  const outstandingAR = allCustomers.reduce((sum, c) => sum + c.balance_due, 0)
  const outstandingCount = allCustomers.filter((c) => c.balance_due > 0).length

  return (
    <>
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2">Customers</h1>
          <nav className="flex gap-2 text-sm text-on-surface-variant font-medium">
            <span className="hover:text-primary cursor-pointer">CRM</span>
            <span>/</span>
            <span className="text-primary">Database</span>
          </nav>
        </div>
        <button
          onClick={() => setShowNewCustomer(true)}
          className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 shadow-md active:scale-95 transition-transform"
        >
          <UserPlus className="h-5 w-5" />
          New Customer
        </button>
      </div>

      {/* Bento Stats Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-surface-container-lowest p-6 rounded-xl border-b-2 border-transparent hover:border-primary transition-all duration-300">
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Total Customers</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">{totalCustomers}</span>
            <span className="text-tertiary text-xs font-bold">+12%</span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border-b-2 border-transparent hover:border-primary transition-all duration-300">
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Active</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">{activeCount}</span>
            <span className="bg-tertiary-container/20 text-tertiary px-2 py-0.5 rounded-full text-[10px] font-bold">
              {totalCustomers > 0 ? Math.round((activeCount / totalCustomers) * 100) : 0}% LTM
            </span>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border-b-2 border-transparent hover:border-primary transition-all duration-300">
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Average Ticket</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">{formatCurrency(avgTicket)}</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
        </div>
        <div className="bg-surface-container-lowest p-6 rounded-xl border-b-2 border-transparent hover:border-primary transition-all duration-300">
          <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Outstanding AR</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-error">{formatCurrency(outstandingAR)}</span>
            <span className="text-on-surface-variant text-xs font-medium">{outstandingCount} clients</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-surface-container-low rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant group-focus-within:text-primary transition-colors" />
            <input
              className="pl-10 pr-4 py-2 bg-surface-container-lowest border-none rounded-lg text-sm w-72 focus:ring-2 focus:ring-primary/20 placeholder:text-slate-400"
              placeholder="Search customers..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center bg-surface-container-lowest rounded-lg p-1">
            {(["all", "active", "inactive"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1 text-sm font-medium rounded-md capitalize",
                  activeTab === tab
                    ? "bg-primary text-on-primary font-semibold"
                    : "text-on-surface-variant hover:text-on-surface"
                )}
              >
                {tab === "all" ? "All" : tab === "active" ? "Active" : "Inactive"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest text-on-surface text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-lowest text-on-surface text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors">
            <ArrowUpDown className="h-4 w-4" />
            Sort: Last Visit
          </button>
        </div>
        <div className="flex gap-2">
          <button className="p-2 bg-surface-container-lowest text-on-surface-variant hover:text-primary rounded-lg transition-colors" title="Export CSV">
            <Download className="h-5 w-5" />
          </button>
          <button className="p-2 bg-surface-container-lowest text-on-surface-variant hover:text-primary rounded-lg transition-colors" title="Import Data">
            <Upload className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main CRM Table */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] font-bold tracking-widest">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4 text-center">Vehicles</th>
              <th className="px-6 py-4">Last Visit</th>
              <th className="px-6 py-4">Value</th>
              <th className="px-6 py-4">Balance</th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-sm text-on-surface-variant">
                  No customers found
                </td>
              </tr>
            ) : (
              filtered.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  onClick={() => router.push(`/customers/${customer.id}`)}
                />
              ))
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t border-slate-100">
          <span className="text-xs font-medium text-on-surface-variant">
            Showing 1 to {filtered.length} of {filtered.length} customers
          </span>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs font-bold text-on-surface-variant hover:bg-slate-100 rounded">Prev</button>
            <button className="px-3 py-1 text-xs font-bold bg-primary text-on-primary rounded">1</button>
            <button className="px-3 py-1 text-xs font-bold text-on-surface-variant hover:bg-slate-100 rounded">Next</button>
          </div>
        </div>
      </div>

      {/* New Customer Modal */}
      {showNewCustomer && (
        <CustomerForm
          open={showNewCustomer}
          onOpenChange={setShowNewCustomer}
        />
      )}
    </>
  )
}

function CustomerRow({
  customer,
  onClick,
}: {
  customer: CustomerWithStats
  onClick: () => void
}) {
  const initials = `${customer.first_name.charAt(0)}${customer.last_name.charAt(0)}`.toUpperCase()

  return (
    <tr
      className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
      onClick={onClick}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-on-surface-variant font-bold text-sm uppercase">
            {initials}
          </div>
          <div>
            <div className="font-bold text-on-surface">
              {customer.company_name || `${customer.first_name} ${customer.last_name}`}
            </div>
            <div className="text-xs text-on-surface-variant">ID: #CUST-{customer.id.slice(-4)}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-on-surface">{customer.email || "—"}</div>
        <div className="text-xs text-on-surface-variant">
          {customer.phone ? formatPhone(customer.phone) : "—"}
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded-full">
          <Car className="h-4 w-4 text-primary" />
          <span className="text-xs font-bold text-on-primary-fixed-variant">{customer.vehicle_count}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        {customer.last_visit ? (
          <>
            <div className="text-sm text-on-surface">{formatDate(customer.last_visit)}</div>
            <div className={cn(
              "text-[10px] font-bold",
              customer.last_visit_status === "COMPLETED" && "text-tertiary",
              customer.last_visit_status === "IN SERVICE" && "text-primary",
              !customer.last_visit_status && "text-slate-400",
            )}>
              {customer.last_visit_status || "IDLE"}
            </div>
          </>
        ) : (
          <span className="text-sm text-on-surface-variant">—</span>
        )}
      </td>
      <td className="px-6 py-4">
        <div className="text-sm font-bold text-on-surface">{formatCurrency(customer.total_spent)}</div>
      </td>
      <td className="px-6 py-4">
        <span className={cn(
          "text-sm font-medium",
          customer.balance_due > 0 ? "font-bold text-error" : "text-on-surface-variant"
        )}>
          {formatCurrency(customer.balance_due)}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex gap-1.5">
          {customer.tags.map((tag) => (
            <TagBadge
              key={tag}
              label={tag}
              variant={
                tag === "VIP" ? "secondary"
                  : tag === "Fleet" || tag === "Corp" ? "primary"
                  : tag === "New" ? "tertiary"
                  : "default"
              }
            />
          ))}
        </div>
      </td>
      <td className="px-6 py-4 text-right">
        <button
          className="p-1 hover:bg-slate-200 rounded-full transition-colors opacity-0 group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </td>
    </tr>
  )
}
