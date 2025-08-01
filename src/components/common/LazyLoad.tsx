'use client'

import React, { 
  useState, 
  useEffect, 
  useRef, 
  ReactNode, 
  CSSProperties,
  ErrorInfo
} from 'react'

interface LazyLoadProps {
  children: ReactNode
  fallback?: ReactNode
  rootMargin?: string
  threshold?: number | number[]
  triggerOnce?: boolean
  height?: string | number
  className?: string
  style?: CSSProperties
  onLoad?: () => void
  onError?: (error: Error) => void
}

interface LazyLoadState {
  isVisible: boolean
  hasError: boolean
  error?: Error
}

// Error Boundary Component
class LazyLoadErrorBoundary extends React.Component<
  { children: ReactNode; fallback?: ReactNode; onError?: (error: Error) => void },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LazyLoad Error:', error, errorInfo)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-sm">Erro ao carregar conteúdo</div>
        </div>
      )
    }

    return this.props.children
  }
}

// Default loading placeholder
const DefaultFallback = ({ height }: { height?: string | number }) => (
  <div 
    className="animate-pulse bg-gray-200 rounded-lg flex items-center justify-center"
    style={{ 
      height: typeof height === 'number' ? `${height}px` : height || '200px',
      minHeight: '100px'
    }}
  >
    <div className="flex flex-col items-center space-y-2 text-gray-400">
      <div className="w-8 h-8 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-sm">Carregando...</div>
    </div>
  </div>
)

export function LazyLoad({
  children,
  fallback,
  rootMargin = '50px',
  threshold = 0.1,
  triggerOnce = true,
  height,
  className = '',
  style,
  onLoad,
  onError,
}: LazyLoadProps) {
  const [state, setState] = useState<LazyLoadState>({
    isVisible: false,
    hasError: false,
  })
  
  const elementRef = useRef<HTMLDivElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately if IntersectionObserver is not supported
      setState(prev => ({ ...prev, isVisible: true }))
      onLoad?.()
      return
    }

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        
        if (entry.isIntersecting) {
          setState(prev => ({ ...prev, isVisible: true }))
          onLoad?.()
          
          // Disconnect observer if triggerOnce is true
          if (triggerOnce && observerRef.current) {
            observerRef.current.disconnect()
          }
        } else if (!triggerOnce) {
          // Allow toggling visibility if not triggerOnce
          setState(prev => ({ ...prev, isVisible: false }))
        }
      },
      {
        rootMargin,
        threshold,
      }
    )

    // Start observing
    observerRef.current.observe(element)

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [rootMargin, threshold, triggerOnce, onLoad])

  // Handle errors
  const handleError = (error: Error) => {
    setState(prev => ({ ...prev, hasError: true, error }))
    onError?.(error)
  }

  const containerStyle: CSSProperties = {
    ...style,
    height: typeof height === 'number' ? `${height}px` : height,
  }

  return (
    <div 
      ref={elementRef}
      className={className}
      style={containerStyle}
    >
      {state.isVisible ? (
        <LazyLoadErrorBoundary 
          fallback={fallback || <DefaultFallback height={height} />}
          onError={handleError}
        >
          {children}
        </LazyLoadErrorBoundary>
      ) : (
        fallback || <DefaultFallback height={height} />
      )}
    </div>
  )
}

// Specialized lazy load components

// LazyImage component
interface LazyImageProps {
  src: string
  alt: string
  className?: string
  style?: CSSProperties
  fallback?: ReactNode
  onLoad?: () => void
  onError?: (error: Error) => void
  width?: number
  height?: number
}

export function LazyImage({
  src,
  alt,
  className = '',
  style,
  fallback,
  onLoad,
  onError,
  width,
  height,
}: LazyImageProps) {
  const [imageState, setImageState] = useState<{
    loaded: boolean
    error: boolean
  }>({
    loaded: false,
    error: false,
  })

  const handleImageLoad = () => {
    setImageState({ loaded: true, error: false })
    onLoad?.()
  }

  const handleImageError = () => {
    const error = new Error(`Failed to load image: ${src}`)
    setImageState({ loaded: false, error: true })
    onError?.(error)
  }

  const imageFallback = fallback || (
    <div 
      className="bg-gray-200 rounded-lg flex items-center justify-center"
      style={{ width, height }}
    >
      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
      </svg>
    </div>
  )

  return (
    <LazyLoad
      height={height}
      className={className}
      style={style}
      fallback={imageFallback}
    >
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`transition-opacity duration-300 ${
          imageState.loaded ? 'opacity-100' : 'opacity-0'
        } ${className}`}
        style={style}
        onLoad={handleImageLoad}
        onError={handleImageError}
        loading="lazy"
      />
      {imageState.error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded">
          <div className="text-center text-gray-500">
            <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-xs">Erro ao carregar imagem</div>
          </div>
        </div>
      )}
    </LazyLoad>
  )
}

// LazySection component for larger content sections
export function LazySection({
  children,
  className = '',
  minHeight = '200px',
  ...props
}: LazyLoadProps & { minHeight?: string }) {
  return (
    <LazyLoad
      className={className}
      height={minHeight}
      fallback={
        <div 
          className="bg-gray-50 rounded-lg animate-pulse flex items-center justify-center"
          style={{ minHeight }}
        >
          <div className="text-center text-gray-400">
            <div className="w-12 h-12 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <div className="text-sm">Carregando seção...</div>
          </div>
        </div>
      }
      {...props}
    >
      {children}
    </LazyLoad>
  )
}

// Hook for manual lazy loading control
export function useLazyLoad(options: {
  rootMargin?: string
  threshold?: number | number[]
  triggerOnce?: boolean
} = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element || !('IntersectionObserver' in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (options.triggerOnce) {
            observer.disconnect()
          }
        } else if (!options.triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        rootMargin: options.rootMargin || '50px',
        threshold: options.threshold || 0.1,
      }
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [options.rootMargin, options.threshold, options.triggerOnce])

  return { isVisible, elementRef }
}