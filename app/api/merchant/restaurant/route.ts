import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createServerClient()

    // Get the first restaurant (since auth is disabled, we just use the first one)
    const { data, error } = await supabase.from("restaurants").select("*").limit(1).single()

    if (error) {
      console.error("[v0] Supabase error:", error.message, error.code)
      return NextResponse.json({ error: "Failed to fetch restaurant" }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Restaurant not found" }, { status: 404 })
    }

    return NextResponse.json({ restaurant: data })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    console.error("[v0] Error:", errorMessage)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
