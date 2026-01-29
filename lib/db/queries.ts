import { createClient } from "@/lib/supabase/server"
import type { Restaurant, Table, MenuItem, Order, OrderItem } from "@/lib/types"

export async function getRestaurantById(id: string): Promise<Restaurant | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("restaurants").select("*").eq("id", id).single()

  if (error) {
    console.error("[v0] Error fetching restaurant:", error)
    return null
  }
  return data
}

export async function getTableByQRCode(qrCode: string): Promise<Table | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("tables").select("*").eq("qr_code", qrCode).single()

  if (error) {
    console.error("[v0] Error fetching table:", error)
    return null
  }
  return data
}

export async function getTablesByRestaurant(restaurantId: string): Promise<Table[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("tables")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("table_number")

  if (error) {
    console.error("[v0] Error fetching tables:", error)
    return []
  }
  return data || []
}

export async function getMenuItemsByRestaurant(restaurantId: string): Promise<MenuItem[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_available", true)
    .order("name")

  if (error) {
    console.error("[v0] Error fetching menu items:", error)
    return []
  }
  return data || []
}

export async function getOrderByTable(
  tableId: string,
): Promise<(Order & { items: (OrderItem & { menu_item: MenuItem })[] }) | null> {
  const supabase = await createClient()

  // Get active order for table
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*")
    .eq("table_id", tableId)
    .eq("status", "active")
    .single()

  if (orderError || !order) {
    return null
  }

  // Get order items with menu item details
  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select(`
      *,
      menu_item:menu_items(*)
    `)
    .eq("order_id", order.id)

  if (itemsError) {
    console.error("[v0] Error fetching order items:", itemsError)
    return null
  }

  return {
    ...order,
    items: items || [],
  }
}

export async function getMenuWithCategories(restaurantId: string) {
  const supabase = await createClient()

  const { data: categories, error: categoriesError } = await supabase
    .from("menu_categories")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .eq("is_active", true)
    .order("display_order")

  if (categoriesError) {
    console.error("[v0] Error fetching categories:", categoriesError)
    return []
  }

  const categoriesWithItems = await Promise.all(
    (categories || []).map(async (category) => {
      const { data: items } = await supabase
        .from("menu_items")
        .select("*")
        .eq("category_id", category.id)
        .eq("is_available", true)
        .order("name")

      return {
        ...category,
        items: items || [],
      }
    }),
  )

  return categoriesWithItems
}
