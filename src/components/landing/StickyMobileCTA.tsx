'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StickyMobileCTAProps {
  onKitClick: () => void
  onWhatsAppClick: () => void
}

export default function StickyMobileCTA({ onKitClick, onWhatsAppClick }: StickyMobileCTAProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [activeButton, setActiveButton] = useState<'kit' | 'whatsapp'>('kit')

  useEffect(() => {
    const handleScroll = () => {
      // Show CTA after scrolling past hero section
      const scrollPosition = window.scrollY
      const heroHeight = window.innerHeight
      setIsVisible(scrollPosition > heroHeight * 0.8)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 20 }}
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 shadow-lg"
        >
          <div className="px-4 py-3">
            <div className="flex gap-3">
              {/* WhatsApp Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onWhatsAppClick}
                className="flex-1 flex items-center justify-center space-x-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-full transition-colors duration-300"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.567-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
                </svg>
                <span className="text-sm">WhatsApp</span>
              </motion.button>

              {/* Kit CTA Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onKitClick}
                className="flex-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg text-sm"
              >
                VER KITS AGORA
              </motion.button>
            </div>
          </div>

          {/* Safe area for devices with home indicator */}
          <div className="h-safe-area-inset-bottom" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}