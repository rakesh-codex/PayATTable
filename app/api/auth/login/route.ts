import { NextResponse } from "next/server"
import { createToken } from "@/lib/auth"

const VALID_CREDENTIALS = {
  email: "rakesh@gmail.com",
  password: "P@y@#table123!!",
  name: "Rakesh Kumar",
  role: "admin" as const,
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Validate credentials
    if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
      // Create JWT token
      const token = await createToken({
        email: VALID_CREDENTIALS.email,
        name: VALID_CREDENTIALS.name,
        role: VALID_CREDENTIALS.role,
      })

      return NextResponse.json({
        success: true,
        token,
        user: {
          email: VALID_CREDENTIALS.email,
          name: VALID_CREDENTIALS.name,
          role: VALID_CREDENTIALS.role,
        },
      })
    }

    return NextResponse.json(
      {
        success: false,
        message: "Invalid email or password",
      },
      { status: 401 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Authentication failed",
      },
      { status: 500 },
    )
  }
}
