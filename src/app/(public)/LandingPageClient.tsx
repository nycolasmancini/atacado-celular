'use client'

import { useState } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import SocialProofSection from '@/components/landing/SocialProofSection'
import SolutionSection from '@/components/landing/SolutionSection'
import KitsSection from '@/components/landing/KitsSection'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import ComparisonSection from '@/components/landing/ComparisonSection'
import ProcessSection from '@/components/landing/ProcessSection'
import FAQSection from '@/components/landing/FAQSection'
import FinalCTA from '@/components/landing/FinalCTA'
import ScrollProgressBar from '@/components/ui/ScrollProgressBar'
import { FloatingNav } from '@/components/ui/SmoothScrollNav'
import { WhatsAppModal } from '@/components/landing/WhatsAppModal'
import StickyCTAButton from '@/components/landing/StickyCTAButton'
import { usePricesUnlocked } from '@/hooks/usePricesUnlocked'
import { useTracking } from '@/contexts/TrackingContext'

export default function LandingPageClient() {
  const { pricesUnlocked, unlockPrices } = usePricesUnlocked()
  const { trackEvent } = useTracking()
  const [modalOpen, setModalOpen] = useState(false)

  const handleWhatsAppSuccess = (whatsapp: string) => {
    unlockPrices(whatsapp)
    trackEvent('whatsapp_success', { whatsapp_hash: btoa(whatsapp) })
    setModalOpen(false)
  }

  const openWhatsAppModal = () => {
    setModalOpen(true)
  }

  return (
    <>
      <ScrollProgressBar />
      
      {/* ⚠️ NOVA ESTRUTURA IMPLEMENTADA - TESTE DE ATUALIZAÇÃO ⚠️ */}
      <div className="min-h-screen" style={{ backgroundColor: '#FFFBF7' }}>
        {/* 1. Hero Section com dual CTA */}
        <HeroSection />
        
        {/* 2. Social Proof (340+ lojistas, 4.8 Google Reviews) */}
        <SocialProofSection />
        
        {/* 4. Solução/Benefícios - REMOVIDO */}
        
        {/* 5. Product Showcase com 3 Kits (NÃO ALTERAR - JÁ ESTÁ PRONTA) */}
        <KitsSection 
          pricesUnlocked={pricesUnlocked} 
          onRequestWhatsApp={openWhatsAppModal}
        />
        
        {/* 6. Testimonials */}
        <TestimonialsSection />
        
        {/* 7. Tabela Comparativa vs Concorrentes */}
        <ComparisonSection />
        
        {/* 8. Como Funciona (4 passos) */}
        <ProcessSection />
        
        {/* 9. FAQ */}
        <FAQSection />
        
        {/* 10. CTA Final */}
        <FinalCTA onRequestWhatsApp={openWhatsAppModal} />
      </div>
      
      {/* Floating Navigation */}
      <FloatingNav />
      
      {/* WhatsApp Modal */}
      <WhatsAppModal 
        isOpen={modalOpen}
        onSuccess={handleWhatsAppSuccess}
        onClose={() => setModalOpen(false)}
      />
      
      {/* Sticky CTA Button for Mobile */}
      <StickyCTAButton onRequestWhatsApp={openWhatsAppModal} />
    </>
  )
}