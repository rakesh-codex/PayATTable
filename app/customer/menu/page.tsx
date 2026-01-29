import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Home } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function MenuPage() {
  const supabase = await createClient()

  // Fetch the restaurant
  const { data: restaurant, error: restaurantError } = await supabase.from("restaurants").select("*").single()

  const { data: menuItems, error: menuError } = await supabase
    .from("menu_items")
    .select(`
      *,
      menu_categories (
        id,
        name,
        display_order
      )
    `)
    .eq("available", true)

  if (!restaurant || !menuItems || menuItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Menu Not Available</CardTitle>
            <CardDescription>
              {menuError ? `Error: ${menuError.message}` : "We're having trouble loading the menu."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go Home
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const menuByCategory = menuItems.reduce((acc: Record<string, any[]>, item) => {
    const categoryName = item.menu_categories?.name || "Other"
    const displayOrder = item.menu_categories?.display_order || 999

    if (!acc[categoryName]) {
      acc[categoryName] = {
        items: [],
        displayOrder,
      }
    }
    acc[categoryName].items.push(item)
    return acc
  }, {})

  const sortedCategories = Object.entries(menuByCategory).sort(
    ([, a]: [string, any], [, b]: [string, any]) => a.displayOrder - b.displayOrder,
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-auto">
                <img
                  src="/images/shawaya-house-logo.jpg"
                  alt="Shawaya House Logo"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{restaurant.name}</h1>
                <p className="text-sm text-muted-foreground">Menu</p>
              </div>
            </div>
            <Utensils className="h-8 w-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Menu Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="space-y-8">
          {sortedCategories.map(([categoryName, categoryData]: [string, any]) => (
            <div key={categoryName} className="space-y-4">
              <h2 className="text-xl font-semibold capitalize border-b pb-2">{categoryName}</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {categoryData.items.map((item: any) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        <span className="text-lg font-bold text-primary">${Number(item.price).toFixed(2)}</span>
                      </div>
                      {item.description && <CardDescription className="text-sm">{item.description}</CardDescription>}
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-background border-t p-4">
        <div className="container mx-auto flex items-center justify-center">
          <Button variant="outline" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
