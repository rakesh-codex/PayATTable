"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AppNavigation } from "@/components/app-navigation"
import { QrCode, Smartphone } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CustomerScanPage() {
  const [qrCode, setQrCode] = useState("")
  const router = useRouter()

  const handleScan = () => {
    if (qrCode.trim()) {
      router.push(`/customer/pay/${qrCode.trim()}`)
    }
  }

  const quickDemo = () => {
    router.push("/customer/pay/QR-T1-ALNAKHEEL")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-background dark:from-green-950/20">
      <AppNavigation title="Customer Payment App" />
      <div className="container mx-auto p-6 space-y-6">
        <div className="mx-auto max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <Smartphone className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">Customer Payment</h1>
            <p className="text-muted-foreground">Scan the QR code at your table to pay</p>
          </div>

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30">
                <QrCode className="h-12 w-12 text-muted-foreground" />
              </div>
              <CardTitle>Scan QR Code</CardTitle>
              <CardDescription>Point your camera at the QR code on your table</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Or enter QR code manually:</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter QR code (e.g., QR-T1-ALNAKHEEL)"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleScan()}
                  />
                  <Button onClick={handleScan}>Go</Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent" onClick={quickDemo}>
                Try Demo Payment (Table T1)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
