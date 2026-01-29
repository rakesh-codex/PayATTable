export interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  email: string
  currency: string
  vat_percent: number
  created_at: string
  updated_at: string
}

export interface Table {
  id: string
  restaurant_id: string
  table_number: number
  capacity: number
  qr_code: string
  status: "available" | "occupied" | "reserved"
  created_at: string
  updated_at: string
}

export interface MenuCategory {
  id: string
  restaurant_id: string
  name: string
  display_order: number
  created_at: string
  updated_at: string
}

export interface MenuItem {
  id: string
  restaurant_id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  available: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  restaurant_id: string
  table_id: string
  order_number: string
  subtotal: number
  vat_amount: number
  tip_amount: number
  total_amount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled"
  payment_status: "pending" | "partial" | "completed" | "refunded"
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  menu_item_id: string
  quantity: number
  unit_price: number
  total_price: number
  notes: string | null
  created_at: string
  menu_item?: MenuItem
}

export interface Payment {
  id: string
  order_id: string
  amount: number
  payment_method: string
  gateway_transaction_id: string | null
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface PaymentSplit {
  id: string
  payment_id: string
  amount: number
  status: "pending" | "completed" | "failed"
  gateway_transaction_id: string | null
  created_at: string
  updated_at: string
}

// Legacy types for backward compatibility
export interface LegacyRestaurant {
  id: string
  name: string
  address: string | null
  phone: string | null
  email: string | null
  currency: string
  tax_rate: number
  created_at: string
  updated_at: string
}

export interface LegacyTable {
  id: string
  restaurant_id: string
  table_number: string
  capacity: number
  qr_code: string
  status: "available" | "occupied" | "reserved" | "cleaning"
  created_at: string
  updated_at: string
}
