"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { X, Zap, CheckCircle, AlertCircle, Camera, Loader2 } from "lucide-react"
import { type VehicleInput } from "@/lib/validators"
import type { Vehicle } from "@/types"

interface VehicleFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customerId: string
  vehicle?: Vehicle
}

interface DecodedVehicle {
  year: number | null
  make: string
  model: string
  trim: string
  bodyClass: string
  engineCylinders: string
  engineDisplacement: string
  fuelType: string
  transmissionStyle: string
  driveType: string
  doors: number | null
}

export function VehicleForm({ open, onOpenChange, customerId, vehicle }: VehicleFormProps) {
  const isEdit = !!vehicle
  const [vin, setVin] = useState(vehicle?.vin ?? "")
  const [decoding, setDecoding] = useState(false)
  const [decoded, setDecoded] = useState<DecodedVehicle | null>(null)
  const [decodeError, setDecodeError] = useState<string | null>(null)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<VehicleInput>({
    defaultValues: vehicle
      ? {
          customer_id: vehicle.customer_id,
          vin: vehicle.vin ?? "",
          year: vehicle.year ?? undefined,
          make: vehicle.make ?? "",
          model: vehicle.model ?? "",
          sub_model: vehicle.sub_model ?? "",
          engine: vehicle.engine ?? "",
          color: vehicle.color ?? "",
          license_plate: vehicle.license_plate ?? "",
        }
      : {
          customer_id: customerId,
        },
  })

  if (!open) return null

  const handleDecode = async () => {
    if (vin.length !== 17) return
    setDecoding(true)
    setDecodeError(null)
    setDecoded(null)

    try {
      const res = await fetch(`/api/vin-decode?vin=${encodeURIComponent(vin)}`)
      const data = await res.json()

      if (data.success) {
        setDecoded(data.data)
        // Auto-populate form
        if (data.data.year) setValue("year", data.data.year)
        if (data.data.make) setValue("make", data.data.make)
        if (data.data.model) setValue("model", data.data.model)
        if (data.data.trim) setValue("sub_model", data.data.trim)
        if (data.data.engineDisplacement || data.data.engineCylinders) {
          const engine = [data.data.engineDisplacement, data.data.engineCylinders ? `V${data.data.engineCylinders}` : ""]
            .filter(Boolean).join(" ")
          setValue("engine", engine)
        }
        if (data.data.fuelType) setValue("fuel_type", data.data.fuelType)
        if (data.data.transmissionStyle) setValue("transmission", data.data.transmissionStyle)
        if (data.data.driveType) setValue("drivetrain", data.data.driveType)
        if (data.data.bodyClass) setValue("body_style", data.data.bodyClass)
        if (data.data.doors) setValue("doors", data.data.doors)
        setValue("vin", vin)
      } else {
        setDecodeError(data.error || "Failed to decode VIN")
      }
    } catch {
      setDecodeError("Network error. Please try again.")
    } finally {
      setDecoding(false)
    }
  }

  const onSubmit = (data: VehicleInput) => {
    console.log("Vehicle data:", data)
    onOpenChange(false)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/20 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-[650px] rounded-xl shadow-[0px_20px_40px_rgba(11,28,48,0.06)] flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/15">
          <h2 className="text-xl font-bold tracking-tight text-on-surface">
            {isEdit ? "Edit Vehicle" : "Add Vehicle"}
          </h2>
          <button
            className="p-2 hover:bg-surface-container-low rounded-full transition-colors text-on-surface-variant"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </header>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* VIN Entry */}
          <section className="space-y-3">
            <label className="block text-sm font-semibold uppercase tracking-wider text-on-surface-variant">
              Vehicle Identification Number (VIN)
            </label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  className="w-full bg-surface-container-highest px-4 py-3 rounded-lg border-b-2 border-primary focus:ring-0 text-on-surface font-mono tracking-widest uppercase"
                  placeholder="Enter 17-digit VIN"
                  type="text"
                  maxLength={17}
                  value={vin}
                  onChange={(e) => {
                    const v = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "")
                    setVin(v)
                    setValue("vin", v)
                  }}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary bg-primary-fixed px-1.5 py-0.5 rounded">
                  {vin.length}/17
                </span>
              </div>
              <button
                onClick={handleDecode}
                disabled={vin.length !== 17 || decoding}
                className="px-6 py-3 bg-primary text-white font-bold rounded-lg flex items-center gap-2 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {decoding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Zap className="h-4 w-4" />
                )}
                Decode VIN
              </button>
            </div>

            {/* Decode result */}
            {decoded && (
              <div className="flex items-center gap-2 text-tertiary text-xs font-semibold py-2 px-3 bg-tertiary-container/10 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                VIN Decoded Successfully: {decoded.year} {decoded.make} {decoded.model} {decoded.trim}
              </div>
            )}
            {decodeError && (
              <div className="flex items-center gap-2 text-error text-xs font-semibold py-2 px-3 bg-error-container/20 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                {decodeError}
              </div>
            )}
          </section>

          {/* Auto-populated specs */}
          {decoded && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Technical Specifications</h3>
                <span className="text-[10px] font-bold text-primary bg-primary-fixed px-2 py-0.5 rounded-full">AUTO-POPULATED</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <label className="block text-[10px] font-semibold text-outline mb-1 uppercase">Year</label>
                  <p className="text-sm font-bold text-on-surface">{decoded.year || "—"}</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <label className="block text-[10px] font-semibold text-outline mb-1 uppercase">Make</label>
                  <p className="text-sm font-bold text-on-surface">{decoded.make || "—"}</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <label className="block text-[10px] font-semibold text-outline mb-1 uppercase">Model</label>
                  <p className="text-sm font-bold text-on-surface">{decoded.model || "—"}</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg">
                  <label className="block text-[10px] font-semibold text-outline mb-1 uppercase">Trim</label>
                  <p className="text-sm font-bold text-on-surface">{decoded.trim || "—"}</p>
                </div>
                <div className="bg-surface-container-low p-3 rounded-lg col-span-2">
                  <label className="block text-[10px] font-semibold text-outline mb-1 uppercase">Engine</label>
                  <p className="text-sm font-bold text-on-surface">
                    {[decoded.engineDisplacement, decoded.engineCylinders ? `V${decoded.engineCylinders}` : "", decoded.fuelType].filter(Boolean).join(" ") || "—"}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Manual fields (shown when no decode, or always for extra fields) */}
          {!decoded && (
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Vehicle Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Year</label>
                  <input
                    {...register("year", { valueAsNumber: true })}
                    type="number"
                    className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Make</label>
                  <input
                    {...register("make")}
                    className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                    placeholder="Ford"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Model</label>
                  <input
                    {...register("model")}
                    className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                    placeholder="F-150"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Manual Entry: Plate, Color, Mileage */}
          <section className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">License Plate</label>
              <input
                {...register("license_plate")}
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                placeholder="ABC-1234"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Exterior Color</label>
              <input
                {...register("color")}
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                placeholder="Magnetic Metallic"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Current Mileage</label>
              <input
                {...register("mileage", { valueAsNumber: true })}
                type="number"
                className="w-full bg-surface-container-highest px-4 py-2.5 rounded border-none focus:ring-2 focus:ring-primary/20 text-sm font-bold"
                placeholder="42,500"
              />
            </div>
          </section>

          {/* Photo Upload */}
          <section className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Vehicle Photos</label>
            <div className="border-2 border-dashed border-outline-variant/50 rounded-xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center">
                <Camera className="h-5 w-5 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-on-surface">Click to upload vehicle images</p>
                <p className="text-xs text-on-surface-variant mt-1">PNG, JPG or HEIC up to 10MB</p>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="p-6 bg-surface-container-low flex items-center justify-end gap-4">
          <button
            className="px-6 py-2.5 text-on-primary-fixed-variant font-bold text-sm hover:underline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit(onSubmit)}
            className="px-8 py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-lg font-bold text-sm shadow-sm active:scale-95 transition-all"
          >
            {isEdit ? "Save Changes" : "Save Vehicle"}
          </button>
        </footer>
      </div>
    </div>
  )
}
