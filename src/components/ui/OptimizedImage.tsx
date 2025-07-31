'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  priority?: boolean
  className?: string
  fill?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  // Advanced optimization props
  lazy?: boolean
  fadeIn?: boolean
  retryAttempts?: number
  fallbackSrc?: string
  onLoad?: () => void
  onError?: () => void
  // Performance tracking
  trackPerformance?: boolean
  // Intersection Observer for lazy loading
  rootMargin?: string
  threshold?: number
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  fill = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  // Advanced props
  lazy = true,
  fadeIn = true,
  retryAttempts = 2,
  fallbackSrc,
  onLoad,
  onError,
  trackPerformance = false,
  rootMargin = '50px',
  threshold = 0.1,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [currentSrc, setCurrentSrc] = useState(src)
  const [retryCount, setRetryCount] = useState(0)
  const [isInView, setIsInView] = useState(!lazy || priority)
  const [loadStartTime, setLoadStartTime] = useState<number | null>(null)
  
  const imageRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || priority || isInView) return

    const currentImageRef = imageRef.current
    if (!currentImageRef) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    observerRef.current.observe(currentImageRef)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [lazy, priority, rootMargin, threshold, isInView])

  // Update src when prop changes
  useEffect(() => {
    setCurrentSrc(src)
    setHasError(false)
    setRetryCount(0)
    setIsLoading(true)
  }, [src])

  // Generate a simple blur placeholder if none provided
  const generateBlurDataURL = (w: number, h: number) => {
    const svg = `
      <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)" />
      </svg>
    `
    return `data:image/svg+xml;base64,${btoa(svg)}`
  }

  // Performance tracking
  const trackImagePerformance = (eventType: 'load' | 'error', duration?: number) => {
    if (!trackPerformance) return

    const performanceData = {
      eventType,
      src: currentSrc,
      alt,
      duration,
      timestamp: Date.now(),
      retryCount,
    }

    // Send to analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'image_performance', {
        event_category: 'Image',
        event_label: eventType,
        value: duration || 0,
        custom_map: performanceData,
      })
    }
  }

  const handleLoadStart = () => {
    setLoadStartTime(Date.now())
  }

  const handleLoad = () => {
    setIsLoading(false)
    
    const loadTime = loadStartTime ? Date.now() - loadStartTime : 0
    trackImagePerformance('load', loadTime)
    
    onLoad?.()
  }

  const handleError = () => {
    const shouldRetry = retryCount < retryAttempts
    const hasFallback = fallbackSrc && currentSrc !== fallbackSrc

    if (shouldRetry) {
      setRetryCount(prev => prev + 1)
      // Retry with a delay
      setTimeout(() => {
        setIsLoading(true)
        setHasError(false)
      }, 1000 * (retryCount + 1))
      return
    }

    if (hasFallback) {
      setCurrentSrc(fallbackSrc)
      setRetryCount(0)
      setIsLoading(true)
      setHasError(false)
      return
    }

    setHasError(true)
    setIsLoading(false)
    
    trackImagePerformance('error')
    onError?.()
  }

  if (hasError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="text-gray-500 text-center p-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-xs">Imagem indisponível</span>
        </div>
      </div>
    )
  }

  // Don't render the image until it's in view (for lazy loading)
  if (!isInView && lazy && !priority) {
    return (
      <div 
        ref={imageRef}
        className={`bg-gray-200 ${className}`}
        style={fill ? {} : { width, height }}
      >
        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
      </div>
    )
  }

  return (
    <div 
      ref={imageRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={fill ? {} : { width, height }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
        </div>
      )}

      {/* Retry indicator */}
      {retryCount > 0 && isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            Tentativa {retryCount}/{retryAttempts}
          </div>
        </div>
      )}
      
      <Image
        src={currentSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={`
          ${fadeIn ? 'transition-opacity duration-500 ease-in-out' : ''}
          ${isLoading ? 'opacity-0' : 'opacity-100'}
          ${fill ? 'object-cover' : ''}
        `}
        placeholder={placeholder}
        blurDataURL={blurDataURL || generateBlurDataURL(width, height)}
        onLoadStart={handleLoadStart}
        onLoad={handleLoad}
        onError={handleError}
        // Performance optimizations
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        // Accessibility
        role="img"
        // Security
        referrerPolicy="no-referrer"
      />
    </div>
  )
}