import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data: payments, error } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(1)

    if (error) {
      console.error("[v0] Error checking payment:", error)
      return NextResponse.json({ error: "Failed to check payment" }, { status: 500 })
    }

    const payment = payments && payments.length > 0 ? payments[0] : null

    let splits = []
    if (payment) {
      const { data: paymentSplits } = await supabase.from("payment_splits").select("*").eq("payment_id", payment.id)
      splits = paymentSplits || []
    }

    return NextResponse.json({
      success: true,
      payment: payment ? { ...payment, splits } : null,
    })
  } catch (error) {
    console.error("[v0] Error in check payment API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
