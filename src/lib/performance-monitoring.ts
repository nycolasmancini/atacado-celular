'use client'

import { trackEvent } from './tracking'

// Tipos para métricas de performance
interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number // Largest Contentful Paint
  fid?: number // First Input Delay
  cls?: number // Cumulative Layout Shift
  fcp?: number // First Contentful Paint
  ttfb?: number // Time to First Byte
  
  // Métricas de navegação
  domContentLoaded?: number
  loadComplete?: number
  
  // Métricas de recursos
  resourceLoadTime?: Record<string, number>
  
  // Métricas customizadas
  timeToInteractive?: number
  totalBlockingTime?: number
}

interface ErrorReport {
  message: string
  stack?: string
  filename?: string
  line?: number
  column?: number
  timestamp: number
  userAgent: string
  url: string
}

// Class para monitoramento de performance
class PerformanceMonitor {
  private metrics: PerformanceMetrics = {}
  private errors: ErrorReport[] = []
  private observers: PerformanceObserver[] = []

  constructor() {
    if (typeof window === 'undefined') return
    
    this.initializeMonitoring()
  }

  private initializeMonitoring() {
    // Monitor Core Web Vitals
    this.observeLCP()
    this.observeFID()
    this.observeCLS()
    this.observeFCP()
    
    // Monitor Navigation Timing
    this.observeNavigationTiming()
    
    // Monitor Resources
    this.observeResourceTiming()
    
    // Monitor Errors
    this.observeErrors()
    
    // Send metrics when page unloads
    this.setupUnloadHandler()
  }

  // Largest Contentful Paint
  private observeLCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        
        this.metrics.lcp = lastEntry.startTime
        
        trackEvent('performance_metric', {
          metric: 'LCP',
          value: lastEntry.startTime,
          rating: this.rateLCP(lastEntry.startTime),
          timestamp: new Date().toISOString()
        })
      })
      
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('LCP observation not supported')
    }
  }

  // First Input Delay
  private observeFID() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime
          this.metrics.fid = fid
          
          trackEvent('performance_metric', {
            metric: 'FID',
            value: fid,
            rating: this.rateFID(fid),
            timestamp: new Date().toISOString()
          })
        })
      })
      
      observer.observe({ entryTypes: ['first-input'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('FID observation not supported')
    }
  }

  // Cumulative Layout Shift
  private observeCLS() {
    try {
      let clsValue = 0
      let sessionValue = 0
      let sessionEntries: any[] = []
      
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            const firstSessionEntry = sessionEntries[0]
            const lastSessionEntry = sessionEntries[sessionEntries.length - 1]
            
            if (sessionValue && 
                entry.startTime - lastSessionEntry.startTime < 1000 &&
                entry.startTime - firstSessionEntry.startTime < 5000) {
              sessionValue += entry.value
              sessionEntries.push(entry)
            } else {
              sessionValue = entry.value
              sessionEntries = [entry]
            }
            
            if (sessionValue > clsValue) {
              clsValue = sessionValue
              this.metrics.cls = clsValue
            }
          }
        })
      })
      
      observer.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(observer)
      
      // Report CLS on page unload
      addEventListener('beforeunload', () => {
        trackEvent('performance_metric', {
          metric: 'CLS',
          value: clsValue,
          rating: this.rateCLS(clsValue),
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.warn('CLS observation not supported')
    }
  }

  // First Contentful Paint
  private observeFCP() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.fcp = entry.startTime
            
            trackEvent('performance_metric', {
              metric: 'FCP',
              value: entry.startTime,
              rating: this.rateFCP(entry.startTime),
              timestamp: new Date().toISOString()
            })
          }
        })
      })
      
      observer.observe({ entryTypes: ['paint'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('FCP observation not supported')
    }
  }

  // Navigation Timing
  private observeNavigationTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (entry.entryType === 'navigation') {
            this.metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.navigationStart
            this.metrics.loadComplete = entry.loadEventEnd - entry.navigationStart
            this.metrics.ttfb = entry.responseStart - entry.navigationStart
            
            trackEvent('performance_navigation', {
              dom_content_loaded: this.metrics.domContentLoaded,
              load_complete: this.metrics.loadComplete,
              ttfb: this.metrics.ttfb,
              timestamp: new Date().toISOString()
            })
          }
        })
      })
      
      observer.observe({ entryTypes: ['navigation'] })
      this.observers.push(observer)
    } catch (error) {
      // Fallback para browsers mais antigos
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0] as any
        if (navigation) {
          this.metrics.domContentLoaded = navigation.domContentLoadedEventEnd - navigation.navigationStart
          this.metrics.loadComplete = navigation.loadEventEnd - navigation.navigationStart
          this.metrics.ttfb = navigation.responseStart - navigation.navigationStart
        }
      })
    }
  }

  // Resource Timing
  private observeResourceTiming() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          const duration = entry.responseEnd - entry.startTime
          
          // Track apenas recursos críticos
          if (entry.name.includes('.js') || 
              entry.name.includes('.css') || 
              entry.name.includes('.woff') ||
              entry.name.includes('images/')) {
            
            if (!this.metrics.resourceLoadTime) {
              this.metrics.resourceLoadTime = {}
            }
            
            const resourceName = entry.name.split('/').pop() || entry.name
            this.metrics.resourceLoadTime[resourceName] = duration
            
            // Track recursos lentos
            if (duration > 1000) {
              trackEvent('slow_resource', {
                resource: resourceName,
                duration,
                type: entry.initiatorType,
                timestamp: new Date().toISOString()
              })
            }
          }
        })
      })
      
      observer.observe({ entryTypes: ['resource'] })
      this.observers.push(observer)
    } catch (error) {
      console.warn('Resource timing observation not supported')
    }
  }

  // Error Monitoring
  private observeErrors() {
    // JavaScript errors
    window.addEventListener('error', (event) => {
      const error: ErrorReport = {
        message: event.message,
        filename: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
      
      this.errors.push(error)
      
      trackEvent('javascript_error', {
        ...error,
        timestamp: new Date().toISOString()
      })
    })

    // Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error: ErrorReport = {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      }
      
      this.errors.push(error)
      
      trackEvent('promise_rejection', {
        ...error,
        timestamp: new Date().toISOString()
      })
    })
  }

  // Setup unload handler
  private setupUnloadHandler() {
    window.addEventListener('beforeunload', () => {
      this.sendMetrics()
    })

    // Também enviar métricas periodicamente
    setInterval(() => {
      this.sendMetrics()
    }, 30000) // A cada 30 segundos
  }

  // Rating functions
  private rateLCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good'
    if (value <= 4000) return 'needs-improvement'
    return 'poor'
  }

  private rateFID(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good'
    if (value <= 300) return 'needs-improvement'
    return 'poor'
  }

  private rateCLS(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 0.1) return 'good'
    if (value <= 0.25) return 'needs-improvement'
    return 'poor'
  }

  private rateFCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 1800) return 'good'
    if (value <= 3000) return 'needs-improvement'
    return 'poor'
  }

  // Public methods
  public getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  public getErrors(): ErrorReport[] {
    return [...this.errors]
  }

  public sendMetrics() {
    if (Object.keys(this.metrics).length === 0) return

    trackEvent('performance_summary', {
      metrics: this.metrics,
      errors_count: this.errors.length,
      timestamp: new Date().toISOString()
    })
  }

  public trackCustomMetric(name: string, value: number, unit?: string) {
    trackEvent('custom_performance_metric', {
      name,
      value,
      unit: unit || 'ms',
      timestamp: new Date().toISOString()
    })
  }

  public disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
  }
}

// Instance singleton
export const performanceMonitor = new PerformanceMonitor()

// Hook para usar performance monitoring
export function usePerformanceMonitoring() {
  const trackCustomMetric = (name: string, value: number, unit?: string) => {
    performanceMonitor.trackCustomMetric(name, value, unit)
  }

  const getMetrics = () => {
    return performanceMonitor.getMetrics()
  }

  const getErrors = () => {
    return performanceMonitor.getErrors()
  }

  return {
    trackCustomMetric,
    getMetrics,
    getErrors
  }
}

// Componente para monitoramento automático
interface PerformanceComponentProps {
  componentName: string
  children: React.ReactNode
}

export function PerformanceMonitoredComponent({ 
  componentName, 
  children 
}: PerformanceComponentProps) {
  const { trackCustomMetric } = usePerformanceMonitoring()
  
  React.useEffect(() => {
    const startTime = performance.now()
    
    return () => {
      const endTime = performance.now()
      const renderTime = endTime - startTime
      
      trackCustomMetric(`component_render_${componentName}`, renderTime)
    }
  }, [componentName, trackCustomMetric])

  return <>{children}</>
}

// Utility functions
export function measureAsync<T>(
  asyncFunction: () => Promise<T>,
  metricName: string
): Promise<T> {
  const startTime = performance.now()
  
  return asyncFunction().then(result => {
    const endTime = performance.now()
    const duration = endTime - startTime
    
    performanceMonitor.trackCustomMetric(metricName, duration)
    
    return result
  })
}

export function measureSync<T>(
  syncFunction: () => T,
  metricName: string
): T {
  const startTime = performance.now()
  const result = syncFunction()
  const endTime = performance.now()
  const duration = endTime - startTime
  
  performanceMonitor.trackCustomMetric(metricName, duration)
  
  return result
}

// Performance budget alerts
const PERFORMANCE_BUDGETS = {
  LCP: 2500,
  FID: 100,
  CLS: 0.1,
  FCP: 1800,
  TTFB: 800,
  RESOURCE_SIZE: 1000000, // 1MB
  BUNDLE_SIZE: 500000, // 500KB
}

export function checkPerformanceBudget() {
  const metrics = performanceMonitor.getMetrics()
  const violations: string[] = []

  if (metrics.lcp && metrics.lcp > PERFORMANCE_BUDGETS.LCP) {
    violations.push(`LCP excedeu budget: ${metrics.lcp}ms > ${PERFORMANCE_BUDGETS.LCP}ms`)
  }

  if (metrics.fid && metrics.fid > PERFORMANCE_BUDGETS.FID) {
    violations.push(`FID excedeu budget: ${metrics.fid}ms > ${PERFORMANCE_BUDGETS.FID}ms`)
  }

  if (metrics.cls && metrics.cls > PERFORMANCE_BUDGETS.CLS) {
    violations.push(`CLS excedeu budget: ${metrics.cls} > ${PERFORMANCE_BUDGETS.CLS}`)
  }

  if (metrics.fcp && metrics.fcp > PERFORMANCE_BUDGETS.FCP) {
    violations.push(`FCP excedeu budget: ${metrics.fcp}ms > ${PERFORMANCE_BUDGETS.FCP}ms`)
  }

  if (violations.length > 0) {
    trackEvent('performance_budget_violation', {
      violations,
      timestamp: new Date().toISOString()
    })
  }

  return {
    passed: violations.length === 0,
    violations
  }
}