'use client'

import { useState, useEffect } from 'react'
// Temporariamente comentado para debug
// import { AdminHeader } from '@/components/admin/AdminHeader' 
// import ImageUpload from '@/components/admin/ImageUpload'

interface SiteConfig {
  id?: string
  avatarWhatsappUrl: string
  createdAt?: Date
  updatedAt?: Date
}

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<SiteConfig>({
    avatarWhatsappUrl: '/images/whatsapp-avatar.svg'
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch('/api/config')
      if (response.ok) {
        const data = await response.json()
        setConfig(data)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      })

      if (response.ok) {
        setMessage('Configurações salvas com sucesso!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        setMessage('Erro ao salvar configurações')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      setMessage('Erro ao salvar configurações')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = (url: string) => {
    setConfig(prev => ({
      ...prev,
      avatarWhatsappUrl: url
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminHeader />
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* <AdminHeader /> */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-xl font-bold">Configurações - Debug</h1>
      </header>
      
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Configurações do Site</h1>
            <p className="text-gray-600 mt-2">
              Gerencie as configurações visuais e de conteúdo do site
            </p>
          </div>

          <div className="p-6 space-y-8">
            {/* Avatar WhatsApp Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Avatar da Seção "Não encontrou o kit ideal?"
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Esta imagem aparece na seção final dos kits. Recomendado: formato quadrado, 200x200px
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Preview atual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview Atual
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-green-400 relative overflow-hidden">
                      <img 
                        src={config.avatarWhatsappUrl} 
                        alt="Avatar WhatsApp" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = '/images/whatsapp-avatar.svg'
                        }}
                      />
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white"></div>
                    </div>
                    <p className="text-sm text-gray-500">Como aparece no site</p>
                  </div>
                </div>

                {/* Upload de nova imagem */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alterar Imagem
                  </label>
                  {/* Temporariamente comentado para debug */}
                  {/* <ImageUpload
                    value={config.avatarWhatsappUrl}
                    onChange={handleImageUpload}
                  /> */}
                  <p>ImageUpload temporariamente desabilitado para debug</p>
                </div>
              </div>

              {/* URL manual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL da Imagem (opcional)
                </label>
                <input
                  type="url"
                  value={config.avatarWhatsappUrl}
                  onChange={(e) => setConfig(prev => ({ ...prev, avatarWhatsappUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://exemplo.com/imagem.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Cole uma URL de imagem externa ou use o upload acima
                </p>
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-200">
              <div>
                {message && (
                  <p className={`text-sm ${message.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? 'Salvando...' : 'Salvar Configurações'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}