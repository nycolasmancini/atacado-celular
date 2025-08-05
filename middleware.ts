import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Middleware simplificado que apenas passa as requisições adiante
  // Sem funcionalidades complexas para evitar erros de manifest
  
  const response = NextResponse.next()
  
  // Adicionar headers básicos de segurança (opcional)
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  return response
}

export const config = {
  // Matcher simplificado para evitar conflitos
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - manifest.json
     * - robots.txt
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|robots.txt|.*\\.(png|jpg|jpeg|gif|svg|ico|webp)).*)',
  ],
}