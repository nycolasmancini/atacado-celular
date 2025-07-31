'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { trackEvent } from '@/lib/tracking'

// Interface para milestones de tempo
interface TimeMilestone {
  seconds: number
  label: string
  tracked: boolean
}

// Interface para scroll depth
interface ScrollDepth {
  percentage: number
  label: string
  tracked: boolean
}

// Hook principal de tracking avançado
export function useAdvancedTracking() {
  const [isActive, setIsActive] = useState(false)
  const startTimeRef = useRef<number>(0)
  const visibilityStartRef = useRef<number>(0)
  const totalTimeRef = useRef<number>(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Estados para milestones
  const [timeMilestones, setTimeMilestones] = useState<TimeMilestone[]>([
    { seconds: 30, label: '30_seconds', tracked: false },
    { seconds: 60, label: '1_minute', tracked: false },
    { seconds: 120, label: '2_minutes', tracked: false },
    { seconds: 300, label: '5_minutes', tracked: false },
    { seconds: 600, label: '10_minutes', tracked: false }
  ])

  const [scrollDepths, setScrollDepths] = useState<ScrollDepth[]>([
    { percentage: 25, label: '25_percent', tracked: false },
    { percentage: 50, label: '50_percent', tracked: false },
    { percentage: 75, label: '75_percent', tracked: false },
    { percentage: 100, label: '100_percent', tracked: false }
  ])

  // Inicializar tracking
  const startTracking = useCallback(() => {
    if (isActive) return

    startTimeRef.current = Date.now()
    visibilityStartRef.current = Date.now()
    setIsActive(true)

    // Track session start
    trackEvent('session_started', {
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      screen_resolution: `${screen.width}x${screen.height}`,
      viewport_size: `${window.innerWidth}x${window.innerHeight}`
    })

    // Interval para verificar milestones de tempo
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now()
      const elapsedSeconds = Math.floor((currentTime - visibilityStartRef.current) / 1000)

      // Verificar milestones de tempo
      setTimeMilestones(prev => 
        prev.map(milestone => {
          if (!milestone.tracked && elapsedSeconds >= milestone.seconds) {
            trackEvent('time_milestone', {
              milestone: milestone.label,
              elapsed_seconds: elapsedSeconds,
              total_time_on_site: Math.floor((currentTime - startTimeRef.current) / 1000),
              timestamp: new Date().toISOString()
            })
            return { ...milestone, tracked: true }
          }
          return milestone
        })
      )
    }, 1000)
  }, [isActive])

  // Parar tracking
  const stopTracking = useCallback(() => {
    if (!isActive) return

    const endTime = Date.now()
    const sessionDuration = endTime - visibilityStartRef.current
    totalTimeRef.current += sessionDuration

    // Track session pause/end
    trackEvent('session_paused', {
      session_duration: sessionDuration,
      total_time_on_site: Math.floor((endTime - startTimeRef.current) / 1000),
      timestamp: new Date().toISOString()
    })

    setIsActive(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [isActive])

  // Retomar tracking
  const resumeTracking = useCallback(() => {
    if (isActive) return
    
    visibilityStartRef.current = Date.now()
    setIsActive(true)

    trackEvent('session_resumed', {
      timestamp: new Date().toISOString()
    })

    // Reiniciar interval
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now()
      const elapsedSeconds = Math.floor((currentTime - visibilityStartRef.current) / 1000)

      setTimeMilestones(prev => 
        prev.map(milestone => {
          if (!milestone.tracked && elapsedSeconds >= milestone.seconds) {
            trackEvent('time_milestone', {
              milestone: milestone.label,
              elapsed_seconds: elapsedSeconds,
              total_time_on_site: Math.floor((currentTime - startTimeRef.current) / 1000),
              timestamp: new Date().toISOString()
            })
            return { ...milestone, tracked: true }
          }
          return milestone
        })
      )
    }, 1000)
  }, [isActive])

  // Setup dos event listeners
  useEffect(() => {
    startTracking()

    // Visibility API para pausar/retomar quando usuário sai/volta da aba
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopTracking()
      } else {
        resumeTracking()
      }
    }

    // Eventos de focus/blur para tracking mais preciso
    const handleFocus = () => resumeTracking()
    const handleBlur = () => stopTracking()

    // Evento antes de sair da página
    const handleBeforeUnload = () => {
      const endTime = Date.now()
      const totalSessionTime = Math.floor((endTime - startTimeRef.current) / 1000)
      
      // Usar sendBeacon para garantir que o evento seja enviado
      if (navigator.sendBeacon) {
        const data = JSON.stringify({
          eventType: 'session_ended',
          eventData: {
            total_session_time: totalSessionTime,
            final_scroll_position: window.scrollY,
            timestamp: new Date().toISOString()
          },
          sessionId: localStorage.getItem('tracking_session_id')
        })

        navigator.sendBeacon('/api/tracking', data)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [startTracking, stopTracking, resumeTracking])

  // Scroll depth tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100)

      // Verificar milestones de scroll
      setScrollDepths(prev => 
        prev.map(depth => {
          if (!depth.tracked && scrollPercentage >= depth.percentage) {
            trackEvent('scroll_depth', {
              depth_percentage: depth.percentage,
              actual_percentage: scrollPercentage,
              scroll_position: scrollTop,
              timestamp: new Date().toISOString()
            })
            return { ...depth, tracked: true }
          }
          return depth
        })
      )
    }

    // Throttle scroll events
    let throttleTimeout: NodeJS.Timeout | null = null
    const throttledScroll = () => {
      if (throttleTimeout) return
      
      throttleTimeout = setTimeout(() => {
        handleScroll()
        throttleTimeout = null
      }, 100)
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', throttledScroll)
      if (throttleTimeout) {
        clearTimeout(throttleTimeout)
      }
    }
  }, [])

  // Retornar dados úteis
  const getTrackingStats = useCallback(() => {
    const currentTime = Date.now()
    const currentSessionTime = isActive ? currentTime - visibilityStartRef.current : 0
    const totalTime = totalTimeRef.current + currentSessionTime

    return {
      isActive,
      totalTimeOnSite: Math.floor(totalTime / 1000),
      currentSessionTime: Math.floor(currentSessionTime / 1000),
      completedTimeMilestones: timeMilestones.filter(m => m.tracked).length,
      completedScrollDepths: scrollDepths.filter(d => d.tracked).length,
      deepestScroll: Math.max(...scrollDepths.filter(d => d.tracked).map(d => d.percentage), 0)
    }
  }, [isActive, timeMilestones, scrollDepths])

  return {
    isActive,
    getTrackingStats,
    timeMilestones,
    scrollDepths
  }
}

// Hook específico para tracking de interações
export function useInteractionTracking() {
  const trackClick = useCallback((element: string, data?: Record<string, any>) => {
    trackEvent('element_clicked', {
      element,
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      ...data
    })
  }, [])

  const trackHover = useCallback((element: string, duration: number) => {
    trackEvent('element_hovered', {
      element,
      hover_duration: duration,
      timestamp: new Date().toISOString(),
      page: window.location.pathname
    })
  }, [])

  const trackFormInteraction = useCallback((formId: string, fieldName: string, action: 'focus' | 'blur' | 'change') => {
    trackEvent('form_interaction', {
      form_id: formId,
      field_name: fieldName,
      action,
      timestamp: new Date().toISOString()
    })
  }, [])

  const trackVideoInteraction = useCallback((videoId: string, action: 'play' | 'pause' | 'ended', currentTime: number) => {
    trackEvent('video_interaction', {
      video_id: videoId,
      action,
      current_time: currentTime,
      timestamp: new Date().toISOString()
    })
  }, [])

  return {
    trackClick,
    trackHover,
    trackFormInteraction,
    trackVideoInteraction
  }
}

// Hook para tracking de performance
export function usePerformanceTracking() {
  useEffect(() => {
    // Aguardar carregamento completo da página
    const handleLoad = () => {
      // Métricas de performance
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        trackEvent('page_performance', {
          page_load_time: navigation.loadEventEnd - navigation.navigationStart,
          dom_content_loaded: navigation.domContentLoadedEventEnd - navigation.navigationStart,
          first_paint: navigation.responseStart - navigation.navigationStart,
          dns_lookup_time: navigation.domainLookupEnd - navigation.domainLookupStart,
          tcp_connection_time: navigation.connectEnd - navigation.connectStart,
          server_response_time: navigation.responseEnd - navigation.requestStart,
          timestamp: new Date().toISOString()
        })
      }

      // Core Web Vitals (se disponível)
      if ('web-vital' in window) {
        // LCP (Largest Contentful Paint)
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          
          trackEvent('core_web_vital', {
            metric: 'LCP',
            value: lastEntry.startTime,
            timestamp: new Date().toISOString()
          })
        }).observe({ entryTypes: ['largest-contentful-paint'] })

        // FID (First Input Delay)
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            trackEvent('core_web_vital', {
              metric: 'FID',
              value: entry.processingStart - entry.startTime,
              timestamp: new Date().toISOString()
            })
          })
        }).observe({ entryTypes: ['first-input'] })

        // CLS (Cumulative Layout Shift)
        let clsValue = 0
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          entries.forEach((entry) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value
            }
          })
          
          trackEvent('core_web_vital', {
            metric: 'CLS',
            value: clsValue,
            timestamp: new Date().toISOString()
          })
        }).observe({ entryTypes: ['layout-shift'] })
      }
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [])
}