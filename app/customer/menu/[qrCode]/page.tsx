import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { getActiveOrderForTable } from "@/lib/supabase/queries"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function CustomerMenuPage({ params }: { params: Promise<{ qrCode: string }> }) {
  console.log("[v0] ===== CUSTOMER MENU PAGE LOADING =====")

  try {
    const resolvedParams = await params
    const qrCode = resolvedParams.qrCode

    console.log("[v0] Customer Menu - QR Code:", qrCode)

    const supabase = await createClient()
    console.log("[v0] Customer Menu - Supabase client created")

    // Get table info first
    const { data: table, error: tableError } = await supabase
      .from("tables")
      .select("id, table_number, qr_code, status, restaurant_id")
      .eq("qr_code", qrCode)
      .single()

    console.log("[v0] Customer Menu - Table query result:", { table, error: tableError })

    if (tableError || !table) {
      console.error("[v0] Customer Menu - Table not found or error:", tableError)
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-muted-foreground">Menu not found for this QR code.</p>
              <p className="text-xs text-muted-foreground">QR Code: {qrCode}</p>
              <Link href="/">
                <Button className="mt-4">Go Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )
    }

    console.log("[v0] Customer Menu - Table found:", table.table_number)

    // Get restaurant info separately
    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("id, name, currency")
      .eq("id", table.restaurant_id)
      .single()

    console.log("[v0] Customer Menu - Restaurant query result:", { restaurant, error: restaurantError })

    if (restaurantError || !restaurant) {
      console.error("[v0] Customer Menu - Restaurant not found")
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-muted-foreground">Restaurant information not found.</p>
              <Link href="/">
                <Button className="mt-4">Go Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Check for active order
    const activeOrder = await getActiveOrderForTable(table.id)
    const hasActiveOrder = !!activeOrder
    console.log("[v0] Customer Menu - Active order:", hasActiveOrder)

    // Get menu categories and items
    const { data: categories, error: menuError } = await supabase
      .from("menu_categories")
      .select(`
        id,
        name,
        display_order,
        menu_items (
          id,
          name,
          description,
          price,
          available
        )
      `)
      .eq("restaurant_id", table.restaurant_id)
      .order("display_order", { ascending: true })

    console.log("[v0] Customer Menu - Categories query result:", {
      count: categories?.length,
      error: menuError,
    })

    if (menuError) {
      console.error("[v0] Customer Menu - Menu error:", menuError)
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center space-y-4">
              <p className="text-muted-foreground">Error loading menu. Please try again.</p>
              <Link href="/">
                <Button className="mt-4">Go Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      )
    }

    // Format categories
    const formattedCategories = (categories || [])
      .filter((cat: any) => cat.menu_items && cat.menu_items.length > 0)
      .map((cat: any) => ({
        id: cat.id,
        name: cat.name,
        display_order: cat.display_order,
        items: cat.menu_items.sort((a: any, b: any) => a.name.localeCompare(b.name)),
      }))

    console.log("[v0] Customer Menu - Formatted categories:", formattedCategories.length)

    const restaurantName = restaurant.name
    const currency = restaurant.currency || "$"

    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white sticky top-0 z-10 shadow-lg">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-2">
              <UtensilsCrossed className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">{restaurantName}</h1>
                <p className="text-sm text-orange-100">Table {table.table_number}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Content */}
        <div className="container mx-auto px-4 py-6 pb-24">
          {formattedCategories.length === 0 ? (
            <Card className="w-full max-w-md mx-auto mt-8">
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground">No menu items available at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-8">
              {formattedCategories.map((category: any) => (
                <div key={category.id}>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
                    <Badge variant="secondary">{category.items.length} items</Badge>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {category.items.map((item: any) => (
                      <Card key={item.id} className={`overflow-hidden ${!item.available ? "opacity-60" : ""}`}>
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <CardTitle className="text-lg leading-tight">{item.name}</CardTitle>
                            {!item.available && (
                              <Badge variant="destructive" className="text-xs">
                                Unavailable
                              </Badge>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          {item.description && <p className="text-sm text-muted-foreground mb-3">{item.description}</p>}
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-orange-600">
                              {currency} {Number(item.price).toFixed(2)}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Footer Actions */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
            <div className="container mx-auto max-w-md space-y-2">
              {hasActiveOrder ? (
                <Link href={`/customer/pay/${qrCode}`}>
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-6 text-lg font-semibold">
                    View My Bill & Pay
                  </Button>
                </Link>
              ) : (
                <>
                  <Button disabled className="w-full py-6 text-lg font-semibold" title="No active order for this table">
                    View My Bill & Pay
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    No active order. Please place an order with your server first.
                  </p>
                </>
              )}
              <Link href="/" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error("[v0] Customer Menu - Unexpected error:", error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">An error occurred while loading the menu.</p>
            <p className="text-xs text-muted-foreground">{error instanceof Error ? error.message : "Unknown error"}</p>
            <Link href="/">
              <Button className="mt-4">Go Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }
}
