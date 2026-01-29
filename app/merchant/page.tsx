"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Restaurant, Table } from "@/lib/types"
import Link from "next/link"
import { AppNavigation } from "@/components/app-navigation"
import { Store, RefreshCw, FileText, UtensilsCrossed } from "lucide-react"

export default function MerchantDashboard() {
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [tables, setTables] = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string>("")

  const fetchDashboardData = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)

    try {
      const restaurantResponse = await fetch("/api/merchant/restaurant")
      if (restaurantResponse.ok) {
        const { restaurant: restaurantData } = await restaurantResponse.json()
        setRestaurant(restaurantData)
      } else {
        console.error("[v0] Failed to fetch restaurant:", restaurantResponse.status)
      }

      const tablesResponse = await fetch("/api/merchant/tables")
      if (tablesResponse.ok) {
        const { tables: tablesData } = await tablesResponse.json()
        setTables(tablesData)
      } else {
        console.error("[v0] Failed to fetch tables:", tablesResponse.status)
      }
    } catch (error) {
      console.error("[v0] Error fetching dashboard data:", error)
      setError("Failed to load dashboard data. Please refresh.")
    } finally {
      setLoading(false)
      if (showRefreshing) setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()

    const interval = setInterval(() => {
      fetchDashboardData(false)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    fetchDashboardData(true)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
      </div>
    )
  }

  if (error && !restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">{error}</p>
          <Button onClick={() => window.location.reload()}>Reload Page</Button>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p>Loading restaurant data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation title="Merchant Dashboard" />
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-auto">
              <img
                src="/images/shawaya-house-logo.jpg"
                alt="Shawaya House Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold">{restaurant.name}</h1>
              <p className="text-sm text-muted-foreground">Merchant Dashboard</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Restaurant Information</CardTitle>
            <CardDescription>Business details and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="font-medium">{restaurant.address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{restaurant.phone}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Currency</p>
                <p className="font-medium">{restaurant.currency}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">VAT Rate</p>
                <p className="font-medium">{restaurant.vat_percent}%</p>
              </div>
            </div>
            <div className="pt-4 border-t">
              <Link href="/merchant/menu/qr">
                <Button className="w-full">
                  <UtensilsCrossed className="mr-2 h-4 w-4" />
                  View Menu Card
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tables & QR Codes</CardTitle>
            <CardDescription>Manage table status and view customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            {tables.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No tables found. Please run the database seed script to create tables.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {tables.map((table) => (
                  <div
                    key={table.id}
                    className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">Table {table.table_number}</h3>
                        <Badge variant={table.status === "occupied" ? "default" : "secondary"}>
                          {table.status === "occupied" ? "Occupied" : "Available"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Capacity: {table.capacity} people • QR: {table.qr_code}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {table.status === "occupied" ? (
                        <Link href={`/customer/pay/${table.qr_code}`}>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            Order Details
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm" disabled>
                          <FileText className="mr-2 h-4 w-4" />
                          Order Details
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
