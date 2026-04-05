export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tighter text-primary">
            GarageOS
          </h1>
          <p className="text-on-surface-variant text-sm mt-1">
            Auto Repair Shop Management
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}
