'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import HeroSection from '@/components/landing/HeroSection'
import { WhatsAppButton } from '@/components/landing/WhatsAppButton'
import { WhatsAppModal } from '@/components/landing/WhatsAppModal'
import StickyMobileCTA from '@/components/landing/StickyMobileCTA'
import { usePricesUnlocked } from '@/hooks/usePricesUnlocked'

// Lazy load componentes não críticos
const SocialProofSection = dynamic(() => import('@/components/landing/SocialProofSection'))
const SolutionSection = dynamic(() => import('@/components/landing/SolutionSection'))
const ProfitCalculator = dynamic(() => import('@/components/landing/ProfitCalculator'))
const KitsSection = dynamic(() => import('@/components/landing/KitsSection'))
const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'))
const ComparisonSection = dynamic(() => import('@/components/landing/ComparisonSection'))
const ProcessSection = dynamic(() => import('@/components/landing/ProcessSection'))
const FAQSection = dynamic(() => import('@/components/landing/FAQSection'))
const UrgencySection = dynamic(() => import('@/components/landing/UrgencySection'))
const FinalCTA = dynamic(() => import('@/components/landing/FinalCTA'))

export default function LandingPageClient() {
  const { pricesUnlocked, unlockPrices } = usePricesUnlocked()
  const [modalOpen, setModalOpen] = useState(false)

  const handleWhatsAppSuccess = useCallback((whatsapp: string) => {
    unlockPrices(whatsapp)
    setModalOpen(false)
  }, [unlockPrices])

  const openWhatsAppModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const scrollToKits = useCallback(() => {
    document.getElementById('kits-section')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      
      {/* Menu navegação após o hero - apenas na home */}
      <div id="home-nav-menu" className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center font-bold text-xl text-white">
                P
              </div>
              <span className="font-bold text-xl text-gray-900">PMCELL</span>
            </Link>

            {/* Navegação interna da página - Desktop */}
            <nav className="hidden md:flex space-x-8">
              <a 
                href="#kits-section" 
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('kits-section')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Nossos Kits
              </a>
              <a 
                href="#testimonials" 
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Depoimentos
              </a>
              <a 
                href="#faq" 
                className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                FAQ
              </a>
            </nav>
            
            {/* Ações do menu */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/catalogo" 
                className="bg-purple-600 text-white px-6 py-2 rounded-full hover:bg-purple-700 transition-colors duration-300 font-medium"
              >
                Ver Catálogo Completo
              </Link>

              {/* WhatsApp Button */}
              <button
                onClick={openWhatsAppModal}
                className="hidden md:flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-full font-medium transition-all duration-300 hover:bg-green-600 hover:scale-105"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.567-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
                </svg>
                <span className="hidden lg:inline">WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <SocialProofSection />
      <SolutionSection />
      <ProfitCalculator />
      <KitsSection 
        pricesUnlocked={pricesUnlocked} 
        onRequestWhatsApp={openWhatsAppModal}
      />
      <div id="testimonials">
        <TestimonialsSection />
      </div>
      <ComparisonSection />
      <ProcessSection />
      <div id="faq">
        <FAQSection />
      </div>
      <UrgencySection />
      <FinalCTA onKitClick={scrollToKits} />
      
      <WhatsAppButton onClick={openWhatsAppModal} />
      <StickyMobileCTA 
        onKitClick={scrollToKits}
        onWhatsAppClick={openWhatsAppModal}
      />
      
      <WhatsAppModal 
        isOpen={modalOpen}
        onSuccess={handleWhatsAppSuccess}
        onClose={() => setModalOpen(false)}
      />
    </main>
  )
}