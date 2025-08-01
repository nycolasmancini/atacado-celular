import { NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const response = NextResponse.next()
  
  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Cache headers for static assets
  if (pathname.startsWith('/_next/static/') || 
      pathname.startsWith('/images/') ||
      pathname.startsWith('/icons/') ||
      pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }
  
  // Cache headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  }
  
  // Cache headers for pages
  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  }
  
  // Enable compression
  const acceptEncoding = request.headers.get('accept-encoding') || ''
  if (acceptEncoding.includes('gzip')) {
    response.headers.set('Content-Encoding', 'gzip')
  }
  
  // Admin route protection
  if (pathname.startsWith("/admin")) {
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
  }

  return response
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ]
}