'use client'

import { useState, useEffect } from 'react'

export default function AdminLogin() {
  const [error, setError] = useState('')

  // Verificar se já está autenticado e redirecionar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const adminAuth = localStorage.getItem('admin_authenticated');
      const authTime = localStorage.getItem('admin_auth_time');
      
      if (adminAuth === 'true' && authTime) {
        const authTimestamp = parseInt(authTime);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        if (now - authTimestamp < twentyFourHours) {
          console.log('Already authenticated, redirecting to /admin');
          window.location.href = '/admin';
        }
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        // Armazenar dados do usuário no localStorage
        localStorage.setItem('admin_authenticated', 'true')
        localStorage.setItem('admin_auth_time', Date.now().toString())
        localStorage.setItem('admin_user_data', JSON.stringify(data.user))
        
        window.location.href = '/admin'
      } else {
        setError(data.error || 'Erro ao fazer login')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Erro de conexão')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f9fafb' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '32px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '0 0 8px 0' }}>Admin Login</h1>
          <p style={{ color: '#6b7280', margin: 0 }}>Digite suas credenciais</p>
        </div>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Email</label>
            <input
              type="email"
              name="email"
              placeholder="admin@atacado-celular.com"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
              required
            />
          </div>
          
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>Senha</label>
            <input
              type="password"
              name="password"
              placeholder="admin123"
              style={{ width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
              required
            />
          </div>

          {error && (
            <div style={{ padding: '12px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px' }}>
              <p style={{ color: '#dc2626', fontSize: '14px', margin: 0 }}>{error}</p>
            </div>
          )}
          
          <button
            type="submit"
            style={{ width: '100%', background: '#2563eb', color: 'white', padding: '12px 16px', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: '500', cursor: 'pointer' }}
          >
            Entrar
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
          <p style={{ margin: '8px 0', fontWeight: '500' }}>Credenciais de Teste:</p>
          <div style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', marginBottom: '8px' }}>
            <p style={{ margin: '2px 0', fontWeight: '500' }}>👑 Administrador:</p>
            <p style={{ margin: '2px 0' }}>📧 admin@atacado-celular.com</p>
            <p style={{ margin: '2px 0' }}>🔑 admin123</p>
          </div>
        </div>
      </div>
    </div>
  )
}