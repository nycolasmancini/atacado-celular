import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, createAuthError } from '@/lib/auth-server';

/**
 * Middleware para proteger rotas que exigem autenticação
 */
export async function withAuth(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>,
  adminOnly: boolean = false
) {
  return async (request: NextRequest) => {
    try {
      // Verificar autenticação
      const user = adminOnly 
        ? await requireAdmin(request)
        : await requireAuth(request);

      if (!user) {
        const message = adminOnly 
          ? 'Acesso negado. Apenas administradores têm permissão.'
          : 'Acesso negado. Autenticação necessária.';
        
        return createAuthError(message, adminOnly ? 403 : 401);
      }

      // Chamar handler com usuário autenticado
      return await handler(request, user);

    } catch (error) {
      console.error('Auth middleware error:', error);
      
      return NextResponse.json(
        { 
          error: 'Erro interno do servidor',
          code: 'INTERNAL_ERROR'
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Middleware específico para rotas de admin
 */
export function withAdminAuth(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>
) {
  return withAuth(handler, true);
}

/**
 * Middleware para rate limiting básico
 */
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>,
  maxRequests: number = 10,
  windowMs: number = 60000 // 1 minuto
) {
  return async (request: NextRequest) => {
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';

    const now = Date.now();
    const key = `${clientIP}:${request.nextUrl.pathname}`;
    
    const requestInfo = requestCounts.get(key);
    
    if (!requestInfo || now > requestInfo.resetTime) {
      // Nova janela de tempo
      requestCounts.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
    } else {
      // Incrementar contador
      requestInfo.count++;
      
      if (requestInfo.count > maxRequests) {
        return NextResponse.json(
          { 
            error: 'Muitas tentativas. Tente novamente em alguns minutos.',
            code: 'RATE_LIMIT_EXCEEDED'
          },
          { status: 429 }
        );
      }
    }

    return await handler(request);
  };
}

/**
 * Middleware combinado: rate limiting + auth
 */
export function withRateLimitAndAuth(
  handler: (request: NextRequest, user: any) => Promise<NextResponse>,
  adminOnly: boolean = false,
  maxRequests: number = 10,
  windowMs: number = 60000
) {
  return withRateLimit(
    withAuth(handler, adminOnly),
    maxRequests,
    windowMs
  );
}