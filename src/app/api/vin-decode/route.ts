import { decodeVIN } from "@/lib/api/nhtsa"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const vin = searchParams.get("vin")

  if (!vin || vin.length !== 17) {
    return NextResponse.json(
      { success: false, error: "VIN must be exactly 17 characters" },
      { status: 400 }
    )
  }

  // VIN cannot contain I, O, or Q
  if (/[IOQ]/i.test(vin)) {
    return NextResponse.json(
      { success: false, error: "VIN cannot contain letters I, O, or Q" },
      { status: 400 }
    )
  }

  try {
    const result = await decodeVIN(vin)
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "VIN decode failed"
    return NextResponse.json(
      { success: false, error: message },
      { status: 422 }
    )
  }
}
