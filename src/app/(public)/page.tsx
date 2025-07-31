'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/landing/HeroSection'
import { WhatsAppButton } from '@/components/landing/WhatsAppButton'
import { WhatsAppModal } from '@/components/landing/WhatsAppModal'
import StickyMobileCTA from '@/components/landing/StickyMobileCTA'
import { usePricesUnlocked } from '@/hooks/usePricesUnlocked'

// Lazy load componentes não críticos
const SocialProofSection = dynamic(() => import('@/components/landing/SocialProofSection'))
const ProblemsSection = dynamic(() => import('@/components/landing/ProblemsSection'))
const SolutionSection = dynamic(() => import('@/components/landing/SolutionSection'))
const ProfitCalculator = dynamic(() => import('@/components/landing/ProfitCalculator'))
const KitsSection = dynamic(() => import('@/components/landing/KitsSection'))
const TestimonialsSection = dynamic(() => import('@/components/landing/TestimonialsSection'))
const ComparisonSection = dynamic(() => import('@/components/landing/ComparisonSection'))
const ProcessSection = dynamic(() => import('@/components/landing/ProcessSection'))
const FAQSection = dynamic(() => import('@/components/landing/FAQSection'))
const UrgencySection = dynamic(() => import('@/components/landing/UrgencySection'))
const FinalCTA = dynamic(() => import('@/components/landing/FinalCTA'))

export default function LandingPage() {
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
      <SocialProofSection />
      <ProblemsSection />
      <SolutionSection />
      <ProfitCalculator />
      <KitsSection 
        pricesUnlocked={pricesUnlocked} 
        onRequestWhatsApp={openWhatsAppModal}
      />
      <TestimonialsSection />
      <ComparisonSection />
      <ProcessSection />
      <FAQSection />
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