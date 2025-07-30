'use server'

import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'

interface SignInState {
  error: string | null
}

export async function signIn(
  prevState: SignInState,
  formData: FormData
): Promise<SignInState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return {
      error: 'Email e senha são obrigatórios'
    }
  }

  // Credenciais hardcoded para o admin (pode ser movido para env depois)
  const ADMIN_EMAIL = 'admin@atacadocelular.com'
  const ADMIN_PASSWORD_HASH = await bcrypt.hash('admin123', 12)

  try {
    // Validar credenciais
    if (email !== ADMIN_EMAIL) {
      return {
        error: 'Credenciais inválidas'
      }
    }

    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH)
    if (!isValidPassword) {
      return {
        error: 'Credenciais inválidas'
      }
    }

    // Se chegou até aqui, as credenciais são válidas
    // Redirecionar para o dashboard admin
    redirect('/admin')
    
  } catch (error) {
    console.error('Erro no login admin:', error)
    return {
      error: 'Erro interno do servidor'
    }
  }
}