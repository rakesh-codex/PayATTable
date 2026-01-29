import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

function generateTransactionId(): string {
  return `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { orderId, amount, tipPercent, numPeople } = body

    console.log("[v0] Creating payment link for order:", orderId, "amount:", amount)

    const supabase = await createServerClient()

    const { data: orders, error: orderError } = await supabase.from("orders").select("*").eq("id", orderId)

    if (orderError || !orders || orders.length === 0) {
      console.error("[v0] Order not found:", orderError)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const order = orders[0]

    const { data: restaurants } = await supabase.from("restaurants").select("*").eq("id", order.restaurant_id)

    const restaurant = restaurants?.[0]

    const tipAmount = (order.subtotal * (tipPercent || 0)) / 100
    const totalWithTip = order.subtotal + order.vat_amount + tipAmount

    await supabase
      .from("orders")
      .update({
        tip_amount: tipAmount,
        total_amount: totalWithTip,
      })
      .eq("id", orderId)

    const { data: existingPayments } = await supabase
      .from("payments")
      .select("*")
      .eq("order_id", orderId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)

    let payment = existingPayments && existingPayments.length > 0 ? existingPayments[0] : null

    const transactionId = generateTransactionId()

    if (!payment) {
      const { data: newPayment, error: paymentError } = await supabase
        .from("payments")
        .insert({
          order_id: orderId,
          amount: totalWithTip,
          payment_method: "card",
          status: "pending",
          num_people: numPeople,
          tip_percent: tipPercent,
          gateway_transaction_id: transactionId,
        })
        .select()
        .single()

      if (paymentError || !newPayment) {
        console.error("[v0] Error creating payment:", paymentError)
        return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
      }

      payment = newPayment
    }

    const { data: splits = [] } = await supabase.from("payment_splits").select("*").eq("payment_id", payment.id)

    const existingSplits = splits.length
    const amountPerPerson = totalWithTip / numPeople

    const geideaPaymentLink = `https://payment.geidea.com/pay?paymentId=${payment.id}&amount=${amountPerPerson}&currency=${restaurant?.currency || "SAR"}&merchantId=alnakheel&orderId=${order.order_number}`

    console.log("[v0] Payment link created:", geideaPaymentLink)

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      paymentLink: geideaPaymentLink,
      amount: amountPerPerson,
      existingSplits,
      totalSplits: numPeople,
      tipPercent,
      transactionId: payment.gateway_transaction_id || transactionId,
    })
  } catch (error) {
    console.error("[v0] Error in create-link API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
