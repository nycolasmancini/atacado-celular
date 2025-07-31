// Temporary disabled tracking to prevent infinite loops
// This is a mock implementation that just logs to console

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

class DisabledTrackingService {
  private sessionId: string = 'disabled-session'

  async trackEvent(eventType: string, eventData?: any, whatsapp?: string): Promise<void> {
    // Just log to console instead of making API calls
    console.log('[TRACKING DISABLED]', {
      eventType,
      eventData,
      whatsapp,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    })
  }

  trackPageView(path?: string): void {
    console.log('[TRACKING DISABLED] Page view:', path || window?.location?.pathname)
  }

  trackSearch(query: string): void {
    console.log('[TRACKING DISABLED] Search:', query)
  }

  trackProductView(productId: number): void {
    console.log('[TRACKING DISABLED] Product view:', productId)
  }

  trackKitInterest(kitSlug: string): void {
    console.log('[TRACKING DISABLED] Kit interest:', kitSlug)
  }

  getTrackingData(): TrackingData {
    return {
      sessionId: this.sessionId,
      timeOnSite: 0,
      pagesVisited: [],
      productsViewed: [],
      searches: [],
    }
  }
}

// Export disabled instance
export const trackingService = new DisabledTrackingService()
export const trackEvent = trackingService.trackEvent.bind(trackingService)

export default trackingService