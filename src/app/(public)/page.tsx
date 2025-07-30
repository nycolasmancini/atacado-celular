'use client'

import { useState } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import KitsSection from '@/components/landing/KitsSection'
import { WhatsAppModal } from '@/components/landing/WhatsAppModal'
import { usePricesUnlocked } from '@/hooks/usePricesUnlocked'
import { useTracking } from '@/contexts/TrackingContext'

export default function LandingPage() {
  const { pricesUnlocked, unlockPrices } = usePricesUnlocked()
  const { updateTrackingData } = useTracking()
  const [modalOpen, setModalOpen] = useState(false)

  const handleWhatsAppSuccess = (whatsapp: string) => {
    unlockPrices(whatsapp)
    updateTrackingData({ whatsapp })
    setModalOpen(false)
  }

  const openWhatsAppModal = () => {
    setModalOpen(true)
  }

  return (
    <>
      <HeroSection />
      <KitsSection 
        pricesUnlocked={pricesUnlocked} 
        onRequestWhatsApp={openWhatsAppModal}
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