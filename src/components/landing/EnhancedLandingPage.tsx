'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Componentes implementados
import ProfitCalculator from './ProfitCalculator'
import UrgencyTimer, { ScarcityCounter } from './UrgencyTimer'
import LeadCaptureSystem from './LeadCaptureSystem'
import { 
  DynamicSocialProof, 
  LiveViewCounter, 
  RotatingTestimonials, 
  PriceAnchoring, 
  SmartCTA, 
  ProgressiveDisclosure 
} from './ConversionOptimizations'

// Hooks implementados
import { useAdvancedTracking } from '@/hooks/useAdvancedTracking'
import { useUserBehaviorTracking, TrackingSection } from '@/hooks/useUserBehaviorTracking'
import { usePerformanceMonitoring } from '@/lib/performance-monitoring'
import { useBusinessRules } from '@/lib/business-rules'
import { useWhatsAppIntegration, MessageType } from '@/lib/whatsapp'

// Contexts implementados
import { useABTesting, ExperimentType, ExperimentRender } from '@/contexts/ABTestingContext'

// Componente principal aprimorado
export default function EnhancedLandingPage() {
  const [showLeadCapture, setShowLeadCapture] = useState(false)
  
  // Hooks de tracking e analytics
  const { getTrackingStats } = useAdvancedTracking()
  const { trackFormField } = useUserBehaviorTracking()
  const { trackCustomMetric } = usePerformanceMonitoring()
  
  // Hooks de negócio
  const { getBusinessStatus } = useBusinessRules()
  const { sendMessage } = useWhatsAppIntegration()
  
  // A/B Testing
  const { getVariant, trackConversion } = useABTesting()

  // Estados do componente
  const [businessStatus, setBusinessStatus] = useState(getBusinessStatus())

  // Atualizar status comercial periodicamente
  useEffect(() => {
    const interval = setInterval(() => {
      setBusinessStatus(getBusinessStatus())
    }, 60000) // A cada minuto

    return () => clearInterval(interval)
  }, [getBusinessStatus])

  // Handlers de conversão
  const handleWhatsAppClick = (source: string) => {
    // Track conversão no A/B test
    trackConversion(ExperimentType.HERO_CTA_TEXT, 'whatsapp_click')
    
    // Enviar mensagem personalizada via WhatsApp
    sendMessage(MessageType.INITIAL_INTEREST, {
      source,
      utm_source: new URLSearchParams(window.location.search).get('utm_source') || undefined
    })
    
    // Track métrica customizada
    trackCustomMetric('whatsapp_conversion', 1)
  }

  const handleProfitCalculatorUsed = () => {
    trackConversion(ExperimentType.PRICING_DISPLAY, 'calculator_interaction')
  }

  const handleLeadCaptured = (leadData: any) => {
    trackConversion(ExperimentType.WHATSAPP_MODAL, 'lead_captured', 1)
    trackCustomMetric('lead_capture_success', 1)
    console.log('Lead capturado:', leadData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Sistema de captura de leads com triggers inteligentes */}
      <LeadCaptureSystem 
        onCapture={handleLeadCaptured}
        triggers={[
          { type: 'exit_intent', maxTriggers: 1 },
          { type: 'scroll_percentage', value: 75, maxTriggers: 1 },
          { type: 'time_on_site', value: 90000, maxTriggers: 1 }, // 1.5 minutos
          { type: 'idle_time', value: 45000, maxTriggers: 1 } // 45 segundos
        ]}
      />

      {/* Social Proof Dinâmico */}
      <DynamicSocialProof />

      {/* Seção Hero com A/B Testing */}
      <TrackingSection sectionName="hero" content="Seção principal com CTA e proposta de valor">
        <section className="relative py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            
            {/* Status comercial */}
            <div className="mb-6 flex justify-center items-center gap-4">
              <LiveViewCounter />
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                businessStatus.isOpen 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-orange-100 text-orange-800'
              }`}>
                {businessStatus.message}
              </div>
            </div>

            {/* Headline com A/B Testing */}
            <ExperimentRender 
              experiment={ExperimentType.HERO_HEADLINE}
              variants={{
                control: <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Acessórios para Celular no Atacado
                </h1>,
                variant_a: <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Fature <span className="text-purple-600">R$ 15.000/mês</span> Vendendo Acessórios
                </h1>,
                variant_b: <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Acessórios <span className="text-purple-600">Direto da Fábrica</span> - Preços Atacado
                </h1>,
                variant_c: <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Revenda Acessórios e Tenha <span className="text-purple-600">Renda Extra</span>
                </h1>
              }}
            />

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Preços especiais para revendedores. Qualidade garantida, entrega rápida e suporte completo.
            </p>

            {/* Timer de urgência com A/B Testing */}
            <ExperimentRender 
              experiment={ExperimentType.URGENCY_TIMER}
              variants={{
                control: null,
                variant_a: <UrgencyTimer className="mb-8 max-w-md mx-auto" />,
                variant_b: <ScarcityCounter 
                  initialCount={43} 
                  kitName="oferta_especial" 
                  className="mb-8 max-w-md mx-auto" 
                />,
                variant_c: <div className="mb-8 space-y-4">
                  <UrgencyTimer className="max-w-md mx-auto" />
                  <ScarcityCounter initialCount={43} kitName="oferta_especial" className="max-w-md mx-auto" />
                </div>
              }}
            />

            {/* CTA inteligente */}
            <SmartCTA 
              className="max-w-md mx-auto"
              onPrimaryClick={() => handleWhatsAppClick('hero_primary_cta')}
              onSecondaryClick={() => handleWhatsAppClick('hero_secondary_cta')}
            />
          </div>
        </section>
      </TrackingSection>

      {/* Seção da Calculadora de Lucro */}
      <TrackingSection sectionName="profit_calculator" content="Calculadora interativa de lucro para engajar visitantes">
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quanto Você Pode Lucrar?
              </h2>
              <p className="text-lg text-gray-600">
                Use nossa calculadora e descubra seu potencial de faturamento
              </p>
            </div>
            
            <ProfitCalculator 
              className="max-w-2xl mx-auto"
            />
          </div>
        </section>
      </TrackingSection>

      {/* Seção de Social Proof */}
      <TrackingSection sectionName="social_proof" content="Depoimentos e prova social para aumentar credibilidade">
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                O Que Nossos Clientes Falam
              </h2>
              <p className="text-lg text-gray-600">
                Mais de 2.000 revendedores já confiam na nossa qualidade
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <RotatingTestimonials className="lg:col-span-2" />
              
              <div className="space-y-6">
                <PriceAnchoring 
                  originalPrice={45.90}
                  currentPrice={12.50}
                />
                
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold mb-2">+2.000</div>
                  <div className="text-sm opacity-90">Revendedores ativos</div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg p-6 text-center">
                  <div className="text-2xl font-bold mb-2">4.9⭐</div>
                  <div className="text-sm opacity-90">Avaliação média</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </TrackingSection>

      {/* Seção de Informações Avançadas com Progressive Disclosure */}
      <TrackingSection sectionName="advanced_info" content="Informações detalhadas sobre produtos e condições">
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informações Importantes
              </h2>
              
              <div className="space-y-6">
                <ProgressiveDisclosure triggerText="Ver condições de pagamento">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Formas de Pagamento:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>PIX: 5% de desconto adicional</li>
                      <li>Cartão de crédito: até 12x sem juros</li>
                      <li>Boleto bancário: à vista</li>
                      <li>Transferência bancária: 3% de desconto</li>
                    </ul>
                  </div>
                </ProgressiveDisclosure>

                <ProgressiveDisclosure triggerText="Ver política de entrega">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Entrega e Frete:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>Frete grátis acima de R$ 500</li>
                      <li>Entrega em todo o Brasil</li>
                      <li>Prazo: 2-10 dias úteis conforme região</li>
                      <li>Rastreamento incluso</li>
                    </ul>
                  </div>
                </ProgressiveDisclosure>

                <ProgressiveDisclosure triggerText="Ver garantias e suporte">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">Garantias:</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      <li>30 dias para troca e devolução</li>
                      <li>Garantia de qualidade dos produtos</li>
                      <li>Suporte comercial personalizado</li>
                      <li>Material de divulgação incluído</li>
                    </ul>
                  </div>
                </ProgressiveDisclosure>
              </div>
            </div>
          </div>
        </section>
      </TrackingSection>

      {/* CTA Final */}
      <TrackingSection sectionName="final_cta" content="Chamada final para ação com urgência e benefícios">
        <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Pronto para Começar Seu Negócio?
            </h2>
            
            <p className="text-xl mb-8 opacity-90">
              Junte-se a milhares de revendedores que já estão lucrando
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">⚡</div>
                <div className="font-semibold mb-1">Início Rápido</div>
                <div className="text-sm opacity-80">Comece vendendo hoje mesmo</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">💰</div>
                <div className="font-semibold mb-1">Lucro Garantido</div>
                <div className="text-sm opacity-80">Margem mínima de 200%</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <div className="text-2xl font-bold mb-2">🚀</div>
                <div className="font-semibold mb-1">Suporte Total</div>
                <div className="text-sm opacity-80">Acompanhamento personalizado</div>
              </div>
            </div>

            <motion.button
              onClick={() => handleWhatsAppClick('final_cta')}
              className="bg-white text-purple-600 font-bold py-4 px-8 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              🚀 COMEÇAR AGORA MESMO
            </motion.button>

            <p className="text-sm mt-4 opacity-75">
              Sem taxa de adesão • Sem mensalidades • Sem compromisso
            </p>
          </div>
        </section>
      </TrackingSection>
    </div>
  )
}