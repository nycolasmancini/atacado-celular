'use client'

import { useState, useRef, useEffect } from 'react'

interface ProductImageProps {
  src?: string
  alt: string
  className?: string
  onClick?: () => void
  width?: number
  height?: number
  priority?: boolean
}

export function ProductImage({ 
  src, 
  alt, 
  className = '', 
  onClick,
  width = 300,
  height = 300,
  priority = false
}: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState(priority) // Load immediately if priority
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !src || isVisible) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => observer.disconnect()
  }, [priority, src, isVisible])

  const handleLoad = () => {
    setIsLoaded(true)
    setHasError(false)
  }

  const handleError = () => {
    setHasError(true)
    setIsLoaded(false)
  }

  // Placeholder content
  const placeholder = (
    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-white">
      {hasError ? (
        <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ) : (
        <div className="flex flex-col items-center space-y-2">
          <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin" />
          <svg className="w-8 h-8 md:w-12 md:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  )

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full ${className}`}
      onClick={onClick}
    >
      {src && isVisible ? (
        <>
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={`
              w-full h-full object-cover transition-all duration-300
              ${isLoaded ? 'opacity-100' : 'opacity-0'}
              ${className.includes('group-hover:scale-105') ? 'group-hover:scale-105' : ''}
              ${className.includes('transition-transform') ? 'transition-transform' : ''}
            `}
            onLoad={handleLoad}
            onError={handleError}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
          />
          {!isLoaded && placeholder}
        </>
      ) : (
        placeholder
      )}
    </div>
  )
}