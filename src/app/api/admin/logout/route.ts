import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookie, getCurrentUser } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    // Obter usuário atual para logging
    const currentUser = await getCurrentUser();
    
    if (currentUser) {
      console.log(`User logout - ${currentUser.name} (${currentUser.email})`);
    }

    // Limpar cookie de autenticação
    clearAuthCookie();

    return NextResponse.json({
      success: true,
      message: 'Logout realizado com sucesso'
    });

  } catch (error) {
    console.error('Logout endpoint error:', error);
    
    // Mesmo com erro, limpar o cookie
    clearAuthCookie();
    
    return NextResponse.json({
      success: true,
      message: 'Logout realizado'
    });
  }
}