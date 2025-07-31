'use client'

import { useState, useEffect, useRef } from 'react'

interface UseInViewAnimationOptions {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
  delay?: number
}

export function useInViewAnimation(options: UseInViewAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    triggerOnce = true,
    delay = 0
  } = options

  const [isInView, setIsInView] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const currentElement = elementRef.current
    if (!currentElement) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => {
                setIsInView(true)
                if (triggerOnce) {
                  setHasAnimated(true)
                }
              }, delay)
            } else {
              setIsInView(true)
              if (triggerOnce) {
                setHasAnimated(true)
              }
            }
          } else if (!triggerOnce && !hasAnimated) {
            setIsInView(false)
          }
        })
      },
      {
        threshold,
        rootMargin,
      }
    )

    observer.observe(currentElement)

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement)
      }
    }
  }, [threshold, rootMargin, triggerOnce, delay, hasAnimated])

  return { elementRef, isInView }
}

// Predefined animation classes
export const fadeInAnimations = {
  fadeIn: 'transition-all duration-700 ease-out',
  fadeInUp: 'transition-all duration-700 ease-out',
  fadeInDown: 'transition-all duration-700 ease-out',
  fadeInLeft: 'transition-all duration-700 ease-out',
  fadeInRight: 'transition-all duration-700 ease-out',
  fadeInScale: 'transition-all duration-700 ease-out',
}

export const getAnimationClasses = (
  animationType: keyof typeof fadeInAnimations,
  isInView: boolean
) => {
  const baseClasses = fadeInAnimations[animationType]
  
  const visibilityClasses = {
    fadeIn: isInView ? 'opacity-100' : 'opacity-0',
    fadeInUp: isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
    fadeInDown: isInView ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8',
    fadeInLeft: isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8',
    fadeInRight: isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8',
    fadeInScale: isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
  }

  return `${baseClasses} ${visibilityClasses[animationType]}`
}