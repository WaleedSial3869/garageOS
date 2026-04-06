export interface VINDecodeResult {
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

export async function decodeVIN(vin: string): Promise<VINDecodeResult> {
  const res = await fetch(
    `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`
  )

  if (!res.ok) {
    throw new Error("Failed to contact NHTSA API")
  }

  const data = await res.json()
  const result = data.Results?.[0]

  if (!result || result.ErrorCode !== "0") {
    throw new Error(result?.ErrorText || "VIN decode failed")
  }

  return {
    year: result.ModelYear ? parseInt(result.ModelYear) : null,
    make: result.Make || "",
    model: result.Model || "",
    trim: result.Trim || "",
    bodyClass: result.BodyClass || "",
    engineCylinders: result.EngineCylinders || "",
    engineDisplacement: result.DisplacementL ? `${result.DisplacementL}L` : "",
    fuelType: result.FuelTypePrimary || "",
    transmissionStyle: result.TransmissionStyle || "",
    driveType: result.DriveType || "",
    doors: result.Doors ? parseInt(result.Doors) : null,
  }
}
