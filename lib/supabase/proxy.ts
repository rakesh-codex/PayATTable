import { NextResponse, type NextRequest } from "next/server"

// This file is kept for compatibility but not used in v0's Next.js runtime
export async function updateSession(request: NextRequest) {
  return NextResponse.next({
    request,
  })
}
