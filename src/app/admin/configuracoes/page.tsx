'use client'

import { useState, useEffect } from 'react'

interface SiteConfig {
  id?: string
  avatarWhatsappUrl: string
  webhookUrl?: string
  webhookEnabled?: boolean
  webhookSecretKey?: string
  minSessionTime?: number
  sessionTimeout?: number
  highValueThreshold?: number
  createdAt?: Date
  updatedAt?: Date
}

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<SiteConfig>({
    avatarWhatsappUrl: '/images/whatsapp-avatar.svg',
    webhookUrl: '',
    webhookEnabled: false,
    webhookSecretKey: '',
    minSessionTime: 300,
    sessionTimeout: 1800,
    highValueThreshold: 1000
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [testingWebhook, setTestingWebhook] = useState(false)
  const [message, setMessage] = useState('')
  const [webhookTestResult, setWebhookTestResult] = useState<any>(null)

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validar tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setMessage('Por favor, selecione apenas arquivos de imagem')
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage('A imagem deve ter no máximo 5MB')
      return
    }

    setUploading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setConfig(prev => ({ ...prev, avatarWhatsappUrl: data.url }))
        setMessage('Imagem enviada com sucesso!')
        setTimeout(() => setMessage(''), 3000)
      } else {
        const errorData = await response.json()
        setMessage(errorData.error || 'Erro ao enviar imagem')
      }
    } catch (error) {
      console.error('Erro no upload:', error)
      setMessage('Erro ao enviar imagem')
    } finally {
      setUploading(false)
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

  const handleTestWebhook = async () => {
    if (!config.webhookUrl) {
      setMessage('Por favor, configure a URL do webhook antes de testar')
      return
    }

    setTestingWebhook(true)
    setWebhookTestResult(null)
    setMessage('')
    
    try {
      const response = await fetch('/api/webhook/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      const result = await response.json()
      setWebhookTestResult(result)
      
      if (response.ok) {
        setMessage('Teste do webhook realizado com sucesso!')
      } else {
        setMessage(`Erro no teste: ${result.error || 'Webhook retornou erro'}`)
      }
    } catch (error) {
      console.error('Erro ao testar webhook:', error)
      setMessage('Erro ao conectar com o webhook')
      setWebhookTestResult({
        error: 'Erro de conexão',
        details: error.message
      })
    } finally {
      setTestingWebhook(false)
      setTimeout(() => setMessage(''), 5000)
    }
  }

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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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

                {/* Upload de arquivo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload de Imagem
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                      id="avatar-upload"
                    />
                    <label 
                      htmlFor="avatar-upload" 
                      className={`cursor-pointer ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                        {uploading ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                        ) : (
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {uploading ? 'Enviando...' : 'Clique para enviar'}
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG até 5MB
                      </p>
                    </label>
                  </div>
                </div>

                {/* URL manual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem
                  </label>
                  <input
                    type="url"
                    value={config.avatarWhatsappUrl}
                    onChange={(e) => setConfig(prev => ({ ...prev, avatarWhatsappUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Ou cole uma URL externa
                  </p>
                </div>
              </div>
            </div>

            {/* Seção de Webhook */}
            <div className="space-y-6 border-t border-gray-200 pt-8">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  Configuração do Webhook (Evolution API)
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  Configure o webhook para receber dados consolidados da jornada do cliente
                </p>
              </div>

              {/* Status do Webhook */}
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${config.webhookEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className={`text-sm font-medium ${config.webhookEnabled ? 'text-green-700' : 'text-gray-500'}`}>
                  {config.webhookEnabled ? 'Webhook Ativo' : 'Webhook Inativo'}
                </span>
                <label className="relative inline-flex items-center cursor-pointer ml-auto">
                  <input
                    type="checkbox"
                    checked={config.webhookEnabled || false}
                    onChange={(e) => setConfig(prev => ({ ...prev, webhookEnabled: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>

              {/* URL do Webhook */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  URL do Webhook
                </label>
                <input
                  type="url"
                  value={config.webhookUrl || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, webhookUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://evolution.exemplo.com/webhook/sua-instancia"
                />
                <p className="text-xs text-gray-500">
                  URL da sua instância Evolution API para receber os webhooks
                </p>
              </div>

              {/* Chave Secreta */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Chave Secreta (Opcional)
                </label>
                <input
                  type="password"
                  value={config.webhookSecretKey || ''}
                  onChange={(e) => setConfig(prev => ({ ...prev, webhookSecretKey: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Sua chave secreta para validação"
                />
                <p className="text-xs text-gray-500">
                  Chave secreta enviada no header X-Webhook-Secret para validação
                </p>
              </div>

              {/* Configurações Avançadas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tempo Mínimo de Sessão (segundos)
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="3600"
                    value={config.minSessionTime || 300}
                    onChange={(e) => setConfig(prev => ({ ...prev, minSessionTime: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">Tempo mínimo para enviar webhook</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Timeout de Sessão (segundos)
                  </label>
                  <input
                    type="number"
                    min="300"
                    max="7200"
                    value={config.sessionTimeout || 1800}
                    onChange={(e) => setConfig(prev => ({ ...prev, sessionTimeout: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">Tempo limite para considerar sessão finalizada</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Valor Alto Threshold (R$)
                  </label>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={config.highValueThreshold || 1000}
                    onChange={(e) => setConfig(prev => ({ ...prev, highValueThreshold: parseFloat(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500">Valor do carrinho considerado alto</p>
                </div>
              </div>

              {/* Teste do Webhook */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Testar Webhook</h3>
                    <p className="text-xs text-gray-600">Envie um payload de teste para verificar se o webhook está funcionando</p>
                  </div>
                  <button
                    onClick={handleTestWebhook}
                    disabled={testingWebhook || !config.webhookUrl}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {testingWebhook ? 'Testando...' : 'Testar Webhook'}
                  </button>
                </div>

                {/* Resultado do Teste */}
                {webhookTestResult && (
                  <div className="bg-white rounded border p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${webhookTestResult.testResult?.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className={`text-sm font-medium ${webhookTestResult.testResult?.success ? 'text-green-700' : 'text-red-700'}`}>
                        {webhookTestResult.testResult?.success ? 'Sucesso' : 'Erro'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {webhookTestResult.testResult?.responseTime}
                      </span>
                    </div>
                    
                    {webhookTestResult.testResult && (
                      <div className="text-xs">
                        <div><strong>Status:</strong> {webhookTestResult.testResult.status} {webhookTestResult.testResult.statusText}</div>
                        {webhookTestResult.testResult.responseBody && (
                          <div className="mt-1">
                            <strong>Resposta:</strong>
                            <pre className="mt-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                              {webhookTestResult.testResult.responseBody}
                            </pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Documentação do Webhook */}
            <div className="bg-blue-50 rounded-lg p-6 space-y-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-blue-900">📚 Como usar os dados do Webhook</h3>
              
              <div className="space-y-4 text-sm text-blue-800">
                <div>
                  <h4 className="font-medium">🎯 Quando o webhook é enviado:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-blue-700">
                    <li>Cliente fornece WhatsApp no site</li>
                    <li>Sessão expira após inatividade (configurável)</li>
                    <li>Cliente abandona carrinho com valor alto</li>
                    <li>Score de interesse é maior que 7</li>
                    <li>Sessão dura mais que o tempo mínimo com atividade significativa</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">📊 Informações incluídas no webhook:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-blue-700">
                    <li><strong>Dados do cliente:</strong> WhatsApp, email, informações da sessão</li>
                    <li><strong>Resumo da jornada:</strong> Tempo no site, páginas visitadas, dispositivo, localização</li>
                    <li><strong>Produtos:</strong> Lista de produtos visualizados, tempo por produto, carrinho atual</li>
                    <li><strong>Comportamento:</strong> Buscas realizadas, sinais de urgência, flags comportamentais</li>
                    <li><strong>Análise de oportunidade:</strong> Nível (FRIO/MORNO/QUENTE), sugestão de abordagem, melhor momento para contato</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">🤖 Automações sugeridas no N8N:</h4>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-blue-700">
                    <li><strong>Score QUENTE:</strong> Notificação imediata para vendedor + mensagem personalizada</li>
                    <li><strong>Carrinho abandonado:</strong> Workflow de recuperação com desconto</li>
                    <li><strong>Produto específico:</strong> Enviar materiais do produto visualizado</li>
                    <li><strong>Alta indecisão:</strong> Oferecer consultoria personalizada</li>
                    <li><strong>Múltiplas visitas:</strong> Sequência de nutrição via WhatsApp</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium">💡 Exemplo de uso:</h4>
                  <div className="bg-white rounded p-3 border border-blue-200">
                    <code className="text-xs">
                      Se <strong>oportunidade.nivel === &quot;QUENTE&quot;</strong> E <strong>produtos.valor_carrinho &gt; 1000</strong><br/>
                      Então: Enviar mensagem imediata para vendedor com contexto completo<br/>
                      Aguardar 5min → Se não houver resposta, enviar WhatsApp automático com desconto
                    </code>
                  </div>
                </div>
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