import { unstable_cache } from 'next/cache'

// Cache configuration
export const CACHE_TAGS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  KITS: 'kits',
  ORDERS: 'orders',
  ADMIN: 'admin',
} as const

export const CACHE_TIMES = {
  PRODUCTS: 300, // 5 minutes
  CATEGORIES: 3600, // 1 hour
  KITS: 1800, // 30 minutes
  ORDERS: 60, // 1 minute
  ADMIN: 0, // No cache for admin
} as const

// Generic cache wrapper
export function createCachedFunction<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyParts: (string | ((...args: T) => string))[],
  options: {
    revalidate?: number
    tags?: string[]
  } = {}
) {
  return unstable_cache(
    fn,
    keyParts,
    {
      revalidate: options.revalidate || 300,
      tags: options.tags || [],
    }
  )
}

// Specific cache functions for common operations

// Cache products with 5-minute revalidation
export const cacheProducts = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyParts: (string | ((...args: T) => string))[]
) => createCachedFunction(fn, keyParts, {
  revalidate: CACHE_TIMES.PRODUCTS,
  tags: [CACHE_TAGS.PRODUCTS]
})

// Cache categories with 1-hour revalidation
export const cacheCategories = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyParts: (string | ((...args: T) => string))[]
) => createCachedFunction(fn, keyParts, {
  revalidate: CACHE_TIMES.CATEGORIES,
  tags: [CACHE_TAGS.CATEGORIES]
})

// Cache kits with 30-minute revalidation
export const cacheKits = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  keyParts: (string | ((...args: T) => string))[]
) => createCachedFunction(fn, keyParts, {
  revalidate: CACHE_TIMES.KITS,
  tags: [CACHE_TAGS.KITS]
})

// Manual cache invalidation functions
export async function invalidateCache(tags: string[]) {
  if (typeof window !== 'undefined') {
    // Client-side: trigger revalidation via API
    try {
      await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tags }),
      })
    } catch (error) {
      console.error('Failed to invalidate cache:', error)
    }
  } else {
    // Server-side: use revalidateTag
    const { revalidateTag } = await import('next/cache')
    tags.forEach(tag => revalidateTag(tag))
  }
}

// Convenience functions for specific invalidations
export const invalidateProducts = () => invalidateCache([CACHE_TAGS.PRODUCTS])
export const invalidateCategories = () => invalidateCache([CACHE_TAGS.CATEGORIES])
export const invalidateKits = () => invalidateCache([CACHE_TAGS.KITS])
export const invalidateAll = () => invalidateCache(Object.values(CACHE_TAGS))

// React hook for cache invalidation
export function useCacheInvalidation() {
  return {
    invalidateProducts,
    invalidateCategories,
    invalidateKits,
    invalidateAll,
    invalidate: invalidateCache,
  }
}

// Cache key generators
export const generateCacheKey = {
  products: (filters?: { category?: string; search?: string; page?: number }) => [
    'products',
    filters?.category || 'all',
    filters?.search || '',
    String(filters?.page || 1)
  ],
  
  categories: () => ['categories'],
  
  kits: (filters?: { active?: boolean }) => [
    'kits',
    String(filters?.active ?? true)
  ],
  
  product: (id: string | number) => ['product', String(id)],
  
  category: (id: string | number) => ['category', String(id)],
  
  kit: (id: string | number) => ['kit', String(id)],
}

// Pre-configured cached functions for common API calls
export const getCachedProducts = cacheProducts(
  async (filters?: { category?: string; search?: string; page?: number }) => {
    const response = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters || {}),
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }
    
    return response.json()
  },
  generateCacheKey.products
)

export const getCachedCategories = cacheCategories(
  async () => {
    const response = await fetch('/api/categories')
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories')
    }
    
    return response.json()
  },
  generateCacheKey.categories
)

export const getCachedKits = cacheKits(
  async (filters?: { active?: boolean }) => {
    const response = await fetch('/api/kits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters || {}),
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch kits')
    }
    
    return response.json()
  },
  generateCacheKey.kits
)

// Memory cache for client-side caching (optional)
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>()
  
  set(key: string, data: any, ttl: number = 300000) { // default 5 minutes
    const expires = Date.now() + ttl
    this.cache.set(key, { data, expires })
  }
  
  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }
  
  delete(key: string) {
    this.cache.delete(key)
  }
  
  clear() {
    this.cache.clear()
  }
  
  // Clean expired entries
  cleanup() {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key)
      }
    }
  }
}

export const memoryCache = new MemoryCache()

// Cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    memoryCache.cleanup()
  }, 5 * 60 * 1000)
}