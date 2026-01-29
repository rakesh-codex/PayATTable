export interface GeideaPaymentRequest {
  amount: number
  currency: string
  orderId: string
  customerEmail?: string
  customerPhone?: string
  callbackUrl?: string
  returnUrl?: string
}

export interface GeideaPaymentResponse {
  success: boolean
  transactionId: string
  orderId: string
  paymentIntentId: string
  responseCode: string
  responseMessage: string
  amount: number
  currency: string
  status: "pending" | "processing" | "completed" | "failed"
  timestamp: string
}

export interface GeideaCardDetails {
  cardNumber: string
  cardHolder: string
  expiryMonth: string
  expiryYear: string
  cvv: string
}
