'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/Card'
import { ConversionFunnel } from '@/components/admin/ConversionFunnel'
import { PixelEvents } from '@/components/admin/PixelEvents'
import { DateRangePicker } from '@/components/admin/DateRangePicker'
import { getConversionMetrics } from '@/lib/analytics'
import { Calendar, TrendingUp, Target, DollarSign, Eye, MessageCircle, ShoppingCart } from 'lucide-react'

interface ConversionMetrics {
  totalLeads: number
  conversionRate: number
  averageOrderValue: number
  topProducts: Array<{
    id: number
    name: string
    views: number
    conversions: number
  }>
  dailyConversions: Array<{
    date: string
    visitors: number
    leads: number
    orders: number
  }>
  funnelData: {
    visitors: number
    contentViews: number
    leads: number
    purchases: number
  }
}

export default function ConversionDashboard() {
  const [metrics, setMetrics] = useState<ConversionMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    endDate: new Date()
  })

  useEffect(() => {
    loadMetrics()
  }, [dateRange])

  const loadMetrics = async () => {
    setLoading(true)
    try {
      const data = await getConversionMetrics(dateRange.startDate, dateRange.endDate)
      setMetrics(data)
    } catch (error) {
      console.error('Erro ao carregar métricas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Conversões</h1>
          <p className="text-gray-600">Acompanhe a performance do seu Pixel e conversões</p>
        </div>
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={(start, end) => setDateRange({ startDate: start, endDate: end })}
        />
      </div>

      {/* Métricas Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Leads</p>
              <p className="text-2xl font-bold text-gray-900">{metrics?.totalLeads || 0}</p>
              <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                <TrendingUp size={12} />
                WhatsApp
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <MessageCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.conversionRate ? `${metrics.conversionRate.toFixed(2)}%` : '0%'}
              </p>
              <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                <Target size={12} />
                Visitantes → Leads
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                R$ {metrics?.averageOrderValue ? metrics.averageOrderValue.toFixed(2) : '0,00'}
              </p>
              <p className="text-xs text-purple-600 flex items-center gap-1 mt-1">
                <DollarSign size={12} />
                Por pedido
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Produtos Mais Vistos</p>
              <p className="text-2xl font-bold text-gray-900">
                {metrics?.topProducts?.[0]?.views || 0}
              </p>
              <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                <Eye size={12} />
                {metrics?.topProducts?.[0]?.name || 'Nenhum produto'}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Eye className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de Conversões e Funil */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Conversões por Dia */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Conversões por Dia</h3>
          </div>
          
          <div className="space-y-4">
            {metrics?.dailyConversions?.map((day, index) => (
              <div key={day.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(day.date).toLocaleDateString('pt-BR', { 
                      weekday: 'short', 
                      day: '2-digit', 
                      month: '2-digit' 
                    })}
                  </p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                    <span>{day.visitors} visitantes</span>
                    <span>{day.leads} leads</span>
                    <span>{day.orders} pedidos</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-green-600">
                    {day.visitors > 0 ? ((day.leads / day.visitors) * 100).toFixed(1) : 0}%
                  </p>
                  <p className="text-xs text-gray-500">conversão</p>
                </div>
              </div>
            )) || (
              <p className="text-center text-gray-500 py-8">Nenhum dado disponível</p>
            )}
          </div>
        </Card>

        {/* Funil de Conversão */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">Funil de Conversão</h3>
          </div>
          
          {metrics?.funnelData && (
            <ConversionFunnel
              visitors={metrics.funnelData.visitors}
              contentViews={metrics.funnelData.contentViews}
              leads={metrics.funnelData.leads}
              purchases={metrics.funnelData.purchases}
            />
          )}
        </Card>
      </div>

      {/* Top Produtos */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <ShoppingCart className="h-5 w-5 text-orange-600" />
          <h3 className="text-lg font-semibold">Produtos Mais Vistos</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Visualizações
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversões
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Taxa
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {metrics?.topProducts?.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.views}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.conversions}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.views > 0 ? ((product.conversions / product.views) * 100).toFixed(2) : 0}%
                  </td>
                </tr>
              )) || (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    Nenhum produto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pixel Events */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <h3 className="text-lg font-semibold">Eventos do Pixel (Debug)</h3>
        </div>
        <PixelEvents />
      </Card>
    </div>
  )
}