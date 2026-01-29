"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Link } from "lucide-react"
import { cn } from "@/lib/utils"

export type PaymentMethod = "link"

interface PaymentMethodSelectorProps {
  onSelect: (method: PaymentMethod) => void
}

export function PaymentMethodSelector({ onSelect }: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

  const paymentMethods = [
    {
      id: "link" as PaymentMethod,
      name: "Pay by Link",
      description: "Secure payment via Geidea Payment Gateway",
      icon: Link,
      logo: "/credit-card-logo.png",
    },
  ]

  const handleSelect = (method: PaymentMethod) => {
    setSelectedMethod(method)
    onSelect(method)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>Pay securely via Geidea Payment Gateway</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {paymentMethods.map((method) => (
          <Button
            key={method.id}
            variant="outline"
            className={cn(
              "h-auto w-full justify-start gap-4 p-4 text-left",
              selectedMethod === method.id && "border-primary bg-primary/5",
            )}
            onClick={() => handleSelect(method.id)}
          >
            <method.icon className="h-5 w-5 shrink-0" />
            <div className="flex-1">
              <div className="font-semibold">{method.name}</div>
              <div className="text-xs text-muted-foreground">{method.description}</div>
            </div>
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
