'use client'

import { memo } from 'react'

interface ProductCardSkeletonProps {
  count?: number
  variant?: 'default' | 'pulse' | 'shimmer'
}

// Shimmer animation component
const ShimmerEffect = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
  </div>
)

const ProductCardSkeletonComponent = ({ count = 1, variant = 'shimmer' }: ProductCardSkeletonProps) => {
  
  const getSkeletonClass = (baseClass: string) => {
    switch (variant) {
      case 'pulse':
        return `${baseClass} animate-pulse bg-gray-200`
      case 'shimmer':
        return `${baseClass} bg-gray-200 relative overflow-hidden`
      default:
        return `${baseClass} animate-pulse bg-gray-200`
    }
  }
  
  const SkeletonBox = ({ className, children }: { className: string, children?: React.ReactNode }) => (
    <div className={getSkeletonClass(className)}>
      {variant === 'shimmer' && <ShimmerEffect className="absolute inset-0" />}
      {children}
    </div>
  )
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-col h-full overflow-hidden"
          style={{ 
            animationDelay: `${index * 100}ms`,
            animationDuration: '1.5s'
          }}
        >
          {/* Mobile Layout Skeleton */}
          <div className="flex md:hidden flex-col">
            <div className="flex">
              {/* Image skeleton - Left side on mobile */}
              <SkeletonBox className="flex-shrink-0 w-36 h-36 rounded-l-lg">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-8 h-8 rounded bg-gray-300/50" />
                </div>
              </SkeletonBox>
              
              {/* Product Name skeleton - Right side */}  
              <div className="flex-1 p-3 flex items-center">
                <div className="w-full space-y-2">
                  <SkeletonBox className="h-4 rounded w-3/4 mx-auto" />
                  <SkeletonBox className="h-3 rounded w-1/2 mx-auto" />
                </div>
              </div>
            </div>

            {/* Content below image skeleton */}
            <div className="p-3 pt-0 space-y-3">
              {/* Prices skeleton - horizontal */}
              <div className="flex justify-center items-center space-x-6">
                <div className="flex flex-col text-center space-y-1">
                  <SkeletonBox className="h-3 rounded w-12" />
                  <SkeletonBox className="h-5 rounded w-16" />
                </div>
                <div className="flex flex-col text-center space-y-1">
                  <SkeletonBox className="h-3 rounded w-16" />
                  <SkeletonBox className="h-5 rounded w-16" />
                </div>
              </div>

              {/* Quantity selector skeleton */}
              <div className="flex justify-center">
                <SkeletonBox className="h-10 rounded-lg w-24" />
              </div>

              {/* Button skeleton */}
              <SkeletonBox className="h-10 rounded-lg w-full" />
            </div>
          </div>

          {/* Desktop Layout Skeleton */}
          <div className="hidden md:flex flex-col h-full">
            {/* Image skeleton - Top on desktop */}
            <SkeletonBox className="aspect-square rounded-t-lg">
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-12 h-12 rounded bg-gray-300/50" />
              </div>
            </SkeletonBox>

            {/* Content skeleton */}
            <div className="p-4 flex flex-col flex-1 space-y-3">
              {/* Product name skeleton */}
              <div className="space-y-2">
                <SkeletonBox className="h-4 rounded w-3/4 mx-auto" />
                <SkeletonBox className="h-3 rounded w-1/2 mx-auto" />
              </div>

              {/* Prices skeleton */}
              <div className="flex justify-center items-center space-x-6">
                <div className="flex flex-col text-center space-y-1">
                  <SkeletonBox className="h-3 rounded w-12" />
                  <SkeletonBox className="h-5 rounded w-16" />
                </div>
                <div className="flex flex-col text-center space-y-1">
                  <SkeletonBox className="h-3 rounded w-16" />
                  <SkeletonBox className="h-5 rounded w-16" />
                </div>
              </div>

              {/* Quantity selector skeleton */}
              <div className="flex justify-center">
                <SkeletonBox className="h-10 rounded-lg w-24" />
              </div>

              {/* Button skeleton */}
              <div className="mt-auto">
                <SkeletonBox className="h-10 rounded-lg w-full" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
};

// Memoized skeleton component
export const ProductCardSkeleton = memo(ProductCardSkeletonComponent);

// Enhanced loading indicator for infinite scroll - memoized
const InfiniteScrollLoaderComponent = () => {
  return (
    <div className="col-span-full flex flex-col justify-center items-center py-12">
      {/* Primary Loading Animation */}
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 border-2 border-gray-200 rounded-full"></div>
        {/* Inner spinning ring */}
        <div className="absolute inset-0 border-2 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
        {/* Inner pulsing dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Loading Text with Typewriter Effect */}
      <div className="mt-4 flex items-center space-x-1 text-gray-600">
        <span className="text-sm font-medium">Carregando mais produtos</span>
        <div className="flex space-x-1">
          <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
          <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
        </div>
      </div>
      
      {/* Progress-like bar */}
      <div className="mt-3 w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 rounded-full animate-[loading-bar_2s_ease-in-out_infinite]"></div>
      </div>
    </div>
  )
};

export const InfiniteScrollLoader = memo(InfiniteScrollLoaderComponent);

// Enhanced end of list indicator - memoized
const EndOfListIndicatorComponent = ({ totalProducts }: { totalProducts: number }) => {
  return (
    <div className="col-span-full text-center py-12">
      <div className="inline-flex flex-col items-center space-y-3 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-gray-100">
        {/* Success Animation */}
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <svg 
              className="w-8 h-8 text-white animate-[scale-up_0.6s_ease-out]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          </div>
          
          {/* Sparkle Effects */}
          <div className="absolute -top-2 -right-2 w-4 h-4 text-yellow-400 animate-ping">✨</div>
          <div className="absolute -bottom-1 -left-2 w-3 h-3 text-blue-400 animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
        </div>
        
        {/* Main Message */}
        <div className="text-lg font-semibold text-gray-800">
          🎉 Parabéns! Você explorou todo o catálogo
        </div>
        
        {/* Subtitle */}
        <div className="text-sm text-gray-600 max-w-md">
          Encontrou algo interessante? Entre em contato pelo WhatsApp para fazer seu pedido!
        </div>
        
      </div>
    </div>
  )
};

export const EndOfListIndicator = memo(EndOfListIndicatorComponent);