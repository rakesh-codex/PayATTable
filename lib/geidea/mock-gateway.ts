import type { GeideaPaymentRequest, GeideaPaymentResponse, GeideaCardDetails } from "./types"

/**
 * Mock Geidea Payment Gateway
 * Simulates payment processing for demo purposes
 */
export class MockGeideaGateway {
  private static generateTransactionId(): string {
    return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  private static generatePaymentIntentId(): string {
    return `PI-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  }

  /**
   * Initiate payment and get payment intent
   */
  static async initiatePayment(request: GeideaPaymentRequest): Promise<GeideaPaymentResponse> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const transactionId = this.generateTransactionId()
    const paymentIntentId = this.generatePaymentIntentId()

    // Mock successful response
    return {
      success: true,
      transactionId,
      orderId: request.orderId,
      paymentIntentId,
      responseCode: "000",
      responseMessage: "Payment initiated successfully",
      amount: request.amount,
      currency: request.currency,
      status: "pending",
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Process card payment
   */
  static async processCardPayment(
    paymentIntentId: string,
    cardDetails: GeideaCardDetails,
    amount: number,
  ): Promise<GeideaPaymentResponse> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Simulate card validation
    const isValidCard = this.validateCard(cardDetails)

    if (!isValidCard) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        orderId: "",
        paymentIntentId,
        responseCode: "051",
        responseMessage: "Invalid card details",
        amount,
        currency: "SAR",
        status: "failed",
        timestamp: new Date().toISOString(),
      }
    }

    // Simulate random failure (10% chance)
    const shouldFail = Math.random() < 0.1

    if (shouldFail) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        orderId: "",
        paymentIntentId,
        responseCode: "005",
        responseMessage: "Insufficient funds",
        amount,
        currency: "SAR",
        status: "failed",
        timestamp: new Date().toISOString(),
      }
    }

    // Success response
    return {
      success: true,
      transactionId: this.generateTransactionId(),
      orderId: "",
      paymentIntentId,
      responseCode: "000",
      responseMessage: "Payment completed successfully",
      amount,
      currency: "SAR",
      status: "completed",
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Basic card validation
   */
  private static validateCard(cardDetails: GeideaCardDetails): boolean {
    // Remove spaces and check if it's a valid number
    const cardNumber = cardDetails.cardNumber.replace(/\s/g, "")
    if (!/^\d{16}$/.test(cardNumber)) return false

    // Check expiry date
    const currentDate = new Date()
    const expiryMonth = Number.parseInt(cardDetails.expiryMonth)
    const expiryYear = Number.parseInt(`20${cardDetails.expiryYear}`)

    if (expiryMonth < 1 || expiryMonth > 12) return false
    if (expiryYear < currentDate.getFullYear()) return false
    if (expiryYear === currentDate.getFullYear() && expiryMonth < currentDate.getMonth() + 1) return false

    // Check CVV
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) return false

    return true
  }

  /**
   * Process digital wallet payment (STC Pay, Alipay, Tamara)
   */
  static async processWalletPayment(
    paymentIntentId: string,
    walletType: string,
    walletDetails: { phoneNumber?: string; walletId?: string },
    amount: number,
  ): Promise<GeideaPaymentResponse> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Validate phone number
    if (walletDetails.phoneNumber && !/^\+?[0-9]{10,15}$/.test(walletDetails.phoneNumber.replace(/\s/g, ""))) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        orderId: "",
        paymentIntentId,
        responseCode: "052",
        responseMessage: "Invalid phone number",
        amount,
        currency: "SAR",
        status: "failed",
        timestamp: new Date().toISOString(),
      }
    }

    // Simulate random failure (5% chance for wallets)
    const shouldFail = Math.random() < 0.05

    if (shouldFail) {
      return {
        success: false,
        transactionId: this.generateTransactionId(),
        orderId: "",
        paymentIntentId,
        responseCode: "005",
        responseMessage: `${walletType.toUpperCase()} payment declined`,
        amount,
        currency: "SAR",
        status: "failed",
        timestamp: new Date().toISOString(),
      }
    }

    // Success response
    return {
      success: true,
      transactionId: this.generateTransactionId(),
      orderId: "",
      paymentIntentId,
      responseCode: "000",
      responseMessage: `${walletType.toUpperCase()} payment completed successfully`,
      amount,
      currency: "SAR",
      status: "completed",
      timestamp: new Date().toISOString(),
    }
  }

  /**
   * Check payment status
   */
  static async checkPaymentStatus(transactionId: string): Promise<GeideaPaymentResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock status check
    return {
      success: true,
      transactionId,
      orderId: "",
      paymentIntentId: "",
      responseCode: "000",
      responseMessage: "Payment status retrieved",
      amount: 0,
      currency: "SAR",
      status: "completed",
      timestamp: new Date().toISOString(),
    }
  }
}
