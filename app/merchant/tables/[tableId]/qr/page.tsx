import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QRCodeDisplay } from "@/components/qr-code-display"
import { AppNavigation } from "@/components/app-navigation"
import Link from "next/link"
import { Eye, UtensilsCrossed, CreditCard } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export default async function TableQRPage({ params }: { params: Promise<{ tableId: string }> }) {
  const { tableId } = await params
  const supabase = await createClient()

  const { data: tableData, error } = await supabase
    .from("tables")
    .select(`
      id,
      table_number,
      qr_code,
      restaurant_id,
      restaurants (
        name
      )
    `)
    .eq("id", tableId)
    .single()

  if (error || !tableData) {
    console.error("[v0] Error fetching table data:", error)
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation title="QR Code" />
        <div className="container mx-auto p-6">
          <div className="text-center space-y-4">
            <p className="text-destructive">Failed to load table data</p>
            <p className="text-sm text-muted-foreground">{error?.message || "Table not found"}</p>
            <Button asChild>
              <Link href="/merchant">Go Home</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const headersList = await headers()
  const host = headersList.get("host") || ""
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http"
  const baseUrl = `${protocol}://${host}`

  const menuUrl = `${baseUrl}/customer/menu`
  const paymentUrl = `${baseUrl}/customer/pay/${tableData.qr_code}`
  const restaurantName = (tableData.restaurants as any)?.name || "Restaurant"

  console.log("[v0] QR Page - Current Host:", host)
  console.log("[v0] QR Page - Base URL:", baseUrl)
  console.log("[v0] QR Page - Menu URL:", menuUrl)

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation title={`Table ${tableData.table_number} QR Codes`} />
      <div className="container mx-auto p-6">
        <div className="mx-auto max-w-lg space-y-6">
          <Tabs defaultValue="payment" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="menu">
                <UtensilsCrossed className="mr-2 h-4 w-4" />
                Menu Card
              </TabsTrigger>
              <TabsTrigger value="payment">
                <CreditCard className="mr-2 h-4 w-4" />
                Payment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="mt-4">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Menu QR Code - Table {tableData.table_number}</CardTitle>
                  <CardDescription>Customers scan this code to view the restaurant menu</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <QRCodeDisplay
                    value={menuUrl}
                    restaurantName={restaurantName}
                    tableNumber={tableData.table_number.toString()}
                    description="Scan to view menu"
                  />

                  <div className="space-y-2">
                    <p className="text-center text-sm font-medium">Menu URL</p>
                    <code className="block rounded bg-muted p-2 text-center text-xs break-all">{menuUrl}</code>
                  </div>

                  <Link href="/customer/menu">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Menu
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payment" className="mt-4">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle>Payment QR Code - Table {tableData.table_number}</CardTitle>
                  <CardDescription>Customers scan this code to view and pay their bill</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <QRCodeDisplay
                    value={paymentUrl}
                    restaurantName={restaurantName}
                    tableNumber={tableData.table_number.toString()}
                    description="Scan to view and pay bill"
                  />

                  <div className="space-y-2">
                    <p className="text-center text-sm font-medium">Payment URL</p>
                    <code className="block rounded bg-muted p-2 text-center text-xs break-all">{paymentUrl}</code>
                  </div>

                  <Link href={`/customer/pay/${tableData.qr_code}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Payment Page
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
