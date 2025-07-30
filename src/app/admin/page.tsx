import { StatsCard } from '@/components/admin/StatsCard'
import { RecentLeads } from '@/components/admin/RecentLeads'
import { prisma } from '@/lib/prisma'
import { 
  MessageCircle, 
  ShoppingCart, 
  Eye, 
  TrendingUp 
} from 'lucide-react'

async function getDashboardStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  // WhatsApps capturados hoje
  const whatsappsToday = await prisma.trackingEvent.count({
    where: {
      eventType: 'whatsapp_submitted',
      createdAt: {
        gte: today,
        lt: tomorrow
      }
    }
  })

  // Pedidos finalizados hoje
  const ordersToday = await prisma.trackingEvent.count({
    where: {
      eventType: 'order_completed',
      createdAt: {
        gte: today,
        lt: tomorrow
      }
    }
  })

  // Visualizações de produtos hoje
  const productViewsToday = await prisma.trackingEvent.count({
    where: {
      eventType: 'product_view',
      createdAt: {
        gte: today,
        lt: tomorrow
      }
    }
  })

  // Taxa de conversão (simplificada)
  const conversionRate = whatsappsToday > 0 
    ? ((ordersToday / whatsappsToday) * 100).toFixed(1)
    : '0.0'

  return {
    whatsappsToday,
    ordersToday,
    productViewsToday,
    conversionRate
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Métricas do dia e atividade recente</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="WhatsApps Hoje"
          value={stats.whatsappsToday}
          icon={MessageCircle}
        />
        <StatsCard
          title="Pedidos Hoje"
          value={stats.ordersToday}
          icon={ShoppingCart}
        />
        <StatsCard
          title="Visualizações Hoje"
          value={stats.productViewsToday}
          icon={Eye}
        />
        <StatsCard
          title="Taxa Conversão"
          value={`${stats.conversionRate}%`}
          icon={TrendingUp}
        />
      </div>

      {/* Tabela de Últimos WhatsApps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentLeads />
        
        {/* Card de Ações Rápidas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Rápidas</h3>
          <div className="space-y-3">
            <a
              href="/admin/products"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Gerenciar Produtos</div>
              <div className="text-sm text-gray-500">Adicionar, editar ou remover produtos</div>
            </a>
            <a
              href="/admin/leads"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Ver Todos WhatsApps</div>
              <div className="text-sm text-gray-500">Relatório completo de leads</div>
            </a>
            <a
              href="/admin/analytics"
              className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Analytics</div>
              <div className="text-sm text-gray-500">Métricas detalhadas e relatórios</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}