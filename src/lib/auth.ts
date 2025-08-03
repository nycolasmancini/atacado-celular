interface AdminUser {
  id: number
  email: string
  name: string
  role: string
}

export function getCurrentUser(): AdminUser | null {
  if (typeof window === 'undefined') return null
  
  const userData = localStorage.getItem('admin_user_data')
  if (!userData) return null
  
  try {
    return JSON.parse(userData)
  } catch {
    return null
  }
}

export function setCurrentUser(user: AdminUser): void {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('admin_user_data', JSON.stringify(user))
  localStorage.setItem('admin_authenticated', 'true')
  localStorage.setItem('admin_auth_time', Date.now().toString())
}

export function clearCurrentUser(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('admin_user_data')
  localStorage.removeItem('admin_authenticated')
  localStorage.removeItem('admin_auth_time')
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === 'admin'
}

export function isSeller(): boolean {
  const user = getCurrentUser()
  return user?.role === 'seller'
}

export function hasPermission(requiredRole: 'admin' | 'seller'): boolean {
  const user = getCurrentUser()
  if (!user) return false
  
  if (requiredRole === 'seller') {
    return user.role === 'admin' || user.role === 'seller'
  }
  
  return user.role === 'admin'
}