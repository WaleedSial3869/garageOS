import {
  DollarSign,
  Wrench,
  ClipboardList,
  CalendarDays,
  Wallet,
  AlertTriangle,
  TrendingUp,
  History,
  Plus,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-1">
            Dashboard
          </h1>
          <p className="text-on-surface-variant font-medium">
            Welcome back to your shop control center.
          </p>
        </div>
        <div className="flex items-center bg-surface-container-low p-1 rounded-lg">
          <button className="px-4 py-2 text-sm font-semibold rounded-md bg-white shadow-sm text-primary">
            Today
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-md text-on-surface-variant hover:text-on-surface transition-colors">
            This Week
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-md text-on-surface-variant hover:text-on-surface transition-colors">
            This Month
          </button>
          <button className="px-4 py-2 text-sm font-medium rounded-md text-on-surface-variant hover:text-on-surface transition-colors">
            Quarterly
          </button>
        </div>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="tonal-card p-6 rounded-xl border border-transparent shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-blue-50 text-primary rounded-lg">
              <DollarSign className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-tertiary px-2 py-1 bg-tertiary-container/10 rounded-full">
              +12%
            </span>
          </div>
          <span className="text-sm font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
            Today&apos;s Revenue
          </span>
          <span className="text-2xl font-extrabold text-on-surface">
            $2,847.50
          </span>
        </div>

        <div className="tonal-card p-6 rounded-xl border border-transparent shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-blue-50 text-primary rounded-lg">
              <Wrench className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-blue-600 px-2 py-1 bg-primary-fixed/50 rounded-full">
              Steady
            </span>
          </div>
          <span className="text-sm font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
            Open Repair Orders
          </span>
          <span className="text-2xl font-extrabold text-on-surface">
            8 Orders
          </span>
        </div>

        <div className="tonal-card p-6 rounded-xl border border-transparent shadow-sm flex flex-col border-l-4 border-error/30">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-error-container text-error rounded-lg">
              <ClipboardList className="h-5 w-5" />
            </span>
            <span className="text-xs font-bold text-error px-2 py-1 bg-error-container/50 rounded-full">
              Urgent
            </span>
          </div>
          <span className="text-sm font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
            Pending Estimates
          </span>
          <span className="text-2xl font-extrabold text-on-surface">
            4 Needs Attention
          </span>
        </div>

        <div className="tonal-card p-6 rounded-xl border border-transparent shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <span className="p-2 bg-blue-50 text-primary rounded-lg">
              <CalendarDays className="h-5 w-5" />
            </span>
          </div>
          <span className="text-sm font-semibold text-on-surface-variant mb-1 uppercase tracking-wider">
            Appointments Today
          </span>
          <span className="text-2xl font-extrabold text-on-surface">
            3 Scheduled
          </span>
        </div>
      </div>

      {/* Second Row: Aging and Unpaid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Customer Aging */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-transparent">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Customer Aging
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-on-surface-variant uppercase tracking-widest border-b border-slate-100">
                  <th className="pb-3">Bracket</th>
                  <th className="pb-3 text-right">Amount</th>
                  <th className="pb-3 text-right">Count</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-slate-50/50">
                  <td className="py-4 font-semibold">0-30 Days</td>
                  <td className="py-4 text-right font-medium">$12,450.00</td>
                  <td className="py-4 text-right">14</td>
                </tr>
                <tr className="border-b border-slate-50/50">
                  <td className="py-4 font-semibold text-primary">
                    31-60 Days
                  </td>
                  <td className="py-4 text-right font-medium">$4,120.00</td>
                  <td className="py-4 text-right">5</td>
                </tr>
                <tr className="border-b border-slate-50/50">
                  <td className="py-4 font-semibold text-secondary">
                    61-90 Days
                  </td>
                  <td className="py-4 text-right font-medium">$1,200.00</td>
                  <td className="py-4 text-right">2</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-error">90+ Days</td>
                  <td className="py-4 text-right font-medium">$850.00</td>
                  <td className="py-4 text-right">1</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Largest Unpaid Invoices */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-transparent">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Largest Unpaid Invoices
            </div>
            <button className="text-xs font-bold text-primary hover:underline">
              View All
            </button>
          </h2>
          <div className="space-y-4">
            {[
              { initials: "RJ", name: "Robert Jenkins", order: "#RO-4492", vehicle: "2021 Ford F-150 Lariat", amount: "$1,482.12", days: "42 Days Late", color: "bg-primary-fixed text-primary", daysColor: "text-error" },
              { initials: "ST", name: "Sarah Thompson", order: "#RO-4501", vehicle: "2019 Honda CR-V", amount: "$945.00", days: "28 Days Late", color: "bg-secondary-fixed text-secondary", daysColor: "text-secondary" },
              { initials: "MB", name: "Marcus Brown", order: "#RO-4512", vehicle: "2022 Tesla Model 3", amount: "$2,105.44", days: "12 Days Late", color: "bg-surface-dim text-on-surface", daysColor: "text-primary" },
            ].map((item) => (
              <div
                key={item.order}
                className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low/50 hover:bg-surface-container-low transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center font-bold text-xs`}
                  >
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-on-surface">
                      {item.order} &bull; {item.name}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {item.vehicle}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-on-surface">
                    {item.amount}
                  </p>
                  <p
                    className={`text-[10px] font-bold ${item.daysColor} uppercase`}
                  >
                    {item.days}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Third Row: Schedule and Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Today&apos;s Schedule
          </h2>
          <div className="relative pl-12 space-y-8 before:content-[''] before:absolute before:left-[1.35rem] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {[
              { time: "09:00 AM — Drop-off", title: "BMW X5 Oil Service & Brakes", customer: "Michael Scott", bay: "Bay 1", dotColor: "bg-primary", timeColor: "text-primary", bayBg: "bg-surface-container-high" },
              { time: "11:30 AM — Diagnostics", title: "Toyota RAV4 Check Engine Light", customer: "Jim Halpert", bay: "Bay 3", dotColor: "bg-slate-200", timeColor: "text-on-surface-variant", bayBg: "bg-surface-container-high" },
              { time: "02:00 PM — Pickup", title: "Jeep Wrangler Suspension Lift", customer: "Pam Beesly", bay: "Bay 2", dotColor: "bg-slate-200", timeColor: "text-on-surface-variant", bayBg: "bg-tertiary-container text-white" },
            ].map((appt, i) => (
              <div key={i} className="relative">
                <div
                  className={`absolute -left-[2.1rem] top-1 w-6 h-6 rounded-full border-4 border-white ${appt.dotColor} shadow-sm z-10`}
                />
                <div className="flex items-center justify-between">
                  <div>
                    <span
                      className={`text-xs font-bold ${appt.timeColor} uppercase tracking-tighter`}
                    >
                      {appt.time}
                    </span>
                    <h3 className="text-sm font-bold">{appt.title}</h3>
                    <p className="text-xs text-on-surface-variant">
                      Customer: {appt.customer}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 ${appt.bayBg} rounded text-[10px] font-bold`}
                  >
                    {appt.bay}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow Summary */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Workflow Summary
          </h2>
          <div className="space-y-6">
            {[
              { label: "Diagnostics", units: 3, pct: 35, color: "bg-primary" },
              { label: "Parts Ordered", units: 5, pct: 60, color: "bg-secondary" },
              { label: "In-Service", units: 8, pct: 85, color: "bg-tertiary" },
              { label: "Final QC", units: 2, pct: 20, color: "bg-surface-tint" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span className="text-on-surface-variant uppercase">
                    {item.label}
                  </span>
                  <span>{item.units} Units</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Revenue and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue This Week */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Revenue This Week
          </h2>
          <div className="h-64 flex items-end gap-3 px-2">
            {[
              { value: "$2.1k", pct: 40, active: false },
              { value: "$3.4k", pct: 65, active: false },
              { value: "$2.8k", pct: 50, active: false },
              { value: "$4.2k", pct: 85, active: true },
              { value: "", pct: 0, active: false },
              { value: "", pct: 0, active: false },
              { value: "", pct: 0, active: false },
            ].map((bar, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-lg relative group transition-all ${
                  bar.active
                    ? "bg-primary"
                    : bar.pct > 0
                      ? "bg-surface-container-low hover:bg-primary/20"
                      : "bg-slate-50 opacity-20"
                }`}
                style={{ height: `${bar.pct}%` }}
              >
                {bar.value && (
                  <span
                    className={`absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold ${
                      bar.active
                        ? ""
                        : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {bar.value}
                  </span>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span className="text-primary font-extrabold">Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            Recent Activity
          </h2>
          <div className="space-y-6">
            {[
              { dot: "bg-tertiary", label: "Check-in:", text: "Tesla Model S for Rear Brake Pad Replacement", meta: "12 minutes ago by Sarah (Advisor)" },
              { dot: "bg-secondary", label: "Estimate Approved:", text: "RO-4498 ($1,120.00)", meta: "45 minutes ago via SMS" },
              { dot: "bg-primary", label: "Part Received:", text: "Fuel Injector for RO-4482", meta: "1.5 hours ago (Inv #9982)" },
              { dot: "bg-error", label: "Missed Appointment:", text: "David Miller (9:00 AM)", meta: "3 hours ago • Follow-up required" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className={`w-2 h-2 mt-2 rounded-full ${item.dot}`}
                />
                <div>
                  <p className="text-sm font-medium text-on-surface">
                    <span className="font-bold">{item.label}</span>{" "}
                    {item.text}
                  </p>
                  <p className="text-xs text-on-surface-variant">
                    {item.meta}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link
        href="/orders/new"
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-primary to-primary-container text-white rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-50"
      >
        <Plus className="h-6 w-6" strokeWidth={2.5} />
      </Link>
    </>
  )
}
