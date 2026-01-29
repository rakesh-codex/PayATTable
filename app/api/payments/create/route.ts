import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  const { orderId, amount, tipAmount, totalAmount, paymentMethod, customerInfo, splitId } = body

  // Create mock payment record
  const payment = {
    id: `pay-${Date.now()}`,
    order_id: orderId,
    split_id: splitId || null,
    amount,
    tip_amount: tipAmount || 0,
    total_amount: totalAmount,
    payment_method: paymentMethod || "card",
    payment_status: "pending",
    customer_name: customerInfo?.name || null,
    customer_email: customerInfo?.email || null,
    customer_phone: customerInfo?.phone || null,
    created_at: new Date().toISOString(),
  }

  console.log("[v0] Payment created:", payment)

  return NextResponse.json(payment)
}
