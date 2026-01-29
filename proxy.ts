import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export default async function proxy(request: NextRequest) {
  // In v0's Next.js runtime, environment variables may not be accessible in middleware
  // Authentication checks are handled at the page/component level instead
  // Simply allow all requests to pass through
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
