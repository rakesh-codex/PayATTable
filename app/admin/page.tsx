"use client"

import { useEffect, useState } from "react"
import { AppNavigation } from "@/components/app-navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { QrCode, Eye } from "lucide-react"
import Link from "next/link"

interface Restaurant {
  id: string
  name: string
  address: string
  phone: string
  currency: string
}

interface Table {
  id: string
  table_number: number
  capacity: number
  status: "available" | "occupied" | "reserved" | "cleaning"
  qr_code: string
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [tables, setTables] = useState<Table[]>([])

  useEffect(() => {
    const mockRestaurant = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Al Nakheel Restaurant",
      address: "King Fahd Road, Riyadh, Saudi Arabia",
      phone: "+966 11 123 4567",
      currency: "SAR",
    }

    const mockTables: Table[] = [
      {
        id: "550e8400-e29b-41d4-a716-446655440001",
        table_number: 1,
        capacity: 4,
        status: "occupied",
        qr_code: "QR-T1-ALNAKHEEL",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440002",
        table_number: 2,
        capacity: 2,
        status: "available",
        qr_code: "QR-T2-ALNAKHEEL",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440003",
        table_number: 3,
        capacity: 6,
        status: "reserved",
        qr_code: "QR-T3-ALNAKHEEL",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440004",
        table_number: 4,
        capacity: 4,
        status: "available",
        qr_code: "QR-T4-ALNAKHEEL",
      },
      {
        id: "550e8400-e29b-41d4-a716-446655440005",
        table_number: 5,
        capacity: 8,
        status: "cleaning",
        qr_code: "QR-T5-ALNAKHEEL",
      },
    ]

    setRestaurant(mockRestaurant)
    setTables(mockTables)
    setLoading(false)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500"
      case "occupied":
        return "bg-red-500"
      case "reserved":
        return "bg-yellow-500"
      case "cleaning":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!restaurant) {
    return <div className="p-8">Restaurant not found</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation title="Admin Dashboard" showBack={false} />

      <div className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p className="text-muted-foreground">{restaurant.address}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Table Management</CardTitle>
              <CardDescription>Monitor and manage restaurant tables</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tables.map((table) => (
                  <Card key={table.id} className="relative">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl">Table {table.table_number}</CardTitle>
                        <Badge className={getStatusColor(table.status)}>{table.status}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">Capacity: {table.capacity} people</p>
                          <p className="text-xs font-mono text-muted-foreground">{table.qr_code}</p>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <Link href={`/admin/tables/${table.id}/qr`}>
                              <QrCode className="mr-2 h-4 w-4" />
                              View QR
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                            <Link href={`/pay/${table.qr_code}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
