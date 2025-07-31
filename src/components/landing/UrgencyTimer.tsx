'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '@/lib/tracking-disabled'

interface UrgencyTimerProps {
  title?: string
  subtitle?: string
  className?: string
  onExpire?: () => void
}

interface TimeLeft {
  hours: number
  minutes: number
  seconds: number
}

export default function UrgencyTimer({ 
  title = "⚡ OFERTA ESPECIAL TERMINA EM:",
  subtitle = "Não perca esta oportunidade única!",
  className = '',
  onExpire
}: UrgencyTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)
  const [targetTime, setTargetTime] = useState<number>(0)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Configurar timer inicial
  useEffect(() => {
    if (!isClient) return // Only run on client side
    
    const getTargetTime = () => {
      const stored = localStorage.getItem('urgency_timer_target')
      
      if (stored) {
        const storedTime = parseInt(stored)
        // Se o timer expirou, criar um novo
        if (Date.now() > storedTime) {
          return createNewTimer()
        }
        return storedTime
      }
      
      return createNewTimer()
    }

    const createNewTimer = () => {
      // Timer de 4-6 horas (randomizado para parecer mais natural)
      const hoursToAdd = 4 + Math.random() * 2
      const newTarget = Date.now() + (hoursToAdd * 60 * 60 * 1000)
      localStorage.setItem('urgency_timer_target', newTarget.toString())
      
      // Track timer creation
      trackEvent('urgency_timer_created', {
        target_time: new Date(newTarget).toISOString(),
        duration_hours: hoursToAdd
      })
      
      return newTarget
    }

    const target = getTargetTime()
    setTargetTime(target)
  }, [isClient])

  // Atualizar contador a cada segundo
  useEffect(() => {
    if (!targetTime || !isClient) return

    const updateTimer = () => {
      const now = Date.now()
      const difference = targetTime - now

      if (difference <= 0) {
        setIsExpired(true)
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        
        // Track expiration
        trackEvent('urgency_timer_expired', {
          expired_at: new Date().toISOString()
        })
        
        onExpire?.()
        return
      }

      const hours = Math.floor(difference / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeLeft({ hours, minutes, seconds })
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [targetTime, onExpire, isClient])

  // Track quando timer fica visível (para analytics)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          trackEvent('urgency_timer_viewed', {
            time_left_hours: timeLeft.hours,
            time_left_minutes: timeLeft.minutes,
            time_left_seconds: timeLeft.seconds
          })
        }
      },
      { threshold: 0.5 }
    )

    const element = document.getElementById('urgency-timer')
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [timeLeft])

  const formatNumber = (num: number) => num.toString().padStart(2, '0')

  if (isExpired) {
    return (
      <motion.div 
        id="urgency-timer"
        className={`bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-4 text-center shadow-lg ${className}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2">
          <span className="text-xl">⏰</span>
          <span className="font-bold">OFERTA EXPIRADA!</span>
        </div>
        <p className="text-sm opacity-90 mt-1">
          Aguarde a próxima oportunidade
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div 
      id="urgency-timer"
      className={`bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg p-6 text-center shadow-lg ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h3 
        className="font-bold text-lg mb-2"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {title}
      </motion.h3>
      
      <div className="flex justify-center gap-4 mb-3">
        {/* Horas */}
        <div className="bg-white/20 rounded-lg p-3 min-w-[70px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={timeLeft.hours}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-mono font-bold"
            >
              {formatNumber(timeLeft.hours)}
            </motion.div>
          </AnimatePresence>
          <div className="text-xs opacity-90">HORAS</div>
        </div>

        <div className="flex items-center text-2xl font-bold">:</div>

        {/* Minutos */}
        <div className="bg-white/20 rounded-lg p-3 min-w-[70px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={timeLeft.minutes}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-mono font-bold"
            >
              {formatNumber(timeLeft.minutes)}
            </motion.div>
          </AnimatePresence>
          <div className="text-xs opacity-90">MIN</div>
        </div>

        <div className="flex items-center text-2xl font-bold">:</div>

        {/* Segundos */}
        <div className="bg-white/20 rounded-lg p-3 min-w-[70px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={timeLeft.seconds}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-2xl font-mono font-bold"
              animate={timeLeft.seconds <= 10 ? { 
                scale: [1, 1.2, 1],
                color: ['#ffffff', '#ffff00', '#ffffff']
              } : undefined}
            >
              {formatNumber(timeLeft.seconds)}
            </motion.div>
          </AnimatePresence>
          <div className="text-xs opacity-90">SEG</div>
        </div>
      </div>

      <p className="text-sm opacity-90">{subtitle}</p>

      {/* Indicador de urgência baseado no tempo restante */}
      {timeLeft.hours === 0 && timeLeft.minutes < 30 && (
        <motion.div 
          className="mt-3 bg-yellow-400 text-red-800 rounded-full px-3 py-1 text-xs font-bold inline-block"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          🔥 ÚLTIMOS MINUTOS!
        </motion.div>
      )}
    </motion.div>
  )
}

// Componente de escassez (kits restantes)
interface ScarcityCounterProps {
  initialCount?: number
  minCount?: number
  kitName?: string
  className?: string
}

export function ScarcityCounter({ 
  initialCount = 47,
  minCount = 8,
  kitName = "kit",
  className = ''
}: ScarcityCounterProps) {
  const [remainingKits, setRemainingKits] = useState(initialCount) // Default to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return // Only run on client side
    
    const storageKey = `scarcity_${kitName}_remaining`
    const stored = localStorage.getItem(storageKey)
    
    if (stored) {
      const storedCount = parseInt(stored)
      if (storedCount >= minCount) {
        setRemainingKits(storedCount)
        return
      }
    }

    // Gerar número inicial com alguma variação
    const variation = Math.floor(Math.random() * 10) - 5 // -5 a +5
    const count = Math.max(minCount, initialCount + variation)
    setRemainingKits(count)
    localStorage.setItem(storageKey, count.toString())
  }, [initialCount, minCount, kitName, isClient])

  // Simular redução gradual dos kits
  useEffect(() => {
    if (!isClient) return // Only run on client side
    
    const interval = setInterval(() => {
      setRemainingKits(prev => {
        if (prev <= minCount) return prev
        
        // Chance de 15% de reduzir 1 kit a cada minuto
        if (Math.random() < 0.15) {
          const newCount = prev - 1
          localStorage.setItem(`scarcity_${kitName}_remaining`, newCount.toString())
          
          // Track scarcity update
          trackEvent('scarcity_updated', {
            kit_name: kitName,
            remaining_count: newCount,
            timestamp: new Date().toISOString()
          })
          
          return newCount
        }
        return prev
      })
    }, 60000) // A cada minuto

    return () => clearInterval(interval)
  }, [kitName, minCount, isClient])

  const getUrgencyColor = () => {
    if (remainingKits <= 15) return 'from-red-500 to-red-600'
    if (remainingKits <= 25) return 'from-orange-500 to-red-500'
    return 'from-orange-400 to-orange-500'
  }

  const getUrgencyText = () => {
    if (remainingKits <= 10) return '🔥 ÚLTIMAS UNIDADES!'
    if (remainingKits <= 20) return '⚠️ ESTOQUE BAIXO!'
    return '📦 DISPONÍVEL AGORA'
  }

  return (
    <motion.div 
      className={`bg-gradient-to-r ${getUrgencyColor()} text-white rounded-lg p-4 text-center shadow-md ${className}`}
      animate={remainingKits <= 15 ? { scale: [1, 1.02, 1] } : undefined}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <div className="flex items-center justify-center gap-2 mb-1">
        <span className="text-lg font-bold">{getUrgencyText()}</span>
      </div>
      
      <div className="flex items-center justify-center gap-1">
        <span className="text-sm opacity-90">Restam apenas</span>
        <motion.span 
          className="text-xl font-bold"
          key={remainingKits}
          initial={{ scale: 1.2, color: '#ffff00' }}
          animate={{ scale: 1, color: '#ffffff' }}
          transition={{ duration: 0.5 }}
        >
          {remainingKits}
        </motion.span>
        <span className="text-sm opacity-90">unidades</span>
      </div>
    </motion.div>
  )
}