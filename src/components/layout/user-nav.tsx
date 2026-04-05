"use client"

import { useState, useRef, useEffect } from "react"
import { User, Settings, LogOut } from "lucide-react"
import { signOut } from "@/app/(auth)/actions"

interface UserNavProps {
  userName: string
}

export function UserNav({ userName }: UserNavProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 p-1 pl-3 bg-slate-50 rounded-full border border-slate-100 hover:bg-slate-100 transition-all"
      >
        <span className="text-xs font-semibold text-slate-600">
          {userName}
        </span>
        <div className="w-7 h-7 rounded-full bg-primary-fixed flex items-center justify-center">
          <span className="text-[10px] font-bold text-primary">{initials}</span>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest rounded-lg shadow-ambient border border-slate-100 py-1 z-50">
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <User className="h-4 w-4 text-on-surface-variant" />
            Profile
          </button>
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <Settings className="h-4 w-4 text-on-surface-variant" />
            Settings
          </button>
          <div className="border-t border-slate-100 my-1" />
          <form action={signOut}>
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-error-container/30 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
