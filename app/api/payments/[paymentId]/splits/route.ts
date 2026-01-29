import { NextResponse } from "next/server"
import { getPaymentSplits } from "@/lib/supabase/queries"

export async function GET(request: Request, { params }: { params: Promise<{ paymentId: string }> }) {
  try {
    const { paymentId } = await params
    const splits = await getPaymentSplits(paymentId)

    return NextResponse.json({ success: true, splits })
  } catch (error) {
    console.error("[v0] Error fetching payment splits:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch payment splits" }, { status: 500 })
  }
}
