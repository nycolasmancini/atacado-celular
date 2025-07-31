'use client'

import { useEffect, useRef } from 'react'
import { trackScrollDepth } from '@/lib/gtm'

interface ScrollDepthConfig {
  thresholds?: number[]
  throttleMs?: number
  enabled?: boolean
}

export const useScrollDepthTracking = ({
  thresholds = [25, 50, 75, 100],
  throttleMs = 100,
  enabled = true
}: ScrollDepthConfig = {}) => {
  const trackedThresholds = useRef<Set<number>>(new Set())
  const lastScrollTime = useRef<number>(0)

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return

    const handleScroll = () => {
      const now = Date.now()
      
      // Throttle scroll events
      if (now - lastScrollTime.current < throttleMs) return
      lastScrollTime.current = now

      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop

      // Calculate scroll percentage
      const scrollableHeight = documentHeight - windowHeight
      const scrollPercentage = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0

      // Check each threshold
      thresholds.forEach(threshold => {
        if (
          scrollPercentage >= threshold && 
          !trackedThresholds.current.has(threshold) &&
          (threshold === 25 || threshold === 50 || threshold === 75 || threshold === 100)
        ) {
          trackedThresholds.current.add(threshold)
          trackScrollDepth(threshold as 25 | 50 | 75 | 100)
        }
      })
    }

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Initial check
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [thresholds, throttleMs, enabled])

  // Reset tracking (useful for SPA navigation)
  const resetTracking = () => {
    trackedThresholds.current.clear()
  }

  return { resetTracking }
}