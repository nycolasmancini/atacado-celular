'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'

interface UseInfiniteScrollProps<T> {
  items: T[]
  initialItemsPerPage?: number
  itemsPerLoad?: number
  threshold?: number
}

interface UseInfiniteScrollReturn<T> {
  visibleItems: T[]
  hasMore: boolean
  isLoading: boolean
  loadMore: () => void
  reset: () => void
  totalVisible: number
  totalItems: number
}

export function useInfiniteScroll<T>({
  items,
  initialItemsPerPage = 20,
  itemsPerLoad = 20,
  threshold = 1000
}: UseInfiniteScrollProps<T>): UseInfiniteScrollReturn<T> {
  const [visibleCount, setVisibleCount] = useState(initialItemsPerPage)
  const [isLoading, setIsLoading] = useState(false)

  // Memoize visible items to prevent unnecessary re-renders
  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount)
  }, [items, visibleCount])

  const hasMore = visibleCount < items.length

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    
    // Simulate loading delay (remove in production if not needed)
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + itemsPerLoad, items.length))
      setIsLoading(false)
    }, 100)
  }, [isLoading, hasMore, itemsPerLoad, items.length])

  // Reset to initial state when items change
  const reset = useCallback(() => {
    setVisibleCount(initialItemsPerPage)
    setIsLoading(false)
  }, [initialItemsPerPage])

  // Auto-reset when items array changes (e.g., search/filter)
  useEffect(() => {
    reset()
  }, [items, reset])

  // Scroll listener for automatic loading
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight

      // Check if user is near bottom of page
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMore()
      }
    }

    // Throttle scroll events
    let ticking = false
    const throttledHandleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
    }
  }, [isLoading, hasMore, threshold, loadMore])

  return {
    visibleItems,
    hasMore,
    isLoading,
    loadMore,
    reset,
    totalVisible: visibleCount,
    totalItems: items.length
  }
}

// Hook for intersection observer based infinite scroll (alternative approach)
export function useIntersectionInfiniteScroll<T>({
  items,
  initialItemsPerPage = 20,
  itemsPerLoad = 20,
}: Omit<UseInfiniteScrollProps<T>, 'threshold'>): UseInfiniteScrollReturn<T> & {
  sentinelRef: React.RefObject<HTMLDivElement>
} {
  const [visibleCount, setVisibleCount] = useState(initialItemsPerPage)
  const [isLoading, setIsLoading] = useState(false)
  const sentinelRef = React.useRef<HTMLDivElement>(null)

  const visibleItems = useMemo(() => {
    return items.slice(0, visibleCount)
  }, [items, visibleCount])

  const hasMore = visibleCount < items.length

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + itemsPerLoad, items.length))
      setIsLoading(false)
    }, 100)
  }, [isLoading, hasMore, itemsPerLoad, items.length])

  const reset = useCallback(() => {
    setVisibleCount(initialItemsPerPage)
    setIsLoading(false)
  }, [initialItemsPerPage])

  useEffect(() => {
    reset()
  }, [items, reset])

  // Intersection Observer
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel || !hasMore) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoading) {
          loadMore()
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [hasMore, isLoading, loadMore])

  return {
    visibleItems,
    hasMore,
    isLoading,
    loadMore,
    reset,
    totalVisible: visibleCount,
    totalItems: items.length,
    sentinelRef
  }
}