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
import LeadCaptureSystem from '@/components/landing/LeadCaptureSystem'
import ConversionOptimizations from '@/components/landing/ConversionOptimizations'
import { usePricesUnlocked } from '@/hooks/usePricesUnlocked'
// import { useTracking } from '@/contexts/TrackingContext'

export default function LandingPage() {
  const { pricesUnlocked, unlockPrices } = usePricesUnlocked()
  // const { updateTrackingData } = useTracking()
  const [modalOpen, setModalOpen] = useState(false)

  const handleWhatsAppSuccess = (whatsapp: string) => {
    unlockPrices(whatsapp)
    // updateTrackingData({ whatsapp })
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
      
      {/* Solution/Benefits Section */}
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

      {/* Lead Capture System - Temporarily disabled to prevent loops */}
      {/* <LeadCaptureSystem /> */}

      {/* Conversion Optimizations - Temporarily disabled to prevent loops */}
      {/* <ConversionOptimizations /> */}
    </>
  )
}