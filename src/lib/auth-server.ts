import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Configurações de segurança
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required for production security');
}
const JWT_EXPIRES_IN = '7d';
const COOKIE_NAME = 'admin-token';
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 dias em segundos

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: AuthUser;
  token?: string;
  error?: string;
}

/**
 * Gera um token JWT para o usuário
 */
export function generateToken(user: Omit<AuthUser, 'iat' | 'exp'>): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Verifica e decodifica um token JWT
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Autentica usuário com email e senha
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    // Buscar usuário no banco
    const user = await prisma.admin.findUnique({
      where: { email: credentials.email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        password: true,
        isActive: true,
        lastLoginAt: true,
      },
    });

    // Verificar se usuário existe e está ativo
    if (!user || !user.isActive) {
      return {
        success: false,
        error: 'Credenciais inválidas ou usuário inativo',
      };
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      return {
        success: false,
        error: 'Credenciais inválidas',
      };
    }

    // Atualizar último login
    await prisma.admin.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Gerar token
    const userForToken = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = generateToken(userForToken);

    return {
      success: true,
      user: userForToken,
      token,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      success: false,
      error: 'Erro interno do servidor',
    };
  }
}

/**
 * Define cookie de autenticação
 */
export function setAuthCookie(token: string) {
  const cookieStore = cookies();
  
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

/**
 * Remove cookie de autenticação
 */
export function clearAuthCookie() {
  const cookieStore = cookies();
  
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Obtém token do cookie
 */
export function getTokenFromCookies(): string | null {
  const cookieStore = cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  
  return cookie?.value || null;
}

/**
 * Obtém token do cabeçalho Authorization ou cookie
 */
export function getTokenFromRequest(request: NextRequest): string | null {
  // Primeiro tenta pegar do header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Se não encontrar, tenta pegar do cookie
  const cookie = request.cookies.get(COOKIE_NAME);
  return cookie?.value || null;
}

/**
 * Verifica se o usuário está autenticado
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const token = getTokenFromCookies();
    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    // Verificar se o usuário ainda existe e está ativo
    const user = await prisma.admin.findFirst({
      where: {
        id: decoded.id,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user || null;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Middleware de autenticação para API routes
 */
export async function requireAuth(request: NextRequest): Promise<AuthUser | null> {
  const token = getTokenFromRequest(request);
  
  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return null;
  }

  // Verificar se o usuário ainda existe e está ativo
  try {
    const user = await prisma.admin.findFirst({
      where: {
        id: decoded.id,
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return user || null;
  } catch (error) {
    console.error('Auth middleware error:', error);
    return null;
  }
}

/**
 * Middleware de autorização para admins
 */
export async function requireAdmin(request: NextRequest): Promise<AuthUser | null> {
  const user = await requireAuth(request);
  
  if (!user || user.role !== 'admin') {
    return null;
  }

  return user;
}

/**
 * Middleware de autorização para admins e vendedores
 */
export async function requireAdminOrSeller(request: NextRequest): Promise<AuthUser | null> {
  try {
    console.log('requireAdminOrSeller: Starting authentication check');
    const user = await requireAuth(request);
    console.log('requireAdminOrSeller: requireAuth result:', user ? `User ${user.email} (${user.role})` : 'null');
    
    if (!user || (user.role !== 'admin' && user.role !== 'seller')) {
      console.log('requireAdminOrSeller: Access denied - user not found or invalid role');
      return null;
    }

    console.log('requireAdminOrSeller: Access granted');
    return user;
  } catch (error) {
    console.error('requireAdminOrSeller: Error during authentication', error);
    return null;
  }
}

/**
 * Utilitário para criar resposta de erro de autenticação
 */
export function createAuthError(message: string = 'Não autorizado', status: number = 401) {
  return new Response(
    JSON.stringify({ 
      error: message,
      code: 'UNAUTHORIZED',
      timestamp: new Date().toISOString(),
    }),
    { 
      status,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}

/**
 * Hash da senha para armazenamento seguro
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Valida força da senha
 */
export function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Senha deve ter pelo menos 8 caracteres');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra maiúscula');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Senha deve conter pelo menos uma letra minúscula');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Senha deve conter pelo menos um número');
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Senha deve conter pelo menos um caractere especial');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}