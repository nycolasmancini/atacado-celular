'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, hasPermission } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'seller'
  fallbackMessage?: string
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'seller',
  fallbackMessage = 'Você não tem permissão para acessar esta página.'
}: ProtectedRouteProps) {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    
    if (!user) {
      router.push('/admin/login')
      return
    }

    const authorized = hasPermission(requiredRole)
    setIsAuthorized(authorized)

    if (!authorized && requiredRole === 'admin') {
      // Se não tem permissão e é rota de admin, redirecionar para dashboard
      router.push('/admin')
    }
  }, [requiredRole, router])

  if (isAuthorized === null) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permissões...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-6xl mb-4">🚫</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Acesso Negado</h2>
        <p className="text-gray-600 mb-6">{fallbackMessage}</p>
        <button
          onClick={() => router.push('/admin')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Voltar ao Dashboard
        </button>
      </div>
    )
  }

  return <>{children}</>
}