'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasShown, setHasShown] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (hasShown || !isClient) return // Only run on client side

    const handleMouseLeave = (event: MouseEvent) => {
      // Only trigger if mouse leaves through the top of the page
      if (event.clientY <= 0) {
        setIsOpen(true)
        setHasShown(true)
      }
    }

    // Delay adding the event listener to avoid immediate triggers
    const timeout = setTimeout(() => {
      if (typeof document !== 'undefined') {
        document.addEventListener('mouseleave', handleMouseLeave)
      }
    }, 3000) // Wait 3 seconds before activating

    return () => {
      clearTimeout(timeout)
      if (typeof document !== 'undefined') {
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [hasShown, isClient])

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Oi! Vi a oferta especial no site e quero saber mais sobre os kits!')
    if (typeof window !== 'undefined') {
      window.open(`https://wa.me/5511981326609?text=${message}`, '_blank')
    }
    setIsOpen(false)
  }

  const handleViewKits = () => {
    if (typeof document !== 'undefined') {
      const kitsSection = document.getElementById('kits-section')
      if (kitsSection) {
        kitsSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsOpen(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0, 0, 0, 0.8)' }}
            onClick={handleClose}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-md w-full rounded-xl p-6 text-center shadow-2xl"
              style={{ background: 'var(--preto-puro)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>

              {/* Content */}
              <div className="mb-6">
                <div className="text-4xl mb-4">🛑</div>
                <h2 
                  className="text-2xl font-bold mb-4"
                  style={{ color: 'var(--amarelo-destaque)' }}
                >
                  ESPERE!
                </h2>
                <p 
                  className="text-lg mb-2"
                  style={{ color: 'var(--branco)' }}
                >
                  Antes de sair, que tal uma
                </p>
                <p 
                  className="text-xl font-bold mb-4"
                  style={{ color: 'var(--vermelho-cta)' }}
                >
                  OFERTA ESPECIAL?
                </p>
                <p 
                  className="text-base mb-6"
                  style={{ color: 'var(--branco)' }}
                >
                  🎯 <span style={{ color: 'var(--amarelo-destaque)' }}>15% OFF</span> adicional no seu primeiro pedido + Frete GRÁTIS!
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleWhatsApp}
                  className="cta-aggressive w-full py-3 px-6 text-lg font-bold rounded-lg"
                >
                  🔥 QUERO MINHA OFERTA!
                </button>
                
                <button
                  onClick={handleViewKits}
                  className="btn-aggressive-secondary w-full py-3 px-6 text-base font-bold rounded-lg"
                >
                  Ver Kits Disponíveis
                </button>
                
                <button
                  onClick={handleClose}
                  className="w-full py-2 px-4 text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Não, obrigado
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}