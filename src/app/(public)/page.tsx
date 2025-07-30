'use client'

import { useEffect, useState } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import KitsSection from '@/components/landing/KitsSection'
import { WhatsAppModal } from '@/components/landing/WhatsAppModal'
import { usePricesUnlocked } from '@/hooks/usePricesUnlocked'
import { useTracking } from '@/contexts/TrackingContext'

export default function LandingPage() {
  const { pricesUnlocked, isLoading, unlockPrices } = usePricesUnlocked()
  const { trackEvent, updateTrackingData } = useTracking()
  const [modalOpen, setModalOpen] = useState(false)

  // Auto-abrir modal se preços não estão liberados
  useEffect(() => {
    if (!isLoading && !pricesUnlocked) {
      // Delay para não atrapalhar a experiência inicial
      const timer = setTimeout(() => {
        setModalOpen(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [isLoading, pricesUnlocked])

  const handleWhatsAppSuccess = (whatsapp: string) => {
    unlockPrices(whatsapp)
    updateTrackingData({ whatsapp })
    setModalOpen(false)
  }

  return (
    <>
      <HeroSection />
      <KitsSection pricesUnlocked={pricesUnlocked} />
      
      {/* WhatsApp Modal */}
      <WhatsAppModal 
        isOpen={modalOpen}
        onSuccess={handleWhatsAppSuccess}
      />
    </>
  )
}