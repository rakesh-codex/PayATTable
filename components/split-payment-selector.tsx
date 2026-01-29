"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { calculateEqualSplit, TIP_PRESETS } from "@/lib/payment-utils"
import type { Order } from "@/lib/types"

interface SplitPaymentSelectorProps {
  order: Order
  currency?: string
  onConfirm: (splitData: { numPeople: number; tipPercent: number; amountToPay: number }) => void
  loading?: boolean
}

export function SplitPaymentSelector({
  order,
  currency = "SAR",
  onConfirm,
  loading = false,
}: SplitPaymentSelectorProps) {
  const [splitType, setSplitType] = useState<"full" | "equal" | "custom">("full")
  const [numPeople, setNumPeople] = useState(2)
  const [tipPercent, setTipPercent] = useState(0)
  const [customTip, setCustomTip] = useState("")

  const actualTipPercent = tipPercent === -1 ? Number.parseFloat(customTip) || 0 : tipPercent

  const getPaymentAmount = () => {
    if (splitType === "full") {
      const tipAmount = (order.subtotal * actualTipPercent) / 100
      return order.total_amount + tipAmount
    } else if (splitType === "equal") {
      const split = calculateEqualSplit(order, numPeople, actualTipPercent)
      return split.totalPerPerson
    }
    return 0
  }

  const getTotalAmount = () => {
    const tipAmount = (order.subtotal * actualTipPercent) / 100
    return order.total_amount + tipAmount
  }

  const handleConfirm = () => {
    onConfirm({
      numPeople: splitType === "equal" ? numPeople : 1,
      tipPercent: actualTipPercent,
      amountToPay: getPaymentAmount(),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Options</CardTitle>
        <CardDescription>Choose how to split the bill</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Split Method</Label>
          <RadioGroup value={splitType} onValueChange={(value: any) => setSplitType(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="full" id="full" />
              <Label htmlFor="full" className="font-normal">
                Pay Full Amount
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="equal" id="equal" />
              <Label htmlFor="equal" className="font-normal">
                Split Equally
              </Label>
            </div>
          </RadioGroup>
        </div>

        {splitType === "equal" && (
          <div className="space-y-2">
            <Label htmlFor="people">Number of People</Label>
            <Input
              id="people"
              type="number"
              min="2"
              value={numPeople}
              onChange={(e) => setNumPeople(Number.parseInt(e.target.value) || 2)}
            />
          </div>
        )}

        <Separator />

        <div className="space-y-3">
          <Label>Add Tip</Label>
          <RadioGroup value={tipPercent.toString()} onValueChange={(value) => setTipPercent(Number.parseInt(value))}>
            {TIP_PRESETS.map((preset) => (
              <div key={preset.value} className="flex items-center space-x-2">
                <RadioGroupItem value={preset.value.toString()} id={`tip-${preset.value}`} />
                <Label htmlFor={`tip-${preset.value}`} className="font-normal">
                  {preset.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {tipPercent === -1 && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="custom-tip">Custom Tip (%)</Label>
              <Input
                id="custom-tip"
                type="number"
                min="0"
                max="100"
                value={customTip}
                onChange={(e) => setCustomTip(e.target.value)}
                placeholder="Enter percentage"
              />
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-2 rounded-lg bg-muted p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Bill Amount</span>
            <span>
              {currency} {(order.subtotal || 0).toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tax (15%)</span>
            <span>
              {currency} {(order.vat_amount || 0).toFixed(2)}
            </span>
          </div>
          {actualTipPercent > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tip ({actualTipPercent}%)</span>
              <span>
                {currency} {(((order.subtotal || 0) * actualTipPercent) / 100).toFixed(2)}
              </span>
            </div>
          )}
          {splitType === "equal" && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Split Between</span>
              <span>{numPeople} people</span>
            </div>
          )}
          <Separator className="my-2" />
          <div className="flex items-center justify-between font-bold">
            <span>Total Amount</span>
            <span>
              {currency} {getTotalAmount().toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between text-lg font-bold">
            <span>You Pay</span>
            <span>
              {currency} {getPaymentAmount().toFixed(2)}
            </span>
          </div>
        </div>

        <Button onClick={handleConfirm} className="w-full" size="lg" disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </div>
          ) : (
            "Proceed to Payment"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
