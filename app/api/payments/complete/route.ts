import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { paymentId, gatewayTransactionId, amount } = body

    console.log("[v0] Completing payment split:", paymentId, "transaction:", gatewayTransactionId)

    const supabase = await createServerClient()

    const { data: payments, error: paymentError } = await supabase.from("payments").select("*").eq("id", paymentId)

    if (paymentError || !payments || payments.length === 0) {
      console.error("[v0] Payment not found:", paymentError)
      return NextResponse.json({ error: "Payment not found" }, { status: 404 })
    }

    const payment = payments[0]

    const { data: orders } = await supabase
      .from("orders")
      .select("id, table_id, subtotal, vat_amount, total_amount")
      .eq("id", payment.order_id)

    const order = orders?.[0]

    const { data: newSplit, error: splitError } = await supabase
      .from("payment_splits")
      .insert({
        payment_id: paymentId,
        amount: amount || payment.amount,
        status: "completed",
        gateway_transaction_id: gatewayTransactionId || `TRX-${Date.now()}`,
      })
      .select()
      .single()

    if (splitError) {
      console.error("[v0] Error creating payment split:", splitError)
      return NextResponse.json({ error: "Failed to create payment split" }, { status: 500 })
    }

    const { data: allSplits = [] } = await supabase.from("payment_splits").select("*").eq("payment_id", paymentId)

    const totalPaid = allSplits.filter((s) => s.status === "completed").reduce((sum, s) => sum + Number(s.amount), 0)
    const isFullyPaid = totalPaid >= Number(payment.amount)

    console.log("[v0] Total paid:", totalPaid, "Payment amount:", payment.amount, "Fully paid:", isFullyPaid)

    if (isFullyPaid) {
      await supabase
        .from("payments")
        .update({
          status: "completed",
          paid_at: new Date().toISOString(),
        })
        .eq("id", paymentId)

      await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          status: "completed",
        })
        .eq("id", payment.order_id)

      if (order?.table_id) {
        await supabase.from("tables").update({ status: "available" }).eq("id", order.table_id)
      }

      console.log("[v0] Payment fully completed - order and table updated")
    } else {
      console.log("[v0] Payment split recorded - waiting for remaining splits")
    }

    return NextResponse.json({
      success: true,
      message: isFullyPaid ? "Payment completed successfully" : "Payment split recorded",
      isFullyPaid,
      totalPaid,
      remainingAmount: Number(payment.amount) - totalPaid,
    })
  } catch (error) {
    console.error("[v0] Error in complete payment API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
