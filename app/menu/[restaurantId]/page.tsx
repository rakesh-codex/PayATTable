"use client"

import { useEffect, useState } from "react"
import { AppNavigation } from "@/components/app-navigation"
import { MenuItemCard } from "@/components/menu-item-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Restaurant {
  id: string
  name: string
  currency: string
}

interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  food_type: "veg" | "non_veg" | "beverage"
  image_url?: string
}

interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

export default function MenuPage({ params }: { params: { restaurantId: string } }) {
  const restaurantId = params.restaurantId
  const [loading, setLoading] = useState(true)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuData, setMenuData] = useState<MenuCategory[]>([])

  useEffect(() => {
    const mockRestaurant = {
      id: restaurantId,
      name: "Al Nakheel Restaurant",
      currency: "SAR",
    }

    const mockMenuData: MenuCategory[] = [
      {
        id: "cat-1",
        name: "Main Courses",
        items: [
          {
            id: "1",
            name: "Shawarma Plate",
            description: "Grilled chicken shawarma with rice and salad",
            price: 35.0,
            food_type: "non_veg" as const,
          },
          {
            id: "2",
            name: "Mixed Grill",
            description: "Assorted grilled meats with hummus",
            price: 45.0,
            food_type: "non_veg" as const,
          },
          {
            id: "3",
            name: "Falafel Wrap",
            description: "Crispy falafel in pita with tahini",
            price: 25.0,
            food_type: "veg" as const,
          },
        ],
      },
      {
        id: "cat-2",
        name: "Appetizers",
        items: [
          {
            id: "4",
            name: "Hummus",
            description: "Creamy chickpea dip with olive oil",
            price: 15.0,
            food_type: "veg" as const,
          },
          {
            id: "5",
            name: "Baba Ganoush",
            description: "Smoky eggplant dip",
            price: 18.0,
            food_type: "veg" as const,
          },
        ],
      },
      {
        id: "cat-3",
        name: "Beverages",
        items: [
          {
            id: "6",
            name: "Fresh Lemonade",
            description: "Freshly squeezed lemon juice",
            price: 10.0,
            food_type: "beverage" as const,
          },
          {
            id: "7",
            name: "Mint Tea",
            description: "Traditional Arabic mint tea",
            price: 8.0,
            food_type: "beverage" as const,
          },
        ],
      },
    ]

    setRestaurant(mockRestaurant)
    setMenuData(mockMenuData)
    setLoading(false)
  }, [restaurantId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading menu...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation title="Menu" />
        <div className="p-6">
          <div className="mx-auto max-w-2xl">
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Restaurant not found</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation title={restaurant.name} />

      <div className="container mx-auto space-y-8 px-4 py-6">
        {menuData.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-2xl">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {category.items.map((item) => (
                  <MenuItemCard key={item.id} item={item} currency={restaurant.currency} />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {menuData.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No menu items available at the moment.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
