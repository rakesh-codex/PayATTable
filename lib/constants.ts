// Application-wide constants for production configuration

export const APP_CONFIG = {
  name: "Restaurant CRM System",
  version: "1.0.0",
  currency: "SAR",
  defaultVatPercent: 15,
} as const

export const TABLE_STATUS = {
  AVAILABLE: "available",
  OCCUPIED: "occupied",
  RESERVED: "reserved",
} as const

export const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const

export const PAYMENT_STATUS = {
  PENDING: "pending",
  PARTIAL: "partial",
  COMPLETED: "completed",
  REFUNDED: "refunded",
} as const

export const PAYMENT_METHOD = {
  CARD: "card",
  APPLE_PAY: "applepay",
  STCPAY: "stcpay",
  MADA: "mada",
} as const

// Default demo credentials
export const DEMO_CREDENTIALS = {
  email: "rakesh@gmail.com",
  // Note: In production, use proper password hashing with bcrypt
  password: "password",
  role: "admin" as const,
  name: "Rakesh",
}
