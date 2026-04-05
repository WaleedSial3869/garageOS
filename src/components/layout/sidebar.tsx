"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Workflow,
  Calendar,
  Clock,
  Users,
  UserCog,
  Package,
  BarChart3,
  Megaphone,
  Mail,
  Settings,
  type LucideIcon,
} from "lucide-react"

interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Workflow", href: "/workflow", icon: Workflow },
  { label: "Calendar", href: "/calendar", icon: Calendar },
  { label: "Time Clock", href: "/time-clock", icon: Clock },
  { label: "Customers", href: "/customers", icon: Users },
  { label: "Team", href: "/team", icon: UserCog },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Reporting", href: "/reports", icon: BarChart3 },
  { label: "Marketing", href: "/marketing", icon: Megaphone },
  { label: "Messages", href: "/messages", icon: Mail },
  { label: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex flex-col pt-16 h-screen w-16 hover:w-60 transition-all duration-300 ease-in-out overflow-hidden border-r border-slate-100 bg-white text-sm font-medium">
      <nav className="mt-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href)

          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 group transition-all duration-300 ${
                isActive
                  ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <Icon className="min-w-[32px] h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.label}
              </span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
