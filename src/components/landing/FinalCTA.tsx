'use client'

import { useTracking } from '@/contexts/TrackingContext'

interface FinalCTAProps {
  onRequestWhatsApp?: () => void
  onKitClick?: () => void
}

export default function FinalCTA({ onRequestWhatsApp, onKitClick }: FinalCTAProps) {
  // Try to use tracking, but don't break if not available
  let trackEvent: ((event: string, data?: any) => void) = () => {};
  try {
    const tracking = useTracking();
    trackEvent = tracking.trackEvent;
  } catch (error) {
    // Tracking not available, continue without it
  }

  const handleCTAClick = () => {
    trackEvent('cta_click_final', {
      event_category: 'engagement',
      event_action: 'cta_click',
      event_label: 'final_cta_escolher_kit',
      cta_location: 'final_section',
      cta_text: 'ESCOLHER MEU KIT AGORA'
    })
    if (onRequestWhatsApp) {
      onRequestWhatsApp()
    } else if (onKitClick) {
      onKitClick()
    }
  }

  const handleCatalogClick = () => {
    trackEvent('catalog_click_final', {
      event_category: 'engagement',
      event_action: 'catalog_click',
      event_label: 'final_cta_catalogo',
      cta_location: 'final_section'
    })
  }

  return (
    <section id="final-cta" className="py-20 relative overflow-hidden"
      style={{
        backgroundColor: '#FFFBF7'
      }}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 bg-orange-50 text-orange-700 rounded-full text-sm font-medium mb-6">
            🚀 Última Chance - Oferta Limitada
          </div>
          
          {/* Headline */}
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Não Perca Mais
            <span className="block text-orange-600">Oportunidades de Venda</span>
          </h2>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
            Mais de <strong className="text-orange-600">4200+ lojistas</strong> já estão lucrando até <strong className="text-orange-600">600%</strong> com nossos kits.
            <span className="block mt-2">Seja o próximo a transformar seu negócio!</span>
          </p>
          
          {/* Benefícios principais */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Margem de até 600%</h3>
              <p className="text-gray-600 text-sm">Produtos de alta margem que garantem seu lucro</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Garantia 90 Dias</h3>
              <p className="text-gray-600 text-sm">Compre com total segurança e tranquilidade</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-2 text-gray-900">Receba em 24h</h3>
              <p className="text-gray-600 text-sm">Na região do ABC Paulista</p>
            </div>
          </div>
          
          {/* CTAs Principais */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <button 
              onClick={handleCTAClick}
              className="group bg-orange-500 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:bg-orange-600 transform hover:scale-105 transition-all duration-300 flex items-center"
            >
              🎯 ESCOLHER MEU KIT AGORA
              <svg className="ml-3 w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
            
            <a 
              href="/catalogo"
              onClick={handleCatalogClick}
              className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 hover:border-gray-400 transition-all duration-300 flex items-center"
            >
              Ver Catálogo Completo
              <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
          
          {/* Elementos de confiança */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-gray-600">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
              </svg>
              <span className="font-medium">✅ Produtos ANATEL</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
              </svg>
              <span className="font-medium">🚚 Frete Grátis</span>
            </div>
            <div className="hidden sm:block w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
              </svg>
              <span className="font-medium">💳 Parcelamos 12x</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}