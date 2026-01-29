import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

// This endpoint would receive webhooks from Geidea Payment Gateway
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { paymentId, transactionId, status, amount } = body

    console.log("[v0] Received payment webhook:", { paymentId, transactionId, status })

    const supabase = await createServerClient()

    // Verify webhook signature in production
    // const isValid = verifyGeideaSignature(request.headers, body)
    // if (!isValid) {
    //   return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    // }

    // Get payment with order details
    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("*, order:orders(id, table_id)")
      .eq("id", paymentId)
      .single()

    if (paymentError || !payment) {
      console.error("[v0] Payment not found:", paymentError)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const paymentStatus = status === "success" ? "completed" : status === "failed" ? "failed" : "processing"

    await supabase
      .from("payments")
      .update({
        status: paymentStatus,
        gateway_transaction_id: transactionId,
        paid_at: paymentStatus === "completed" ? new Date().toISOString() : null,
      })
      .eq("id", paymentId)

    if (paymentStatus === "completed") {
      await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          status: "completed",
        })
        .eq("id", payment.order.id)

      await supabase.from("tables").update({ status: "available" }).eq("id", payment.order.table_id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in webhook API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
