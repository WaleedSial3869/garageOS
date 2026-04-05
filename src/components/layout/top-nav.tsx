"use client"

import { Bell, Search, User } from "lucide-react"
import { UserNav } from "./user-nav"

interface TopNavProps {
  userName?: string
}

export function TopNav({ userName = "User" }: TopNavProps) {
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <header className="w-full sticky top-0 z-50 glass-nav shadow-sm flex justify-between items-center px-6 h-16 tracking-tight">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tighter text-blue-600">
          GarageOS
        </span>
        <div className="hidden md:flex items-center bg-slate-50 rounded-lg px-3 py-1.5 border border-transparent focus-within:border-primary/20 transition-all">
          <Search className="text-slate-400 h-4 w-4" />
          <input
            className="bg-transparent border-none focus:ring-0 focus:outline-none text-sm w-64 placeholder:text-slate-400 ml-2"
            placeholder="Search repair orders, customers..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-on-surface-variant font-medium text-sm hidden sm:block">
          {greeting}, {userName}!
        </span>
        <div className="flex items-center gap-3">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white" />
          </button>
          <UserNav userName={userName} />
        </div>
      </div>
    </header>
  )
}
