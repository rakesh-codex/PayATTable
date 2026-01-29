import { SimplePayment } from "@/components/simple-payment"
import { AppNavigation } from "@/components/app-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { getTableByQRCode, getRestaurantById, getActiveOrderForTable } from "@/lib/supabase/queries"

export const dynamic = "force-dynamic"
export const revalidate = 0

async function getOrderData(qrCode: string) {
  const table = await getTableByQRCode(qrCode)

  if (!table) {
    return null
  }

  const restaurant = await getRestaurantById(table.restaurant_id)

  if (!restaurant) {
    return null
  }

  const order = await getActiveOrderForTable(table.id)

  if (!order) {
    return null
  }

  return {
    table,
    restaurant,
    order,
  }
}

export default async function CustomerPayPage({ params }: { params: Promise<{ qrCode: string }> }) {
  const { qrCode } = await params

  const data = await getOrderData(qrCode)

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-background dark:from-green-950/20">
        <AppNavigation title="Payment" />
        <div className="container mx-auto p-6">
          <div className="mx-auto max-w-md">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">No Active Order</CardTitle>
                <CardDescription>Table not found or no active order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  If you continue to experience issues, please ask your server for assistance.
                </p>
                <div className="flex flex-col gap-2">
                  <Link href={`/customer/menu/${qrCode}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      View Menu
                    </Button>
                  </Link>
                  <Link href="/">
                    <Button className="w-full">Go Home</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-background dark:from-green-950/20">
      <AppNavigation title="Payment" />
      <SimplePayment order={data.order} restaurant={data.restaurant} table={data.table} />
    </div>
  )
}
