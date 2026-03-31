"use client"

import { createContext, useContext, useState, useCallback } from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "success" | "error"
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, "id">) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    return {
      toast: (_props: Omit<Toast, "id">) => {},
      toasts: [] as Toast[],
    }
  }
  return {
    toast: context.addToast,
    toasts: context.toasts,
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...toast, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function Toaster() {
  return (
    <ToastProvider>
      <ToasterInner />
    </ToastProvider>
  )
}

function ToasterInner() {
  const { toasts } = useContext(ToastContext) || { toasts: [] }
  const context = useContext(ToastContext)

  if (!toasts.length) return null

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "bg-surface-container-lowest rounded-lg shadow-ambient border border-slate-100 p-4 flex items-start gap-3 animate-in slide-in-from-right",
            toast.variant === "error" && "border-error/20",
            toast.variant === "success" && "border-tertiary/20"
          )}
        >
          <div className="flex-1">
            <p className="text-sm font-semibold text-on-surface">
              {toast.title}
            </p>
            {toast.description && (
              <p className="text-xs text-on-surface-variant mt-1">
                {toast.description}
              </p>
            )}
          </div>
          <button
            onClick={() => context?.removeToast(toast.id)}
            className="text-on-surface-variant hover:text-on-surface"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
