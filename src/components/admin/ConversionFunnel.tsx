'use client'

import { Users, Eye, MessageCircle, ShoppingBag } from 'lucide-react'

interface ConversionFunnelProps {
  visitors: number
  contentViews: number
  leads: number
  purchases: number
}

export function ConversionFunnel({ visitors, contentViews, leads, purchases }: ConversionFunnelProps) {
  // Calcular porcentagens
  const contentViewRate = visitors > 0 ? (contentViews / visitors) * 100 : 0
  const leadRate = visitors > 0 ? (leads / visitors) * 100 : 0
  const purchaseRate = visitors > 0 ? (purchases / visitors) * 100 : 0
  
  // Calcular larguras para o funil (baseado no maior valor)
  const maxValue = visitors
  const visitorWidth = 100
  const contentWidth = maxValue > 0 ? (contentViews / maxValue) * 100 : 0
  const leadWidth = maxValue > 0 ? (leads / maxValue) * 100 : 0
  const purchaseWidth = maxValue > 0 ? (purchases / maxValue) * 100 : 0

  const funnelSteps = [
    {
      icon: Users,
      label: 'Visitantes',
      value: visitors,
      width: visitorWidth,
      percentage: 100,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      icon: Eye,
      label: 'Visualizaram Produtos',
      value: contentViews,
      width: contentWidth,
      percentage: contentViewRate,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      icon: MessageCircle,
      label: 'Leads (WhatsApp)',
      value: leads,
      width: leadWidth,
      percentage: leadRate,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      icon: ShoppingBag,
      label: 'Compras',
      value: purchases,
      width: purchaseWidth,
      percentage: purchaseRate,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Funil Visual */}
      <div className="relative">
        {funnelSteps.map((step, index) => {
          const IconComponent = step.icon
          return (
            <div key={step.label} className="mb-4 last:mb-0">
              {/* Barra do funil */}
              <div className="relative">
                <div className="w-full bg-gray-100 rounded-lg h-12 flex items-center overflow-hidden">
                  {/* Barra colorida */}
                  <div
                    className={`${step.color} h-full flex items-center justify-between px-4 transition-all duration-300 ease-out relative`}
                    style={{ width: `${Math.max(step.width, 15)}%` }}
                  >
                    {/* Gradiente para efeito visual */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-20"></div>
                    
                    {/* Conteúdo da barra */}
                    <div className="flex items-center gap-2 text-white relative z-10">
                      <IconComponent size={16} />
                      <span className="font-medium text-sm">{step.label}</span>
                    </div>
                    
                    <div className="text-white font-bold text-sm relative z-10">
                      {step.value.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                {/* Porcentagem */}
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <span className={`text-xs font-semibold ${step.textColor} bg-white px-2 py-1 rounded shadow-sm`}>
                    {step.percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              {/* Seta de conexão (exceto no último item) */}
              {index < funnelSteps.length - 1 && (
                <div className="flex justify-center my-2">
                  <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-t-[12px] border-l-transparent border-r-transparent border-t-gray-300"></div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Estatísticas de Conversão */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
        <div className="text-center">
          <p className="text-2xl font-bold text-green-600">
            {leadRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">Taxa de Lead</p>
          <p className="text-xs text-gray-500">Visitantes → WhatsApp</p>
        </div>
        
        <div className="text-center">
          <p className="text-2xl font-bold text-purple-600">
            {purchaseRate.toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">Taxa de Compra</p>
          <p className="text-xs text-gray-500">Visitantes → Pedidos</p>
        </div>
      </div>

      {/* Análise de Performance */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-900 mb-2">Análise de Performance</h4>
        <div className="space-y-2 text-sm">
          {contentViewRate < 50 && (
            <div className="flex items-center gap-2 text-orange-600">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span>Taxa de visualização baixa - considere melhorar a landing page</span>
            </div>
          )}
          
          {leadRate < 5 && (
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <span>Taxa de conversão em lead baixa - otimize CTAs e ofertas</span>
            </div>
          )}
          
          {leadRate >= 5 && leadRate < 15 && (
            <div className="flex items-center gap-2 text-yellow-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span>Taxa de conversão em lead boa - continue testando melhorias</span>
            </div>
          )}
          
          {leadRate >= 15 && (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Excelente taxa de conversão em lead!</span>
            </div>
          )}
          
          {purchaseRate >= 2 && (
            <div className="flex items-center gap-2 text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Boa taxa de conversão em vendas</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}