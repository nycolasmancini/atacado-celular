'use client'

import { useEffect } from 'react'
import { useTracking } from '../providers/TrackingProvider'

export default function TrackingTest() {
  const { trackEvent, isInitialized } = useTracking()

  useEffect(() => {
    console.log('TrackingTest mounted, isInitialized:', isInitialized)
    
    // Test basic tracking
    trackEvent('test_event', {
      test_data: 'tracking_system_working',
      timestamp: Date.now()
    })
  }, [trackEvent, isInitialized])

  return (
    <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-2 rounded text-xs z-50">
      Tracking: {isInitialized ? '✅' : '❌'}
    </div>
  )
}