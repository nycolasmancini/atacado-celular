'use client'

import { useState, useEffect } from 'react'
import { DateRangePicker } from '@/components/admin/DateRangePicker'
import { ReportTable } from '@/components/admin/ReportTable'
import { StatsCard } from '@/components/admin/StatsCard'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { 
  getWhatsAppStats, 
  getOrderStats, 
  getReportSummary,
  formatCurrency,
  formatDate,
  formatPhoneNumber,
  type WhatsAppStat,
  type OrderStat,
  type ReportSummary
} from '@/lib/reports'

export default function RelatoriosPage() {
  const [loading, setLoading] = useState(false)
  const [summary, setSummary] = useState<ReportSummary>({
    totalWhatsApps: 0,
    totalOrders: 0,
    conversionRate: 0,
    averageTicket: 0
  })
  const [whatsappData, setWhatsappData] = useState<WhatsAppStat[]>([])
  const [orderData, setOrderData] = useState<OrderStat[]>([])

  // Initialize with today's data
  useEffect(() => {
    const today = new Date()
    today.setHours(23, 59, 59, 999)
    const startOfDay = new Date(today)
    startOfDay.setHours(0, 0, 0, 0)
    
    loadReportData(startOfDay, today)
  }, [])

  const loadReportData = async (startDate: Date, endDate: Date) => {
    setLoading(true)
    try {
      const [summaryData, whatsappStats, orderStats] = await Promise.all([
        getReportSummary(startDate, endDate),
        getWhatsAppStats(startDate, endDate),
        getOrderStats(startDate, endDate)
      ])

      setSummary(summaryData)
      setWhatsappData(whatsappStats)
      setOrderData(orderStats)
    } catch (error) {
      console.error('Erro ao carregar dados do relatório:', error)
      // Reset to empty state on error
      setSummary({
        totalWhatsApps: 0,
        totalOrders: 0,
        conversionRate: 0,
        averageTicket: 0
      })
      setWhatsappData([])
      setOrderData([])
    } finally {
      setLoading(false)
    }
  }

  const whatsappColumns = [
    {
      key: 'phoneNumber',
      title: 'WhatsApp',
      sortable: true,
      render: (value: string | null) => (
        <span className="font-mono text-sm">
          {formatPhoneNumber(value)}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: 'Data/Hora',
      sortable: true,
      render: (value: Date) => (
        <span className="text-sm">
          {formatDate(value)}
        </span>
      )
    },
    {
      key: 'sessionId',
      title: 'Sessão',
      render: (value: string) => (
        <span className="font-mono text-xs text-gray-500">
          {value.substring(0, 8)}...
        </span>
      )
    },
    {
      key: 'userAgent',
      title: 'Dispositivo',
      render: (value: string | null) => {
        if (!value) return <span className="text-gray-400">N/A</span>
        
        const isMobile = /Mobile|Android|iPhone/i.test(value)
        return (
          <span className="text-sm">
            <span role="img" aria-label={isMobile ? "mobile device" : "desktop device"}>
              {isMobile ? '📱' : '💻'}
            </span>
            {' '}
            {isMobile ? 'Mobile' : 'Desktop'}
          </span>
        )
      }
    }
  ]

  const orderColumns = [
    {
      key: 'phoneNumber',
      title: 'WhatsApp',
      sortable: true,
      render: (value: string) => (
        <span className="font-mono text-sm">
          {formatPhoneNumber(value)}
        </span>
      )
    },
    {
      key: 'totalAmount',
      title: 'Valor Total',
      sortable: true,
      render: (value: number) => (
        <span className="font-semibold text-green-600">
          {formatCurrency(value)}
        </span>
      )
    },
    {
      key: 'itemCount',
      title: 'Itens',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm">
          {value} peça{value !== 1 ? 's' : ''}
        </span>
      )
    },
    {
      key: 'createdAt',
      title: 'Data/Hora',
      sortable: true,
      render: (value: Date) => (
        <span className="text-sm">
          {formatDate(value)}
        </span>
      )
    },
    {
      key: 'id',
      title: 'ID Pedido',
      render: (value: string) => (
        <span className="font-mono text-xs text-gray-500">
          {value.substring(0, 8)}...
        </span>
      )
    }
  ]

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
        </div>

      {/* Date Range Picker */}
      <DateRangePicker onDateRangeChange={loadReportData} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="WhatsApps Capturados"
          value={summary.totalWhatsApps.toString()}
          icon="📱"
          loading={loading}
        />
        <StatsCard
          title="Pedidos Finalizados"
          value={summary.totalOrders.toString()}
          icon="🛒"
          loading={loading}
        />
        <StatsCard
          title="Taxa de Conversão"
          value={`${summary.conversionRate.toFixed(1)}%`}
          icon="📈"
          loading={loading}
          subtitle={summary.totalWhatsApps > 0 ? `${summary.totalOrders}/${summary.totalWhatsApps}` : ''}
        />
        <StatsCard
          title="Ticket Médio"
          value={formatCurrency(summary.averageTicket)}
          icon="💰"
          loading={loading}
        />
      </div>

      {/* WhatsApp Captures Table */}
      <ReportTable
        title="WhatsApps Capturados"
        columns={whatsappColumns}
        data={whatsappData}
        loading={loading}
        emptyMessage="Nenhum WhatsApp capturado no período selecionado"
      />

      {/* Orders Table */}
      <ReportTable
        title="Pedidos Finalizados"
        columns={orderColumns}
        data={orderData}
        loading={loading}
        emptyMessage="Nenhum pedido finalizado no período selecionado"
      />
      </div>
    </ProtectedRoute>
  )
}