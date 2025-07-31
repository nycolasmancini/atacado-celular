'use client'

import { useCallback } from 'react'

interface UseSmoothScrollOptions {
  offset?: number
  duration?: number
}

export function useSmoothScroll(options: UseSmoothScrollOptions = {}) {
  const { offset = 80, duration = 800 } = options

  const scrollToElement = useCallback((
    target: string | Element,
    customOffset?: number
  ) => {
    let element: Element | null = null
    
    if (typeof target === 'string') {
      // Handle both ID selectors and element IDs
      const selector = target.startsWith('#') ? target : `#${target}`
      element = document.querySelector(selector)
    } else {
      element = target
    }

    if (!element) {
      console.warn(`Element not found: ${target}`)
      return
    }

    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
    const finalOffset = customOffset !== undefined ? customOffset : offset
    const targetPosition = elementPosition - finalOffset

    // Smooth scroll with easing
    const startPosition = window.pageYOffset
    const distance = targetPosition - startPosition
    const startTime = performance.now()

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3)
    }

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / duration, 1)
      
      const easedProgress = easeOutCubic(progress)
      const currentPosition = startPosition + (distance * easedProgress)
      
      window.scrollTo(0, currentPosition)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }, [offset, duration])

  const scrollToTop = useCallback((customDuration?: number) => {
    const scrollDuration = customDuration || duration
    const startPosition = window.pageYOffset
    const startTime = performance.now()

    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3)
    }

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime
      const progress = Math.min(timeElapsed / scrollDuration, 1)
      
      const easedProgress = easeOutCubic(progress)
      const currentPosition = startPosition * (1 - easedProgress)
      
      window.scrollTo(0, currentPosition)
      
      if (progress < 1) {
        requestAnimationFrame(animateScroll)
      }
    }

    requestAnimationFrame(animateScroll)
  }, [duration])

  return { scrollToElement, scrollToTop }
}