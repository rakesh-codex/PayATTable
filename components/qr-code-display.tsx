"use client"

import { Download, Share2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

interface QRCodeDisplayProps {
  value: string // The URL or data to encode in the QR code
  restaurantName: string
  tableNumber: string
  title?: string
  description?: string
}

export function QRCodeDisplay({ value, restaurantName, tableNumber, title, description }: QRCodeDisplayProps) {
  const [qrImageUrl, setQrImageUrl] = useState<string>("")

  useEffect(() => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(value)}`
    setQrImageUrl(qrUrl)
  }, [value])

  const handleDownload = async () => {
    if (!qrImageUrl) return

    try {
      const response = await fetch(qrImageUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `table-${tableNumber}-qr.png`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error downloading QR code:", error)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${restaurantName} - Table ${tableNumber}`,
          text: description || "Scan this QR code",
          url: value,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      navigator.clipboard.writeText(value)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg border-4 border-border bg-white p-4">
          {qrImageUrl ? (
            <img
              src={qrImageUrl || "/placeholder.svg"}
              alt={`QR Code for Table ${tableNumber}`}
              className="h-[300px] w-[300px]"
            />
          ) : (
            <div className="flex h-[300px] w-[300px] items-center justify-center bg-gray-100">
              <p className="text-sm text-gray-500">Generating QR Code...</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-sm font-medium">{restaurantName}</p>
          <p className="text-xs text-muted-foreground">{description || "Scan to continue"}</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
    </div>
  )
}
