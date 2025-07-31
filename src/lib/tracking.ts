import { v4 as uuidv4 } from 'uuid'

export interface TrackingEventData {
  sessionId: string
  eventType: string
  eventData?: any
  whatsapp?: string
}

export interface TrackingData {
  sessionId: string
  whatsapp?: string
  timeOnSite: number
  pagesVisited: string[]
  productsViewed: number[]
  searches: string[]
  kitInterest?: string
}

class TrackingService {
  private sessionId: string
  private startTime: number
  private pagesVisited: Set<string> = new Set()
  private productsViewed: Set<number> = new Set()
  private searches: string[] = []

  constructor() {
    // Get or create session ID
    this.sessionId = this.getSessionId()
    this.startTime = Date.now()
    
    // Track initial page view
    if (typeof window !== 'undefined') {
      this.trackPageView()
    }
  }

  private getSessionId(): string {
    if (typeof window === 'undefined') return 'server'
    
    let sessionId = localStorage.getItem('tracking_session_id')
    if (!sessionId) {
      sessionId = uuidv4()
      localStorage.setItem('tracking_session_id', sessionId)
    }
    return sessionId
  }

  async trackEvent(eventType: string, eventData?: any, whatsapp?: string): Promise<void> {
    try {
      const payload: TrackingEventData = {
        sessionId: this.sessionId,
        eventType,
        eventData,
        whatsapp
      }

      // Use timeout and don't wait for response to avoid blocking UI
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

      fetch('/api/tracking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-session-id': this.sessionId
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      }).then(() => {
        clearTimeout(timeoutId)
      }).catch(error => {
        clearTimeout(timeoutId)
        console.warn('Tracking request failed (non-blocking):', error.name)
      })

      // Update local tracking data immediately (don't wait for API)
      this.updateLocalTracking(eventType, eventData)
    } catch (error) {
      console.warn('Failed to prepare tracking event:', error)
      // Still update local tracking even if API fails
      this.updateLocalTracking(eventType, eventData)
    }
  }

  private updateLocalTracking(eventType: string, eventData?: any): void {
    if (typeof window === 'undefined') return

    switch (eventType) {
      case 'page_view':
        if (eventData?.path) {
          this.pagesVisited.add(eventData.path)
        }
        break
      case 'product_viewed':
        if (eventData?.productId) {
          this.productsViewed.add(eventData.productId)
        }
        break
      case 'search':
        if (eventData?.query) {
          this.searches.push(eventData.query)
        }
        break
    }
  }

  trackPageView(path?: string): void {
    if (typeof window === 'undefined') return
    
    const currentPath = path || window.location.pathname
    this.trackEvent('page_view', { 
      path: currentPath,
      referrer: document.referrer,
      timestamp: new Date().toISOString()
    })
  }

  trackProductView(productId: number, productName: string): void {
    this.trackEvent('product_viewed', {
      productId,
      productName,
      timestamp: new Date().toISOString()
    })
  }

  trackWhatsAppSubmission(whatsapp: string): void {
    this.trackEvent('whatsapp_submitted', {
      source: 'modal',
      timestamp: new Date().toISOString()
    }, whatsapp)
  }

  trackOrderCompleted(orderData: any, whatsapp: string): void {
    this.trackEvent('order_completed', {
      ...orderData,
      timestamp: new Date().toISOString()
    }, whatsapp)
  }

  trackSearch(query: string): void {
    this.trackEvent('search', {
      query,
      timestamp: new Date().toISOString()
    })
  }

  trackKitViewed(kitName: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('kit_interest', kitName)
    }
    
    this.trackEvent('kit_viewed', {
      kitName,
      timestamp: new Date().toISOString()
    })
  }

  getTrackingData(): TrackingData {
    if (typeof window === 'undefined') {
      return {
        sessionId: this.sessionId,
        timeOnSite: 0,
        pagesVisited: [],
        productsViewed: [],
        searches: []
      }
    }

    const whatsapp = localStorage.getItem('whatsapp_number') || undefined
    const kitInterest = localStorage.getItem('kit_interest') || undefined

    return {
      sessionId: this.sessionId,
      whatsapp,
      timeOnSite: Date.now() - this.startTime,
      pagesVisited: Array.from(this.pagesVisited),
      productsViewed: Array.from(this.productsViewed),
      searches: [...this.searches],
      kitInterest
    }
  }
}

// Singleton instance
export const trackingService = new TrackingService()

// Convenience functions
export const trackEvent = (eventType: string, eventData?: any, whatsapp?: string) => {
  return trackingService.trackEvent(eventType, eventData, whatsapp)
}

export const trackPageView = (path?: string) => {
  trackingService.trackPageView(path)
}

export const trackProductView = (productId: number, productName: string) => {
  trackingService.trackProductView(productId, productName)
}

export const trackWhatsAppSubmission = (whatsapp: string) => {
  trackingService.trackWhatsAppSubmission(whatsapp)
}

export const trackOrderCompleted = (orderData: any, whatsapp: string) => {
  trackingService.trackOrderCompleted(orderData, whatsapp)
}

export const trackSearch = (query: string) => {
  trackingService.trackSearch(query)
}

export const trackKitViewed = (kitName: string) => {
  trackingService.trackKitViewed(kitName)
}

export const getTrackingData = () => {
  return trackingService.getTrackingData()
}

// Middleware for automatic page view tracking
export const trackingMiddleware = () => {
  if (typeof window !== 'undefined') {
    // Track page changes in SPA
    const originalPushState = window.history.pushState
    const originalReplaceState = window.history.replaceState

    window.history.pushState = function(...args) {
      originalPushState.apply(window.history, args)
      setTimeout(() => trackPageView(), 0)
    }

    window.history.replaceState = function(...args) {
      originalReplaceState.apply(window.history, args)
      setTimeout(() => trackPageView(), 0)
    }

    // Track back/forward navigation
    window.addEventListener('popstate', () => {
      setTimeout(() => trackPageView(), 0)
    })
  }
}