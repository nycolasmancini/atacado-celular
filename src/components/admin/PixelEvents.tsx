'use client'

import { useState, useEffect } from 'react'
import { getPixelEvents, AnalyticsEvent } from '@/lib/analytics'
import { Filter, RefreshCw, Eye, MessageCircle, ShoppingCart, Search, User, Calendar } from 'lucide-react'

export function PixelEvents() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [limit, setLimit] = useState(50)

  const eventTypes = [
    { value: 'all', label: 'Todos os Eventos' },
    { value: 'PageView', label: 'Visualizações de Página' },
    { value: 'ViewContent', label: 'Visualizações de Produto' },
    { value: 'Lead', label: 'Leads (WhatsApp)' },
    { value: 'Purchase', label: 'Compras' },
    { value: 'AddToCart', label: 'Adicionar ao Carrinho' },
    { value: 'Search', label: 'Pesquisas' }
  ]

  useEffect(() => {
    loadEvents()
  }, [limit])

  const loadEvents = async () => {
    setLoading(true)
    try {
      const data = await getPixelEvents(limit)
      setEvents(data)
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.eventType === filter)

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'PageView':
        return <Eye className="h-4 w-4" />
      case 'ViewContent':
        return <Eye className="h-4 w-4" />
      case 'Lead':
        return <MessageCircle className="h-4 w-4" />
      case 'Purchase':
        return <ShoppingCart className="h-4 w-4" />
      case 'AddToCart':
        return <ShoppingCart className="h-4 w-4" />
      case 'Search':
        return <Search className="h-4 w-4" />
      default:
        return <Calendar className="h-4 w-4" />
    }
  }

  const getEventColor = (eventType: string) => {
    switch (eventType) {
      case 'PageView':
        return 'bg-blue-100 text-blue-800'
      case 'ViewContent':
        return 'bg-green-100 text-green-800'
      case 'Lead':
        return 'bg-yellow-100 text-yellow-800'
      case 'Purchase':
        return 'bg-purple-100 text-purple-800'
      case 'AddToCart':
        return 'bg-orange-100 text-orange-800'
      case 'Search':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatEventData = (eventData: any) => {
    if (!eventData) return 'Sem dados'
    
    // Filtra apenas os campos mais importantes para exibição
    const relevantFields = {
      ...(eventData.page && { página: eventData.page }),
      ...(eventData.content_ids && { produtos: eventData.content_ids.join(', ') }),
      ...(eventData.value && { valor: `R$ ${eventData.value.toFixed(2)}` }),
      ...(eventData.content_name && { conteúdo: eventData.content_name }),
      ...(eventData.query && { busca: eventData.query }),
      ...(eventData.productName && { produto: eventData.productName }),
      ...(eventData.referrer && { origem: eventData.referrer }),
      ...(eventData.currency && { moeda: eventData.currency }),
      ...(eventData.num_items && { itens: eventData.num_items })
    }

    return Object.entries(relevantFields)
      .map(([key, value]) => `${key}: ${value}`)
      .join(' | ')
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {eventTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Limite:</span>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={200}>200</option>
            </select>
          </div>
        </div>

        <button
          onClick={loadEvents}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Atualizar
        </button>
      </div>

      {/* Estatísticas rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {eventTypes.slice(1).map(type => {
          const count = events.filter(e => e.eventType === type.value).length
          return (
            <div key={type.value} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-lg font-semibold text-gray-900">{count}</div>
              <div className="text-xs text-gray-600">{type.label}</div>
            </div>
          )
        })}
      </div>

      {/* Lista de Eventos */}
      <div className="space-y-2">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhum evento encontrado para os filtros selecionados</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* Ícone do evento */}
              <div className={`p-2 rounded-full ${getEventColor(event.eventType)}`}>
                {getEventIcon(event.eventType)}
              </div>

              {/* Conteúdo principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-gray-900">{event.eventType}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs ${getEventColor(event.eventType)}`}>
                    {event.eventType}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-2">
                  {formatEventData(event.eventData)}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>Sessão: {event.sessionId.slice(0, 8)}...</span>
                  </div>
                  
                  {event.whatsapp && (
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3 w-3" />
                      <span>WhatsApp: {event.whatsapp}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>
                      {new Date(event.timestamp).toLocaleString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dados técnicos (colapsível) */}
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-400 hover:text-gray-600">
                  JSON
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-x-auto max-w-xs">
                  {JSON.stringify(event.eventData, null, 2)}
                </pre>
              </details>
            </div>
          ))
        )}
      </div>

      {/* Informações de debug */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para Debug</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• <strong>PageView:</strong> Confirme se todas as páginas estão sendo rastreadas</li>
          <li>• <strong>ViewContent:</strong> Verifique se os IDs dos produtos estão corretos</li>
          <li>• <strong>Lead:</strong> Certifique-se de que o WhatsApp está sendo capturado</li>
          <li>• <strong>Purchase:</strong> Confirme se o valor e moeda estão corretos</li>
          <li>• Use o campo JSON para ver todos os parâmetros enviados</li>
        </ul>
      </div>
    </div>
  )
}