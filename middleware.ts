import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Skip API routes, static files, and other Next.js internals
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }
  
  const isAdminRoute = pathname.startsWith("/admin")
  const isLoginPage = pathname === "/admin/login"
  
  if (isAdminRoute && !isLoginPage) {
    const token = request.cookies.get("next-auth.session-token") || 
                  request.cookies.get("__Secure-next-auth.session-token")
    
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }
  
  if (isLoginPage) {
    const token = request.cookies.get("next-auth.session-token") || 
                  request.cookies.get("__Secure-next-auth.session-token")
    
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin/:path*"
  ]
}