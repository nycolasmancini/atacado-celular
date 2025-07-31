'use client'

import { useEffect, useState } from 'react'

interface PerformanceMetrics {
  lcp?: number
  inp?: number
  cls?: number
  fcp?: number
  ttfb?: number
}

export default function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    let webVitalsPromise: Promise<any> | null = null

    // Dynamic import of web-vitals
    const loadWebVitals = async () => {
      try {
        webVitalsPromise = import('web-vitals')
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = await webVitalsPromise
        
        const updateMetric = (metric: any) => {
          const name = metric.name.toLowerCase().replace('fid', 'inp')
          setMetrics(prev => ({
            ...prev,
            [name]: metric.value
          }))
        }

        onCLS(updateMetric)
        onINP(updateMetric)
        onFCP(updateMetric)
        onLCP(updateMetric)
        onTTFB(updateMetric)
      } catch (error) {
        console.log('Web Vitals not available:', error)
      }
    }

    loadWebVitals()

    // Show/hide with keyboard shortcut
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const getScoreColor = (value: number, thresholds: { good: number; poor: number }) => {
    if (value <= thresholds.good) return 'text-green-600'
    if (value <= thresholds.poor) return 'text-yellow-600'
    return 'text-red-600'
  }

  const formatValue = (value: number | undefined, unit: string) => {
    if (value === undefined) return 'N/A'
    return `${Math.round(value)}${unit}`
  }

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return (
      <div className="fixed bottom-4 left-4 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded z-50">
        Press Ctrl+Shift+P for performance metrics
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-sm z-50 max-w-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">Web Vitals</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>LCP:</span>
          <span className={getScoreColor(metrics.lcp || 0, { good: 2500, poor: 4000 })}>
            {formatValue(metrics.lcp, 'ms')}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>INP:</span>
          <span className={getScoreColor(metrics.inp || 0, { good: 200, poor: 500 })}>
            {formatValue(metrics.inp, 'ms')}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>CLS:</span>
          <span className={getScoreColor((metrics.cls || 0) * 1000, { good: 100, poor: 250 })}>
            {metrics.cls ? (metrics.cls * 1000).toFixed(0) : 'N/A'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>FCP:</span>
          <span className={getScoreColor(metrics.fcp || 0, { good: 1800, poor: 3000 })}>
            {formatValue(metrics.fcp, 'ms')}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>TTFB:</span>
          <span className={getScoreColor(metrics.ttfb || 0, { good: 800, poor: 1800 })}>
            {formatValue(metrics.ttfb, 'ms')}
          </span>
        </div>
      </div>
      
      <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
        <div>🟢 Good • 🟡 Needs Improvement • 🔴 Poor</div>
        <div className="mt-1">Press Ctrl+Shift+P to toggle</div>
      </div>
    </div>
  )
}