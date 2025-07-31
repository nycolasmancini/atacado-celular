'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ImageSkeleton } from './LoadingSkeleton'

interface EnhancedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  skeletonClassName?: string
  fill?: boolean
  priority?: boolean
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

export function EnhancedImage({
  src,
  alt,
  width,
  height,
  className = '',
  skeletonClassName = '',
  fill = false,
  priority = false,
  sizes,
  onLoad,
  onError
}: EnhancedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-400 p-4">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-sm">Imagem não encontrada</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 z-10">
          <ImageSkeleton 
            className={skeletonClassName}
            width="100%"
            height="100%"
          />
        </div>
      )}
      
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        sizes={sizes}
        className={`transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}