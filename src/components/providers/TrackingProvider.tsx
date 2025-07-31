'use client'

import { useEffect, createContext, useContext, ReactNode } from 'react'
import { initGTM, pushToDataLayer } from '@/lib/gtm'
import { initHeatmaps, identifyHeatmapUser } from '@/lib/heatmaps'
import { initUTMTracking, getCurrentUTMParameters } from '@/lib/utm'
import { useScrollDepthTracking } from '@/hooks/useScrollDepthTracking'

interface TrackingContextType {
  trackEvent: (event: string, properties?: Record<string, any>) => void
  identifyUser: (whatsapp: string, additionalData?: Record<string, any>) => void
  getCurrentUTM: () => Record<string, any>
  isInitialized: boolean
}

const TrackingContext = createContext<TrackingContextType | null>(null)

interface TrackingProviderProps {
  children: ReactNode
  enableGTM?: boolean
  enableHeatmaps?: boolean
  enableUTM?: boolean
  enableScrollTracking?: boolean
}

export const TrackingProvider = ({
  children,
  enableGTM = true,
  enableHeatmaps = true,
  enableUTM = true,
  enableScrollTracking = true
}: TrackingProviderProps) => {
  // Initialize scroll depth tracking
  useScrollDepthTracking({ enabled: enableScrollTracking })

  useEffect(() => {
    if (typeof window === 'undefined') return

    const initializeTracking = async () => {
      try {
        // Initialize UTM tracking first (needed for other services)
        if (enableUTM) {
          initUTMTracking()
        }

        // Initialize GTM
        if (enableGTM) {
          initGTM()
        }

        // Initialize heatmap services
        if (enableHeatmaps) {
          initHeatmaps()
        }

        // Send initial page data
        const utm = getCurrentUTMParameters()
        pushToDataLayer({
          event: 'tracking_initialized',
          page_load_time: Date.now(),
          utm_parameters: utm,
          user_agent: navigator.userAgent,
          screen_resolution: `${screen.width}x${screen.height}`,
          viewport_size: `${window.innerWidth}x${window.innerHeight}`,
          referrer: document.referrer || 'direct',
          language: navigator.language
        })

        console.log('Tracking services initialized successfully')
      } catch (error) {
        console.error('Error initializing tracking:', error)
      }
    }

    // Initialize after a brief delay to ensure DOM is ready
    const timer = setTimeout(initializeTracking, 100)
    return () => clearTimeout(timer)
  }, [enableGTM, enableHeatmaps, enableUTM])

  const trackEvent = (event: string, properties: Record<string, any> = {}) => {
    try {
      // Send to GTM
      pushToDataLayer({
        event,
        timestamp: new Date().toISOString(),
        ...properties
      })

      // Send to heatmaps if available
      if (enableHeatmaps && typeof window !== 'undefined') {
        if (window.hj) {
          window.hj('event', event)
        }
        if (window.clarity) {
          window.clarity('set', event, JSON.stringify(properties))
        }
      }
    } catch (error) {
      console.error('Error tracking event:', error)
    }
  }

  const identifyUser = (whatsapp: string, additionalData: Record<string, any> = {}) => {
    try {
      const userData = {
        whatsapp_provided: true,
        timestamp: new Date().toISOString(),
        utm_parameters: getCurrentUTMParameters(),
        ...additionalData
      }

      // Send to GTM
      pushToDataLayer({
        event: 'user_identified',
        user_data: userData
      })

      // Send to heatmaps
      if (enableHeatmaps) {
        identifyHeatmapUser(whatsapp, userData)
      }
    } catch (error) {
      console.error('Error identifying user:', error)
    }
  }

  const contextValue: TrackingContextType = {
    trackEvent,
    identifyUser,
    getCurrentUTM: getCurrentUTMParameters,
    isInitialized: true
  }

  return (
    <TrackingContext.Provider value={contextValue}>
      {children}
      {/* GTM noscript fallback */}
      {enableGTM && (
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID || 'GTM-XXXXXXX'}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
      )}
    </TrackingContext.Provider>
  )
}

// Hook to use tracking context
export const useTracking = () => {
  const context = useContext(TrackingContext)
  if (!context) {
    // Instead of throwing error immediately, provide no-op functions for graceful degradation
    if (typeof window !== 'undefined') {
      console.warn('useTracking called outside TrackingProvider - tracking will be disabled')
    }
    return {
      trackEvent: () => {},
      identifyUser: () => {},
      getCurrentUTM: () => ({}),
      isInitialized: false
    }
  }
  return context
}

// HOC for tracking page views
export const withPageTracking = <P extends object>(
  Component: React.ComponentType<P>,
  pageName: string
) => {
  const TrackedComponent = (props: P) => {
    const { trackEvent } = useTracking()

    useEffect(() => {
      trackEvent('page_view', {
        page_name: pageName,
        page_path: window.location.pathname,
        page_url: window.location.href
      })
    }, [trackEvent])

    return <Component {...props} />
  }

  TrackedComponent.displayName = `withPageTracking(${Component.displayName || Component.name})`
  return TrackedComponent
}