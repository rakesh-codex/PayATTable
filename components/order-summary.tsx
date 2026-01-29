"use client"

import type { Order, OrderItem, MenuItem } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface OrderSummaryProps {
  order: Order & { items: (OrderItem & { menu_item: MenuItem })[] }
  currency?: string
}

export function OrderSummary({ order, currency = "SAR" }: OrderSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Order {order.order_number}</CardDescription>
          </div>
          <Badge variant="secondary">{order.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {order.items && order.items.length > 0 ? (
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="font-medium">{item.menu_item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {currency} {item.unit_price.toFixed(2)} × {item.quantity}
                  </p>
                  {item.notes && <p className="text-xs text-muted-foreground italic">Note: {item.notes}</p>}
                </div>
                <p className="font-medium">
                  {currency} {item.total_price.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <p>No items in this order yet</p>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>
              {currency} {order.subtotal.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">VAT (15%)</span>
            <span>
              {currency} {order.vat_amount.toFixed(2)}
            </span>
          </div>
          {order.tip_amount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tip</span>
              <span>
                {currency} {order.tip_amount.toFixed(2)}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex items-center justify-between text-lg font-bold">
            <span>Total</span>
            <span>
              {currency} {order.total_amount.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
