import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = await params

  // Mock data for testing
  const mockOrder = {
    id: orderId,
    restaurant_id: "550e8400-e29b-41d4-a716-446655440000",
    table_id: "550e8400-e29b-41d4-a716-446655440001",
    order_number: "ORD-20250110-001",
    subtotal: 185.0,
    vat_amount: 27.75,
    total_amount: 212.75,
    status: "active" as const,
    created_at: new Date().toISOString(),
    items: [
      {
        id: "1",
        menu_item_id: "1",
        quantity: 2,
        unit_price: 35.0,
        total_price: 70.0,
        menu_item: {
          name: "Shawarma Plate",
          description: "Grilled chicken shawarma with rice and salad",
          food_type: "non_veg" as const,
        },
      },
    ],
  }

  return NextResponse.json(mockOrder)
}
