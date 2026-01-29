import { createClient } from "@/lib/supabase/server"

export async function getTableByQRCode(qrCode: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("tables").select("*").eq("qr_code", qrCode).maybeSingle()

  if (error) {
    console.error("[v0] Error fetching table:", error)
    return null
  }

  return data
}

export async function getRestaurantById(restaurantId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("restaurants").select("*").eq("id", restaurantId).single()

  if (error) {
    console.error("[v0] Error fetching restaurant:", error)
    return null
  }

  return data
}

export async function getActiveOrderForTable(tableId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      items:order_items(
        *,
        menu_item:menu_items(*)
      )
    `)
    .eq("table_id", tableId)
    .in("status", ["confirmed", "preparing", "ready"])
    .eq("payment_status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error("[v0] Error fetching order:", error)
    return null
  }

  return data
}

export async function getAllTablesForRestaurant(restaurantId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("table_number", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching tables:", error)
    return []
  }

  return data
}

export async function getOrdersForRestaurant(restaurantId: string, status?: string) {
  const supabase = await createClient()

  let query = supabase
    .from("orders")
    .select(`
      *,
      table:tables(table_number),
      items:order_items(
        *,
        menu_item:menu_items(name, price)
      )
    `)
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: false })

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query

  if (error) {
    console.error("[v0] Error fetching orders:", error)
    return []
  }

  return data
}

export async function createPaymentRecord(paymentData: {
  orderId: string
  amount: number
  method: string
  gatewayTransactionId?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payments")
    .insert({
      order_id: paymentData.orderId,
      amount: paymentData.amount,
      payment_method: paymentData.method,
      gateway_transaction_id: paymentData.gatewayTransactionId,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating payment:", error)
    return null
  }

  return data
}

export async function updatePaymentStatus(
  paymentId: string,
  status: "pending" | "completed" | "failed" | "refunded",
  gatewayTransactionId?: string,
) {
  const supabase = await createClient()

  const updateData: any = { status }
  if (gatewayTransactionId) {
    updateData.gateway_transaction_id = gatewayTransactionId
  }

  const { data, error } = await supabase.from("payments").update(updateData).eq("id", paymentId).select().single()

  if (error) {
    console.error("[v0] Error updating payment:", error)
    return null
  }

  return data
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "confirmed" | "preparing" | "ready" | "completed" | "cancelled",
) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select().single()

  if (error) {
    console.error("[v0] Error updating order:", error)
    return null
  }

  return data
}

export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: "pending" | "partial" | "completed" | "refunded",
) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .update({ payment_status: paymentStatus })
    .eq("id", orderId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Error updating order payment status:", error)
    return null
  }

  return data
}

export async function updateTableStatus(tableId: string, status: "available" | "occupied" | "reserved") {
  const supabase = await createClient()

  const { data, error } = await supabase.from("tables").update({ status }).eq("id", tableId).select().single()

  if (error) {
    console.error("[v0] Error updating table status:", error)
    return null
  }

  return data
}

export async function createPaymentSplit(splitData: {
  paymentId: string
  amount: number
  status: string
  gatewayTransactionId?: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payment_splits")
    .insert({
      payment_id: splitData.paymentId,
      amount: splitData.amount,
      status: splitData.status,
      gateway_transaction_id: splitData.gatewayTransactionId,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating payment split:", error)
    return null
  }

  return data
}

export async function getPaymentSplits(paymentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payment_splits")
    .select("*")
    .eq("payment_id", paymentId)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching payment splits:", error)
    return []
  }

  return data
}

export async function updatePaymentSplitStatus(splitId: string, status: string, gatewayTransactionId?: string) {
  const supabase = await createClient()

  const updateData: any = { status }
  if (gatewayTransactionId) {
    updateData.gateway_transaction_id = gatewayTransactionId
  }

  const { data, error } = await supabase.from("payment_splits").update(updateData).eq("id", splitId).select().single()

  if (error) {
    console.error("[v0] Error updating payment split:", error)
    return null
  }

  return data
}

export async function getTotalPaidAmount(paymentId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("payment_splits")
    .select("amount")
    .eq("payment_id", paymentId)
    .eq("status", "completed")

  if (error) {
    console.error("[v0] Error calculating paid amount:", error)
    return 0
  }

  return data.reduce((sum, split) => sum + Number(split.amount), 0)
}
