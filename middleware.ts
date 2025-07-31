import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Only process admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next()
  }
  
  const isLoginPage = pathname === "/admin/login"
  
  if (!isLoginPage) {
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