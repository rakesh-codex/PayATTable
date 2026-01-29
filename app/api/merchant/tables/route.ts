import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Get the first restaurant (since auth is disabled)
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id")
      .limit(1)
      .single()

    if (restaurantError || !restaurant) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    // Get all tables for the restaurant
    const { data: tables, error: tablesError } = await supabase
      .from("tables")
      .select("*")
      .eq("restaurant_id", restaurant.id)
      .order("table_number", { ascending: true })

    if (tablesError) {
      console.error("[v0] Error fetching tables:", tablesError)
      return NextResponse.json({ error: "Failed to fetch tables" }, { status: 500 })
    }

    return NextResponse.json({ tables })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Error:", errorMessage)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
