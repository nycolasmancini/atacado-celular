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
      // Timer até às 22:43 do mesmo dia ou próximo dia
      const now = new Date()
      const resetTime = new Date()
      resetTime.setHours(22, 43, 0, 0)
      
      // Se já passou das 22:43 hoje, definir para amanhã às 22:43
      if (now > resetTime) {
        resetTime.setDate(resetTime.getDate() + 1)
      }
      
      const newTarget = resetTime.getTime()
      localStorage.setItem('urgency_timer_target', newTarget.toString())
      
      // Track timer creation
      trackEvent('urgency_timer_created', {
        target_time: new Date(newTarget).toISOString(),
        reset_time: '22:43'
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
  initialCount = 24, // Alterado para 24 kits por dia
  minCount = 1,
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
    
    // Sistema de estoque limitado por dia (24 kits)
    const getKitsLeft = () => {
      const now = new Date()
      const resetTime = new Date()
      resetTime.setHours(22, 43, 0, 0) // Reset às 22:43
      
      // Se já passou das 22:43 hoje, o próximo reset é amanhã
      if (now > resetTime) {
        resetTime.setDate(resetTime.getDate() + 1)
      }
      
      const lastResetKey = `scarcity_${kitName}_last_reset_2243`
      const kitsKey = `scarcity_${kitName}_remaining_2243`
      const resetTimeKey = `scarcity_${kitName}_reset_time_2243`
      
      const lastReset = localStorage.getItem(lastResetKey)
      const storedResetTime = localStorage.getItem(resetTimeKey)
      const currentResetTime = resetTime.getTime().toString()
      
      // Se é um novo ciclo (novo reset time)
      if (lastReset !== currentResetTime || storedResetTime !== currentResetTime) {
        // Começar com 24 kits
        setRemainingKits(24)
        localStorage.setItem(kitsKey, '24')
        localStorage.setItem(lastResetKey, currentResetTime)
        localStorage.setItem(resetTimeKey, currentResetTime)
        localStorage.setItem(`scarcity_${kitName}_start_time_2243`, now.getTime().toString())
      } else {
        // Calcular quantos kits restam baseado no tempo passado desde o último reset às 22:43
        const lastResetTime = new Date()
        lastResetTime.setHours(22, 43, 0, 0)
        
        // Se ainda não passou das 22:43 hoje, o último reset foi ontem
        if (now.getHours() < 22 || (now.getHours() === 22 && now.getMinutes() < 43)) {
          lastResetTime.setDate(lastResetTime.getDate() - 1)
        }
        
        const hoursPassedSinceReset = (now.getTime() - lastResetTime.getTime()) / (1000 * 60 * 60)
        const kitsConsumed = Math.floor(hoursPassedSinceReset) // 1 kit por hora
        const remainingKits = Math.max(1, 24 - kitsConsumed) // Mínimo 1 kit
        
        setRemainingKits(remainingKits)
        localStorage.setItem(kitsKey, remainingKits.toString())
      }
    }
    
    getKitsLeft()
    
    // Atualizar a cada minuto para mostrar redução em tempo real
    const interval = setInterval(getKitsLeft, 60000)
    return () => clearInterval(interval)
  }, [initialCount, minCount, kitName, isClient])

  const getUrgencyColor = () => {
    if (remainingKits <= 5) return 'from-red-500 to-red-600'
    if (remainingKits <= 12) return 'from-orange-500 to-red-500'
    return 'from-orange-400 to-orange-500'
  }

  const getUrgencyText = () => {
    if (remainingKits <= 3) return '🔥 ÚLTIMOS KITS HOJE!'
    if (remainingKits <= 8) return '⚠️ ESTOQUE BAIXO!'
    return '📦 DISPONÍVEL HOJE'
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
        <span className="text-sm opacity-90">kits HOJE</span>
      </div>
    </motion.div>
  )
}