'use client'

import { useEffect, useState } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import SocialProofSection from '@/components/landing/SocialProofSection'
import ProblemsSection from '@/components/landing/ProblemsSection'
import SolutionSection from '@/components/landing/SolutionSection'
import ProfitCalculator from '@/components/landing/ProfitCalculator'
import KitsSection from '@/components/landing/KitsSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import ComparisonSection from '@/components/landing/ComparisonSection'
import ProcessSection from '@/components/landing/ProcessSection'
import FAQSection from '@/components/landing/FAQSection'
import UrgencySection from '@/components/landing/UrgencySection'
import FinalCTA from '@/components/landing/FinalCTA'
import { WhatsAppButton } from '@/components/landing/WhatsAppButton'
import { WhatsAppModal } from '@/components/landing/WhatsAppModal'
import StickyMobileCTA from '@/components/landing/StickyMobileCTA'
import { usePricesUnlocked } from '@/hooks/usePricesUnlocked'

export default function LandingPage() {
  const { pricesUnlocked, unlockPrices } = usePricesUnlocked()
  const [modalOpen, setModalOpen] = useState(false)

  const handleWhatsAppSuccess = (whatsapp: string) => {
    unlockPrices(whatsapp)
    setModalOpen(false)
  }

  const openWhatsAppModal = () => {
    setModalOpen(true)
  }

  const scrollToKits = () => {
    const kitsSection = document.getElementById('kits-section')
    if (kitsSection) {
      kitsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      
      {/* Social Proof Section */}
      <SocialProofSection />
      
      {/* Problems/Agitação Section */}
      <ProblemsSection />
      
      {/* Solution/Benefits Section - Temporariamente desabilitado devido a erro de sintaxe */}
      <div className="bg-green-50 py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Benefícios dos Nossos Produtos</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Margem de 600%</h3>
              <p className="text-gray-600">Lucre mais vendendo produtos que todo mundo precisa</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold mb-2">Garantia 90 Dias</h3>
              <p className="text-gray-600">Produtos com qualidade ANATEL e garantia completa</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Entrega 24h</h3>
              <p className="text-gray-600">Receba rapidamente para não perder vendas</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Profit Calculator */}
      <ProfitCalculator />
      
      {/* Kits Section */}
      <KitsSection 
        pricesUnlocked={pricesUnlocked} 
        onRequestWhatsApp={openWhatsAppModal}
      />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* Comparison Table */}
      <ComparisonSection />
      
      {/* How it Works Process */}
      <ProcessSection />
      
      {/* FAQ Section */}
      <FAQSection />
      
      {/* Urgency/Scarcity Section */}
      <UrgencySection />
      
      {/* Final CTA */}
      <FinalCTA onKitClick={scrollToKits} />
      
      {/* WhatsApp Float Button */}
      <WhatsAppButton onClick={openWhatsAppModal} />
      
      {/* Mobile Sticky CTA */}
      <StickyMobileCTA 
        onKitClick={scrollToKits}
        onWhatsAppClick={openWhatsAppModal}
      />
      
      {/* WhatsApp Modal */}
      <WhatsAppModal 
        isOpen={modalOpen}
        onSuccess={handleWhatsAppSuccess}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
