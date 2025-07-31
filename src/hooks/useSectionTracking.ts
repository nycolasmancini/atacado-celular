'use client'

import { useEffect, useRef, useCallback } from 'react'
import { trackSectionView, trackSectionTime } from '@/lib/gtm'

interface SectionTrackingConfig {
  sectionName: string
  threshold?: number // Percentage of section that must be visible (0-1)
  minTimeMs?: number // Minimum time spent before tracking
  enabled?: boolean
}

export const useSectionTracking = ({
  sectionName,
  threshold = 0.5,
  minTimeMs = 1000,
  enabled = true
}: SectionTrackingConfig) => {
  const sectionRef = useRef<HTMLElement>(null)
  const startTime = useRef<number | null>(null)
  const hasBeenViewed = useRef<boolean>(false)
  const isCurrentlyVisible = useRef<boolean>(false)

  const handleIntersection = useCallback((entries: IntersectionObserverEntry[]) => {
    const entry = entries[0]
    const isVisible = entry.isIntersecting && entry.intersectionRatio >= threshold

    if (isVisible && !isCurrentlyVisible.current) {
      // Section became visible
      isCurrentlyVisible.current = true
      startTime.current = Date.now()
      
      // Track section view (only once)
      if (!hasBeenViewed.current) {
        hasBeenViewed.current = true
        trackSectionView(sectionName)
      }
    } else if (!isVisible && isCurrentlyVisible.current) {
      // Section became invisible
      isCurrentlyVisible.current = false
      
      if (startTime.current) {
        const timeSpent = Date.now() - startTime.current
        
        // Only track if minimum time threshold is met
        if (timeSpent >= minTimeMs) {
          trackSectionTime(sectionName, timeSpent / 1000) // Convert to seconds
        }
        
        startTime.current = null
      }
    }
  }, [sectionName, threshold, minTimeMs])

  useEffect(() => {
    if (!enabled || !sectionRef.current || typeof window === 'undefined') return

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: [0, threshold, 1],
      rootMargin: '0px'
    })

    observer.observe(sectionRef.current)

    return () => {
      // Track final time if section is still visible
      if (isCurrentlyVisible.current && startTime.current) {
        const timeSpent = Date.now() - startTime.current
        if (timeSpent >= minTimeMs) {
          trackSectionTime(sectionName, timeSpent / 1000)
        }
      }
      
      observer.disconnect()
    }
  }, [handleIntersection, enabled])

  return sectionRef
}