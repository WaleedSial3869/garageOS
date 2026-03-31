import type { Metadata } from "next"
import "./globals.css"
import { QueryProvider } from "@/providers/query-provider"
import { Toaster } from "@/components/ui/toast"

export const metadata: Metadata = {
  title: "GarageOS — Auto Repair Shop Management",
  description: "Complete auto repair shop management system",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased min-h-screen font-sans">
        <QueryProvider>
          {children}
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  )
}
