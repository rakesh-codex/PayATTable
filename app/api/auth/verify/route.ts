import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "No token provided",
        },
        { status: 401 },
      )
    }

    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired token",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      success: true,
      user,
    })
  } catch (error) {
    console.error("Verify error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Verification failed",
      },
      { status: 500 },
    )
  }
}
