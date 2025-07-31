'use client'

import { useState, useEffect } from 'react'

export default function UrgencyBanner() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [kitsLeft, setKitsLeft] = useState(12) // Default value to prevent hydration mismatch  
  const [isVisible, setIsVisible] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return // Only run on client side
    
    // Initialize kits count (simulate scarcity)
    const savedKits = localStorage.getItem('pmcell-kits-left')
    const today = new Date().toDateString()
    const lastReset = localStorage.getItem('pmcell-last-reset')

    if (lastReset !== today) {
      // Reset daily
      const randomKits = Math.floor(Math.random() * 15) + 8 // 8-22 kits
      setKitsLeft(randomKits)
      localStorage.setItem('pmcell-kits-left', randomKits.toString())
      localStorage.setItem('pmcell-last-reset', today)
    } else {
      setKitsLeft(parseInt(savedKits || '12'))
    }
  }, [isClient])

  useEffect(() => {
    if (!isClient) return // Only run on client side
    
    const calculateTimeLeft = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const difference = tomorrow.getTime() - now.getTime()
      
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)
      
      return { hours, minutes, seconds }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    // Initial calculation
    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [isClient])

  useEffect(() => {
    if (!isClient) return // Only run on client side
    
    // Simulate kit purchases (decrease randomly)
    const decreaseKits = () => {
      if (Math.random() < 0.15 && kitsLeft > 3) { // 15% chance every 30s, minimum 3 kits
        const newCount = kitsLeft - 1
        setKitsLeft(newCount)
        localStorage.setItem('pmcell-kits-left', newCount.toString())
      }
    }

    const interval = setInterval(decreaseKits, 30000) // Every 30 seconds
    return () => clearInterval(interval)
  }, [kitsLeft, isClient])

  if (!isVisible) return null

  const formatTime = (time: number) => time.toString().padStart(2, '0')

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 text-white shadow-lg">
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 md:top-3 md:right-4 w-6 h-6 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors duration-200"
        aria-label="Fechar banner"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="container mx-auto px-4 py-2 md:py-3">
        <div className="flex flex-col md:flex-row items-center justify-center text-center space-y-2 md:space-y-0 md:space-x-6">
          {/* Main Message */}
          <div className="flex items-center space-x-2">
            <span className="text-yellow-300 animate-pulse">⚡</span>
            <span className="text-12px md:text-16px font-montserrat font-bold animate-pulse">
              OFERTA ESPECIAL: Desconto válido apenas hoje!
            </span>
          </div>

          {/* Countdown Timer */}
          <div className="flex items-center space-x-2">
            <span className="text-10px md:text-14px font-inter">Termina em:</span>
            <div className="flex items-center space-x-1 bg-white/20 rounded-lg px-2 py-1">
              <div className="flex flex-col items-center">
                <span className="text-12px md:text-16px font-montserrat font-bold leading-none">
                  {formatTime(timeLeft.hours)}
                </span>
                <span className="text-8px md:text-10px opacity-80 leading-none">h</span>
              </div>
              <span className="text-12px md:text-16px font-bold">:</span>
              <div className="flex flex-col items-center">
                <span className="text-12px md:text-16px font-montserrat font-bold leading-none">
                  {formatTime(timeLeft.minutes)}
                </span>
                <span className="text-8px md:text-10px opacity-80 leading-none">m</span>
              </div>
              <span className="text-12px md:text-16px font-bold">:</span>
              <div className="flex flex-col items-center">
                <span className="text-12px md:text-16px font-montserrat font-bold leading-none">
                  {formatTime(timeLeft.seconds)}
                </span>
                <span className="text-8px md:text-10px opacity-80 leading-none">s</span>
              </div>
            </div>
          </div>

          {/* Scarcity Message */}
          <div className="flex items-center space-x-2">
            <span className="text-yellow-300">🔥</span>
            <span className="text-10px md:text-14px font-inter">
              Restam apenas{' '}
              <span className="font-montserrat font-bold text-yellow-300 animate-pulse">
                {kitsLeft} kits
              </span>
              {' '}com preço promocional
            </span>
          </div>
        </div>
      </div>

      {/* Animated border bottom */}
      <div className="h-1 bg-gradient-to-r from-transparent via-yellow-300 to-transparent animate-pulse opacity-60"></div>
    </div>
  )
}

// Add global styles for pulsing animation
export const urgencyStyles = `
  @keyframes gentle-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
  
  .animate-gentle-pulse {
    animation: gentle-pulse 2s infinite;
  }
`