import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

export async function GET(request: NextRequest, { params }: { params: Promise<{ qrCode: string }> }) {
  try {
    const { qrCode } = await params
    const supabase = await createServerClient()

    console.log("[v0] Fetching menu for QR code:", qrCode)

    // Get table and restaurant info
    const { data: table, error: tableError } = await supabase
      .from("tables")
      .select(`
        id,
        table_number,
        qr_code,
        restaurant_id,
        restaurants (
          id,
          name,
          currency
        )
      `)
      .eq("qr_code", qrCode)
      .maybeSingle()

    if (tableError) {
      console.error("[v0] Table query error:", tableError)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!table) {
      console.error("[v0] Table not found for QR code:", qrCode)
      return NextResponse.json({ error: "Table not found" }, { status: 404 })
    }

    console.log("[v0] Found table:", table.table_number, "for restaurant:", table.restaurants.name)

    // Get menu categories and items
    const { data: categories, error: menuError } = await supabase
      .from("menu_categories")
      .select(`
        id,
        name,
        display_order,
        menu_items (
          id,
          name,
          description,
          price,
          available
        )
      `)
      .eq("restaurant_id", table.restaurant_id)
      .order("display_order", { ascending: true })

    if (menuError) {
      console.error("[v0] Menu query error:", menuError)
      return NextResponse.json({ error: "Failed to load menu" }, { status: 500 })
    }

    console.log("[v0] Found", categories?.length || 0, "categories")

    // Format response
    const formattedCategories = categories
      .filter((cat: any) => cat.menu_items && cat.menu_items.length > 0)
      .map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        display_order: cat.display_order,
        items: cat.menu_items.sort((a: any, b: any) => a.name.localeCompare(b.name)),
      }))

    return NextResponse.json({
      restaurant: {
        id: table.restaurants.id,
        name: table.restaurants.name,
      },
      table: {
        id: table.id,
        table_number: table.table_number,
        qr_code: table.qr_code,
      },
      currency: table.restaurants.currency,
      categories: formattedCategories,
    })
  } catch (error) {
    console.error("[v0] Menu API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
