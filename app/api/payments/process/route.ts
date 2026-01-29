import { MockGeideaGateway } from "@/lib/geidea/mock-gateway"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  const { amount, currency, cardDetails, paymentMethod, paymentId, orderId, transactionId } = body

  try {
    if (transactionId) {
      // Payment already completed, just return success
      return NextResponse.json({
        success: true,
        transactionId,
        orderId: orderId || paymentId,
        responseCode: "000",
        responseMessage: "Payment completed successfully",
        amount,
        currency: currency || "SAR",
        status: "completed",
        timestamp: new Date().toISOString(),
      })
    }

    const paymentIntent = await MockGeideaGateway.initiatePayment({
      amount,
      currency: currency || "SAR",
      orderId: paymentId || orderId || `PAY-${Date.now()}`,
    })

    const result = await MockGeideaGateway.processCardPayment(
      paymentIntent.paymentIntentId,
      cardDetails || {
        cardNumber: "4111111111111111",
        expiryMonth: "12",
        expiryYear: "25",
        cvv: "123",
        cardholderName: "Customer",
      },
      amount,
    )

    return NextResponse.json(result)
  } catch (error) {
    console.error("Payment processing error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Payment processing failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
