"use client"

import { useEffect, useState } from "react"
import { AppNavigation } from "@/components/app-navigation"
import { QRCodeDisplay } from "@/components/qr-code-display"

interface PageProps {
  params: {
    tableId: string
  }
}

export default function TableQRPage({ params }: PageProps) {
  const [table, setTable] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock table data - in production this would fetch from the database
    const mockTable = {
      id: params.tableId,
      table_number: 1,
      qr_code: "QR-T1-ALNAKHEEL",
      restaurant: {
        name: "Al Nakheel Restaurant",
      },
    }

    setTable(mockTable)
    setLoading(false)
  }, [params.tableId])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!table) {
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation title="QR Code" />
        <div className="p-8">Table not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation title={`Table ${table.table_number} QR Code`} />

      <div className="p-6">
        <div className="mx-auto max-w-2xl">
          <QRCodeDisplay
            qrCode={table.qr_code}
            tableNumber={table.table_number}
            restaurantName={table.restaurant.name}
          />
        </div>
      </div>
    </div>
  )
}
