import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QRCodeDisplay } from "@/components/qr-code-display"
import { AppNavigation } from "@/components/app-navigation"
import Link from "next/link"
import { Eye, Download, Share2 } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { headers } from "next/headers"

export default async function MenuQRPage() {
  const supabase = await createClient()

  const { data: restaurantData, error } = await supabase.from("restaurants").select("name").limit(1).single()

  if (error || !restaurantData) {
    console.error("[v0] Error fetching restaurant data:", error)
    return (
      <div className="min-h-screen bg-background">
        <AppNavigation title="Menu QR Code" />
        <div className="container mx-auto p-6">
          <div className="text-center space-y-4">
            <p className="text-destructive">Failed to load restaurant data</p>
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
  const restaurantName = restaurantData.name || "Restaurant"

  console.log("[v0] Menu QR Page - Current Host:", host)
  console.log("[v0] Menu QR Page - Base URL:", baseUrl)
  console.log("[v0] Menu QR Page - Menu URL:", menuUrl)

  return (
    <div className="min-h-screen bg-background">
      <AppNavigation title="Menu QR Code" />
      <div className="container mx-auto p-6">
        <div className="mx-auto max-w-lg space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle>Menu QR Code</CardTitle>
              <CardDescription>Customers scan this code to view the restaurant menu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <QRCodeDisplay value={menuUrl} restaurantName={restaurantName} description="Scan to view menu" />

              <div className="space-y-2">
                <p className="text-center text-sm font-medium">Menu URL</p>
                <code className="block rounded bg-muted p-2 text-center text-xs break-all">{menuUrl}</code>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>

              <Link href="/customer/menu" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Menu
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Button asChild variant="outline" className="w-full bg-transparent">
            <Link href="/merchant">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
