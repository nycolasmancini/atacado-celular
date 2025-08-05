/**
 * Funções de autenticação client-side para o painel administrativo
 * Temporárias até implementar autenticação JWT server-side completa
 */

export interface AdminUser {
  id: number
  email: string
  name: string
  role: string
}

/**
 * Obtém usuário atual do localStorage
 */
export function getCurrentAdminUser(): AdminUser | null {
  if (typeof window === 'undefined') return null
  
  try {
    const adminAuth = localStorage.getItem('admin_authenticated')
    const authTime = localStorage.getItem('admin_auth_time')
    const userData = localStorage.getItem('admin_user_data')
    
    if (adminAuth !== 'true' || !authTime || !userData) {
      return null
    }
    
    // Verificar se não expirou (24 horas)
    const authTimestamp = parseInt(authTime)
    const now = Date.now()
    const twentyFourHours = 24 * 60 * 60 * 1000
    
    if (now - authTimestamp >= twentyFourHours) {
      clearAdminAuth()
      return null
    }
    
    return JSON.parse(userData)
  } catch (error) {
    console.error('Error getting current admin user:', error)
    return null
  }
}

/**
 * Verifica se o usuário atual é administrador
 */
export function isAdmin(): boolean {
  const user = getCurrentAdminUser()
  return user?.role === 'admin'
}

/**
 * Verifica se o usuário atual é vendedor
 */
export function isSeller(): boolean {
  const user = getCurrentAdminUser()
  return user?.role === 'seller'
}

/**
 * Verifica se o usuário tem a permissão necessária
 */
export function hasAdminPermission(requiredRole: 'admin' | 'seller'): boolean {
  const user = getCurrentAdminUser()
  if (!user) return false
  
  if (requiredRole === 'admin') {
    return user.role === 'admin'
  } else if (requiredRole === 'seller') {
    return user.role === 'admin' || user.role === 'seller'
  }
  
  return false
}

/**
 * Limpa dados de autenticação do localStorage
 */
export function clearAdminAuth(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('admin_authenticated')
  localStorage.removeItem('admin_auth_time')
  localStorage.removeItem('admin_user_data')
}

/**
 * Verifica se está autenticado
 */
export function isAdminAuthenticated(): boolean {
  return getCurrentAdminUser() !== null
}