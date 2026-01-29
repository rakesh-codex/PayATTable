"use client"

import { useState, useEffect } from "react"
import type { Order, Restaurant, Table } from "@/lib/types"
import { OrderSummary } from "@/components/order-summary"
import { SplitPaymentSelector } from "@/components/split-payment-selector"
import { PaymentTransactionTable } from "@/components/payment-transaction-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ExternalLink, Smartphone } from "lucide-react"

interface SimplePaymentProps {
  order: Order & { items: any[] }
  restaurant: Restaurant
  table: Table
}

type Step = "review" | "split" | "link" | "success"

export function SimplePayment({ order, restaurant, table }: SimplePaymentProps) {
  const [step, setStep] = useState<Step>("review")
  const [paymentData, setPaymentData] = useState<{
    numPeople: number
    tipPercent: number
    amountToPay: number
    paymentId: string
  } | null>(null)
  const [paymentLink, setPaymentLink] = useState("")
  const [loading, setLoading] = useState(false)
  const [paymentSplits, setPaymentSplits] = useState<any[]>([])
  const [currentSplitNumber, setCurrentSplitNumber] = useState(1)
  const [totalSplits, setTotalSplits] = useState(1)
  const [existingPaymentConfig, setExistingPaymentConfig] = useState<any>(null)
  const [transactionId, setTransactionId] = useState<string>("")

  useEffect(() => {
    checkExistingPayment()
  }, [order.id])

  const checkExistingPayment = async () => {
    try {
      const response = await fetch(`/api/payments/check?orderId=${order.id}`)
      const data = await response.json()

      if (data.success && data.payment) {
        setExistingPaymentConfig(data.payment)
        setTransactionId(data.payment.transaction_id || "")
        const completedSplits = data.payment.splits?.filter((s: any) => s.status === "completed").length || 0

        if (data.payment.num_people > 1 && completedSplits < data.payment.num_people) {
          setCurrentSplitNumber(completedSplits + 1)
          setTotalSplits(data.payment.num_people)
          setPaymentSplits(data.payment.splits || [])

          // Calculate amount per person
          const amountPerPerson = data.payment.amount / data.payment.num_people

          setPaymentData({
            numPeople: data.payment.num_people,
            tipPercent: data.payment.tip_percent || 0,
            amountToPay: amountPerPerson,
            paymentId: data.payment.id,
          })

          // Generate payment link
          const link = `https://payment.geidea.com/pay?paymentId=${data.payment.id}&amount=${amountPerPerson}&currency=${restaurant.currency}&merchantId=alnakheel&orderId=${order.order_number}`
          setPaymentLink(link)

          setStep("link")
        }
      }
    } catch (error) {
      console.error("Error checking existing payment:", error)
    }
  }

  useEffect(() => {
    if (paymentData?.paymentId) {
      fetchPaymentSplits(paymentData.paymentId)
    }
  }, [paymentData])

  const fetchPaymentSplits = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}/splits`)
      const data = await response.json()
      if (data.success) {
        setPaymentSplits(data.splits)
      }
    } catch (error) {
      console.error("Error fetching payment splits:", error)
    }
  }

  const handleProceedToSplit = () => {
    setStep("split")
  }

  const handleConfirmSplit = async (splitData: { numPeople: number; tipPercent: number; amountToPay: number }) => {
    setLoading(true)

    try {
      setTotalSplits(splitData.numPeople)

      const response = await fetch("/api/payments/create-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: order.id,
          amount: splitData.amountToPay,
          tipPercent: splitData.tipPercent,
          numPeople: splitData.numPeople,
        }),
      })

      const data = await response.json()

      if (data.success) {
        setTransactionId(data.transactionId)

        setPaymentData({
          ...splitData,
          amountToPay: data.amount,
          paymentId: data.paymentId,
        })
        setPaymentLink(data.paymentLink)
        setCurrentSplitNumber((data.existingSplits || 0) + 1)
        setStep("link")
      } else {
        console.error("Failed to create payment link:", data.error)
        alert("Failed to create payment link. Please try again.")
      }
    } catch (error) {
      console.error("Error creating payment link:", error)
      alert("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentComplete = async () => {
    if (!paymentData) return

    setLoading(true)

    try {
      const response = await fetch("/api/payments/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: paymentData.paymentId,
          gatewayTransactionId: `TRX-${Date.now()}`,
          amount: paymentData.amountToPay,
        }),
      })

      const data = await response.json()

      if (data.success) {
        await fetchPaymentSplits(paymentData.paymentId)

        if (data.isFullyPaid) {
          setStep("success")
        } else {
          const nextSplitNumber = currentSplitNumber + 1
          setCurrentSplitNumber(nextSplitNumber)
        }
      } else {
        console.error("Failed to complete payment:", data.error)
        alert("Failed to complete payment. Please try again.")
      }
    } catch (error) {
      console.error("Error completing payment:", error)
      alert("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-lg border bg-background/95 p-4 shadow-sm backdrop-blur">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-green-600" />
            <div>
              <h1 className="text-lg font-bold">{restaurant.name}</h1>
              <p className="text-sm text-muted-foreground">
                Table {table.table_number} • Order {order.order_number}
              </p>
            </div>
          </div>
        </div>

        {step === "review" && (
          <div className="space-y-6">
            <OrderSummary order={order} currency={restaurant.currency} />
            <Button onClick={handleProceedToSplit} className="w-full bg-green-600 hover:bg-green-700" size="lg">
              Proceed to Payment
            </Button>
          </div>
        )}

        {step === "split" && (
          <SplitPaymentSelector
            order={order}
            currency={restaurant.currency}
            onConfirm={handleConfirmSplit}
            loading={loading}
          />
        )}

        {step === "link" && paymentData && (
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2 rounded-lg bg-muted p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bill Amount</span>
                    <span>
                      {restaurant.currency} {(order.subtotal || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tax (15%)</span>
                    <span>
                      {restaurant.currency} {(order.vat_amount || 0).toFixed(2)}
                    </span>
                  </div>
                  {paymentData.tipPercent > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tip ({paymentData.tipPercent}%)</span>
                      <span>
                        {restaurant.currency} {(((order.subtotal || 0) * paymentData.tipPercent) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                  {paymentData.numPeople > 1 && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Split Between</span>
                      <span>{paymentData.numPeople} people</span>
                    </div>
                  )}
                  <div className="h-px bg-border my-2" />
                  <div className="flex items-center justify-between font-bold">
                    <span>Total Amount</span>
                    <span>
                      {restaurant.currency}{" "}
                      {(order.total_amount + ((order.subtotal || 0) * paymentData.tipPercent) / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>You Pay</span>
                    <span>
                      {restaurant.currency} {paymentData.amountToPay.toFixed(2)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                  <ExternalLink className="h-6 w-6 text-green-600" />
                </div>
                {totalSplits > 1 && (
                  <div className="mb-4">
                    <h2 className="text-3xl font-bold">
                      Split Payment {currentSplitNumber}/{totalSplits}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {paymentSplits.filter((s) => s.status === "completed").length} of {totalSplits} payments completed
                    </p>
                  </div>
                )}
                <CardTitle>Complete Payment</CardTitle>
                <CardDescription>Click the link below to pay securely via Geidea</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border bg-muted/50 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Amount to Pay</p>
                  <p className="text-3xl font-bold">
                    {restaurant.currency} {paymentData.amountToPay.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handlePaymentComplete}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                    disabled={loading}
                    asChild={!loading}
                  >
                    {loading ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Processing...</span>
                        </div>
                      </>
                    ) : (
                      <a href={paymentLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Open Payment Link
                      </a>
                    )}
                  </Button>

                  <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4">
                    <div className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white flex-shrink-0">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-green-900 dark:text-green-100">Secure Payment</p>
                        <p className="text-green-700 dark:text-green-300">
                          You'll be redirected to Geidea's secure payment gateway. No card details are stored on our
                          servers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-center text-xs text-muted-foreground">
                    Payment ID: <code className="text-xs">{paymentData.paymentId}</code>
                  </p>
                </div>
              </CardContent>
            </Card>

            <PaymentTransactionTable
              splits={paymentSplits}
              currency={restaurant.currency}
              orderId={order.id}
              transactionId={transactionId}
            />
          </div>
        )}

        {step === "success" && (
          <div className="space-y-6">
            <Card className="border-green-500/20 bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Paid</span>
                    <span className="font-semibold">
                      {restaurant.currency}{" "}
                      {paymentSplits
                        .filter((s) => s.status === "completed")
                        .reduce((sum, s) => sum + Number(s.amount), 0)
                        .toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Amount</span>
                    <span className="font-semibold">
                      {restaurant.currency} {paymentData?.amountToPay.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-semibold text-green-600">Fully paid</span>
                  </div>
                  {totalSplits > 1 && (
                    <div className="flex items-center justify-between pt-2 border-t">
                      <span className="text-lg font-bold">Split Status</span>
                      <span className="text-lg font-bold text-green-600">
                        {totalSplits}/{totalSplits} done
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-2xl text-green-600">Payment Completed!</CardTitle>
                <CardDescription>Thank you for your payment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Your payment has been processed successfully. The table is now available.
                </p>
                <Button onClick={() => (window.location.href = "/customer/menu")} variant="outline" className="w-full">
                  View Menu
                </Button>
              </CardContent>
            </Card>

            <PaymentTransactionTable
              splits={paymentSplits}
              currency={restaurant.currency}
              orderId={order.id}
              transactionId={transactionId}
            />
          </div>
        )}
      </div>
    </div>
  )
}
