import type { Order } from "@/lib/types"

export interface SplitPaymentResult {
  amountPerPerson: number
  taxPerPerson: number
  totalPerPerson: number
}

export function calculateEqualSplit(order: Order, numPeople: number, tipPercent = 0): SplitPaymentResult {
  const tipAmount = (order.subtotal * tipPercent) / 100
  const totalWithTip = order.total_amount + tipAmount

  return {
    amountPerPerson: order.subtotal / numPeople,
    taxPerPerson: order.tax_amount / numPeople,
    totalPerPerson: totalWithTip / numPeople,
  }
}

export interface CustomSplitInput {
  amount: number
  tipPercent?: number
}

export function calculateCustomSplit(subtotal: number, taxRate: number, splits: CustomSplitInput[]) {
  return splits.map((split) => {
    const taxAmount = (split.amount * taxRate) / 100
    const tipAmount = split.tipPercent ? (split.amount * split.tipPercent) / 100 : 0
    return {
      amount: split.amount,
      taxAmount,
      tipAmount,
      total: split.amount + taxAmount + tipAmount,
    }
  })
}

export interface ItemSplitInput {
  itemId: string
  quantity: number
  unitPrice: number
}

export function calculateItemBasedSplit(items: ItemSplitInput[], taxRate: number, tipPercent = 0) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  const taxAmount = (subtotal * taxRate) / 100
  const tipAmount = (subtotal * tipPercent) / 100

  return {
    subtotal,
    taxAmount,
    tipAmount,
    total: subtotal + taxAmount + tipAmount,
    items,
  }
}

export const TIP_PRESETS = [
  { label: "No Tip", value: 0 },
  { label: "10%", value: 10 },
  { label: "15%", value: 15 },
  { label: "20%", value: 20 },
  { label: "Custom", value: -1 },
]
