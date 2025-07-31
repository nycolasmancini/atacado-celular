'use client'

import { useState } from 'react'
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

export default function SimpleLandingPage() {
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
      
      {/* Social Proof */}
      <SocialProofSection />
      
      {/* Problems Section */}
      <ProblemsSection />
      
      {/* Solution Section */}
      <SolutionSection />
      
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