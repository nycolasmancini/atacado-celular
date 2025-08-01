'use client'

import { useState, useEffect } from 'react'

interface SiteConfig {
  id?: string
  avatarWhatsappUrl: string
  createdAt?: Date
  updatedAt?: Date
}

export default function ConfiguracoesPageTemp() {
  const [config, setConfig] = useState<SiteConfig>({
    avatarWhatsappUrl: '/images/whatsapp-avatar.svg'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold">Configurações - Teste</h1>
      </header>
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <p>Página de teste para verificar se o erro persiste</p>
            <p>URL do avatar: {config.avatarWhatsappUrl}</p>
          </div>
        </div>
      </div>
    </div>
  )
}