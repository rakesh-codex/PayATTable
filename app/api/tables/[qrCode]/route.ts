import { NextResponse } from "next/server"
import { getTableByQRCode, getRestaurantById, getActiveOrderForTable } from "@/lib/supabase/queries"

export async function GET(request: Request, { params }: { params: Promise<{ qrCode: string }> }) {
  const { qrCode } = await params

  console.log("[v0] Fetching data for QR code:", qrCode)

  const table = await getTableByQRCode(qrCode)

  if (!table) {
    console.log("[v0] Table not found for QR code:", qrCode)
    return NextResponse.json({ error: "Table not found" }, { status: 404 })
  }

  console.log("[v0] Found table:", table)

  const restaurant = await getRestaurantById(table.restaurant_id)

  if (!restaurant) {
    console.log("[v0] Restaurant not found for ID:", table.restaurant_id)
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }

  console.log("[v0] Found restaurant:", restaurant)

  const order = await getActiveOrderForTable(table.id)

  if (!order) {
    console.log("[v0] No active order found for table:", table.id)
    return NextResponse.json({ error: "No active order found for this table" }, { status: 404 })
  }

  console.log("[v0] Found order with items:", order)

  // Return the data in the expected format
  return NextResponse.json({
    table,
    restaurant,
    order,
  })
}
