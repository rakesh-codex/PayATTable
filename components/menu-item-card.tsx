import type { MenuItem } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Drumstick, Coffee } from "lucide-react"

interface MenuItemCardProps {
  item: MenuItem
  currency?: string
}

export function MenuItemCard({ item, currency = "SAR" }: MenuItemCardProps) {
  const getFoodTypeIcon = () => {
    switch (item.food_type) {
      case "veg":
        return <Leaf className="h-4 w-4 text-green-600" />
      case "non-veg":
        return <Drumstick className="h-4 w-4 text-red-600" />
      case "beverage":
        return <Coffee className="h-4 w-4 text-blue-600" />
    }
  }

  const getFoodTypeBadge = () => {
    switch (item.food_type) {
      case "veg":
        return (
          <Badge variant="outline" className="border-green-600 text-green-600">
            Vegetarian
          </Badge>
        )
      case "non-veg":
        return (
          <Badge variant="outline" className="border-red-600 text-red-600">
            Non-Vegetarian
          </Badge>
        )
      case "beverage":
        return (
          <Badge variant="outline" className="border-blue-600 text-blue-600">
            Beverage
          </Badge>
        )
    }
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {getFoodTypeIcon()}
              <CardTitle className="text-lg">{item.name}</CardTitle>
            </div>
            {item.description && <CardDescription className="mt-1 line-clamp-2">{item.description}</CardDescription>}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {currency} {item.price.toFixed(2)}
          </span>
          {getFoodTypeBadge()}
        </div>
        {item.preparation_time && (
          <p className="mt-2 text-xs text-muted-foreground">Prep time: ~{item.preparation_time} mins</p>
        )}
      </CardContent>
    </Card>
  )
}
