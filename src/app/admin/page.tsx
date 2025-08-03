'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getCurrentUser, hasPermission } from '@/lib/auth'

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<any>(null)

  useEffect(() => {
    setCurrentUser(getCurrentUser())
  }, [])
  return (
    <div style={{ padding: '20px' }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ fontSize: '24px', marginBottom: '5px' }}>Admin Dashboard</h1>
          {currentUser && (
            <p style={{ color: '#666', margin: 0 }}>
              Bem-vindo, {currentUser.name} ({currentUser.role === 'admin' ? 'Administrador' : 'Vendedor'})
            </p>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Card Pedidos - Todos podem ver */}
        <Link href="/admin/pedidos">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
              📋
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Pedidos</h3>
            <p className="text-gray-600 text-sm">Gerenciar pedidos dos clientes</p>
          </div>
        </Link>

        {/* Cards apenas para admin */}
        {hasPermission('admin') && (
          <>
            {/* Card Produtos */}
            <Link href="/admin/produtos">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  📦
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Produtos</h3>
                <p className="text-gray-600 text-sm">Gerenciar produtos do catálogo</p>
              </div>
            </Link>

            {/* Card Categorias */}
            <Link href="/admin/categorias">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  🏷️
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Categorias</h3>
                <p className="text-gray-600 text-sm">Organizar produtos por categoria</p>
              </div>
            </Link>

            {/* Card Kits */}
            <Link href="/admin/kits">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  🎁
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Kits</h3>
                <p className="text-gray-600 text-sm">Criar e gerenciar kits de produtos</p>
              </div>
            </Link>

            {/* Card Relatórios */}
            <Link href="/admin/relatorios">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  📊
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Relatórios</h3>
                <p className="text-gray-600 text-sm">Analytics e relatórios de vendas</p>
              </div>
            </Link>

            {/* Card Configurações */}
            <Link href="/admin/configuracoes">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  ⚙️
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Configurações</h3>
                <p className="text-gray-600 text-sm">Configurar aparência e conteúdo do site</p>
              </div>
            </Link>

            {/* Card Backup */}
            <Link href="/admin/backup">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  💾
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Backup</h3>
                <p className="text-gray-600 text-sm">Backup automático e manual do sistema</p>
              </div>
            </Link>

            {/* Card Usuários */}
            <Link href="/admin/usuarios">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  👥
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Usuários</h3>
                <p className="text-gray-600 text-sm">Gerenciar usuários do sistema</p>
              </div>
            </Link>
          </>
        )}
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Sistema Funcionando</h2>
        <p>✅ Autenticação OK</p>
        <p>✅ Layout OK</p>
        <p>✅ Página OK</p>
      </div>
    </div>
  )
}