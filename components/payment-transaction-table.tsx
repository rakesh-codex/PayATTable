import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle } from "lucide-react"

interface PaymentSplit {
  id: string
  amount: number
  status: string
  gateway_transaction_id: string | null
  created_at: string
}

interface PaymentTransactionTableProps {
  splits: PaymentSplit[]
  currency: string
  orderId: string
  transactionId?: string // Add transaction ID to display in description
}

export function PaymentTransactionTable({ splits, currency, orderId, transactionId }: PaymentTransactionTableProps) {
  const getStatusBadge = (status: string) => {
    if (status === "completed") {
      return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Approved</Badge>
    } else if (status === "failed") {
      return <Badge variant="destructive">Declined</Badge>
    }
    return <Badge variant="secondary">Pending</Badge>
  }

  const getResultIcon = (status: string) => {
    if (status === "completed") {
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    } else if (status === "failed") {
      return <XCircle className="h-4 w-4 text-red-600" />
    }
    return null
  }

  const getBalance = (index: number) => {
    const completedBefore = splits
      .slice(0, index + 1)
      .filter((s) => s.status === "completed")
      .reduce((sum, s) => sum + Number(s.amount), 0)

    const totalAmount = splits.reduce((sum, s) => sum + Number(s.amount), 0)
    return Math.max(0, totalAmount - completedBefore)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Transaction Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>TRX Id</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {splits.map((split, index) => (
                <TableRow key={split.id}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-mono text-xs">{transactionId || "Order# Payment"}</TableCell>
                  <TableCell>
                    {currency} {Number(split.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="font-mono text-xs">{split.gateway_transaction_id || "-"}</TableCell>
                  <TableCell>Card</TableCell>
                  <TableCell>
                    {split.status === "completed" ? "000" : split.status === "failed" ? "404" : "-"}
                  </TableCell>
                  <TableCell>{getStatusBadge(split.status)}</TableCell>
                  <TableCell>
                    {currency} {getBalance(index).toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getResultIcon(split.status)}
                      <span className="text-sm">
                        {split.status === "completed" ? "Success" : split.status === "failed" ? "Failed" : "Pending"}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
