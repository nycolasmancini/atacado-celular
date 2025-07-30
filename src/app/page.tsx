'use client'

import { useEffect, useState } from 'react'
import HeroSection from '@/components/landing/HeroSection'
import KitsSection from '@/components/landing/KitsSection'
import { WhatsAppModal } from '@/components/landing/WhatsAppModal'

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [pricesUnlocked, setPricesUnlocked] = useState(false)

  // Mock do sistema de preços desbloqueados
  useEffect(() => {
    const unlocked = localStorage.getItem('prices_unlocked')
    if (!unlocked) {
      const timer = setTimeout(() => {
        setModalOpen(true)
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setPricesUnlocked(true)
    }
  }, [])

  const handleWhatsAppSuccess = (whatsapp: string) => {
    localStorage.setItem('prices_unlocked', 'true')
    localStorage.setItem('whatsapp', whatsapp)
    setPricesUnlocked(true)
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
