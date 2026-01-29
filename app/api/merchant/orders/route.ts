import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { verifyToken } from "@/lib/auth"
import { cookies } from "next/headers"

export async function GET(request: Request) {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await verifyToken(token)
  if (!user) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get("status")

  const supabase = await createServerClient()

  // Get restaurant for the logged-in merchant
  const { data: restaurant, error: restaurantError } = await supabase
    .from("restaurants")
    .select("id")
    .eq("email", user.email)
    .single()

  if (restaurantError || !restaurant) {
    return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
  }

  // Build query for orders
  let query = supabase
    .from("orders")
    .select(`
      *,
      table:tables(table_number, capacity),
      items:order_items(
        *,
        menu_item:menu_items(name, price)
      )
    `)
    .eq("restaurant_id", restaurant.id)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data: orders, error: ordersError } = await query

  if (ordersError) {
    console.error("[v0] Error fetching orders:", ordersError)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }

  return NextResponse.json({ orders })
}
