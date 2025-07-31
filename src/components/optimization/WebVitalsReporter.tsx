'use client'

import { useEffect } from 'react'
import { initPerformanceTracking } from '@/lib/web-vitals'

export default function WebVitalsReporter() {
  useEffect(() => {
    // Initialize performance tracking
    initPerformanceTracking()
    
    // Report web vitals in production
    if (process.env.NODE_ENV === 'production') {
      // Use web-vitals library directly instead of Next.js internal
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS(console.log)
        onFID(console.log)
        onFCP(console.log)
        onLCP(console.log)
        onTTFB(console.log)
      }).catch(() => {
        // Web vitals not available
      })
    }
    
    // Clean up on unmount
    return () => {
      // Clean up any ongoing performance monitoring
    }
  }, [])

  // This component doesn't render anything
  return null
}