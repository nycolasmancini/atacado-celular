'use client'

import { memo, useEffect, useState } from 'react'
import { ProductCardSkeleton } from './ProductCardSkeleton'
import { InitialPageSkeleton } from './InitialPageSkeleton'

interface SmartSkeletonProps {
  type: 'initial' | 'infinite-scroll' | 'search' | 'category'
  count?: number
  isLoading?: boolean
  delay?: number
}

// Smart skeleton that adapts based on context and shows realistic loading times
const SmartSkeletonComponent = ({ 
  type, 
  count = 12, 
  isLoading = true, 
  delay = 0 
}: SmartSkeletonProps) => {
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState<'initial' | 'content' | 'final'>('initial')

  useEffect(() => {
    if (!isLoading) {
      setShowSkeleton(false)
      return
    }

    // Show skeleton after delay (prevents flash for very fast loads)
    const showTimer = setTimeout(() => {
      setShowSkeleton(true)
    }, delay)

    // Loading phases for better UX
    const phaseTimer = setTimeout(() => {
      setLoadingPhase('content')
    }, 500)

    const finalTimer = setTimeout(() => {
      setLoadingPhase('final')
    }, 1000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(phaseTimer)
      clearTimeout(finalTimer)
    }
  }, [isLoading, delay])

  if (!isLoading || !showSkeleton) {
    return null
  }

  const getSkeletonVariant = () => {
    switch (loadingPhase) {
      case 'initial':
        return 'pulse'
      case 'content':
        return 'shimmer'
      case 'final':
        return 'shimmer'
      default:
        return 'shimmer'
    }
  }

  const getSkeletonCount = () => {
    switch (loadingPhase) {
      case 'initial':
        return Math.min(count, 4) // Show fewer initially
      case 'content':
        return Math.min(count, 8) // Gradually show more
      case 'final':
        return count // Full count
      default:
        return count
    }
  }

  switch (type) {
    case 'initial':
      return <InitialPageSkeleton count={getSkeletonCount()} />
    
    case 'infinite-scroll':
      return (
        <div className="contents loading-stagger">
          <ProductCardSkeleton 
            count={getSkeletonCount()} 
            variant={getSkeletonVariant()}
          />
        </div>
      )
    
    case 'search':
      return (
        <div className="space-y-6">
          {/* Search header skeleton */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="w-48 h-6 bg-gray-200 rounded animate-pulse"></div>
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          
          <div className="loading-stagger">
            <ProductCardSkeleton 
              count={getSkeletonCount()} 
              variant={getSkeletonVariant()}
            />
          </div>
        </div>
      )
    
    case 'category':
      return (
        <div className="space-y-8">
          {/* Category header skeleton */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8 text-center space-y-4">
            <div className="w-64 h-8 bg-gray-200 rounded mx-auto animate-pulse"></div>
            <div className="w-96 h-4 bg-gray-200 rounded mx-auto animate-pulse"></div>
          </div>
          
          <div className="loading-stagger">
            <ProductCardSkeleton 
              count={getSkeletonCount()} 
              variant={getSkeletonVariant()}
            />
          </div>
        </div>
      )
    
    default:
      return (
        <ProductCardSkeleton 
          count={getSkeletonCount()} 
          variant={getSkeletonVariant()}
        />
      )
  }
}

export const SmartSkeleton = memo(SmartSkeletonComponent)

// Hook for managing skeleton states
export function useSkeletonState(isLoading: boolean, minLoadingTime = 300) {
  const [showSkeleton, setShowSkeleton] = useState(isLoading)
  const [loadingStartTime] = useState(Date.now())

  useEffect(() => {
    if (!isLoading) {
      const elapsedTime = Date.now() - loadingStartTime
      const remainingTime = Math.max(0, minLoadingTime - elapsedTime)
      
      setTimeout(() => {
        setShowSkeleton(false)
      }, remainingTime)
    } else {
      setShowSkeleton(true)
    }
  }, [isLoading, loadingStartTime, minLoadingTime])

  return showSkeleton
}