import { createServerClient } from "@/lib/supabase/server"
import { ArrowLeft, UtensilsCrossed } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MenuItem {
  id: string
  name: string
  description: string | null
  price: string
  available: boolean
  category_name: string
  display_order: number
}

interface MenuCategory {
  category_name: string
  display_order: number
  items: MenuItem[]
}

async function getMenuData() {
  const supabase = await createServerClient()

  // Get restaurant info
  const { data: restaurant } = await supabase.from("restaurants").select("name, currency").single()

  // Get menu items with categories
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select(`
      id,
      name,
      description,
      price,
      available,
      category:menu_categories(name, display_order)
    `)
    .eq("available", true)
    .order("name")

  // Group items by category
  const categorizedMenu: Record<string, MenuCategory> = {}

  menuItems?.forEach((item: any) => {
    const categoryName = item.category?.name || "Other"
    const displayOrder = item.category?.display_order || 999

    if (!categorizedMenu[categoryName]) {
      categorizedMenu[categoryName] = {
        category_name: categoryName,
        display_order: displayOrder,
        items: [],
      }
    }

    categorizedMenu[categoryName].items.push({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      available: item.available,
      category_name: categoryName,
      display_order: displayOrder,
    })
  })

  // Sort categories by display order
  const sortedCategories = Object.values(categorizedMenu).sort((a, b) => a.display_order - b.display_order)

  return {
    restaurant,
    categories: sortedCategories,
  }
}

export default async function MenuPage() {
  const { restaurant, categories } = await getMenuData()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/merchant">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <UtensilsCrossed className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">{restaurant?.name || "Restaurant"} Menu</h1>
                <p className="text-sm text-muted-foreground">
                  {categories.reduce((sum, cat) => sum + cat.items.length, 0)} items available
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Menu Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-8">
          {categories.map((category) => (
            <section key={category.category_name}>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-foreground">{category.category_name}</h2>
                <p className="text-sm text-muted-foreground">
                  {category.items.length} {category.items.length === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{item.name}</CardTitle>
                          {item.description && (
                            <CardDescription className="mt-1 line-clamp-2">{item.description}</CardDescription>
                          )}
                        </div>
                        {item.available && (
                          <Badge variant="secondary" className="ml-2 shrink-0">
                            Available
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          {Number(item.price).toFixed(2)} {restaurant?.currency || "SAR"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}

          {categories.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">No menu items available</p>
                <p className="text-sm text-muted-foreground">Add items to your menu to get started</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
