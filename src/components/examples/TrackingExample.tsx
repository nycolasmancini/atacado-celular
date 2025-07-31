'use client'

/**
 * EXAMPLE: How to implement tracking in components
 * This file demonstrates all tracking patterns implemented in the system
 */

import { useEffect } from 'react'
import { TrackedButton } from '@/components/ui/TrackedButton'
import { useTracking } from '@/components/providers/TrackingProvider'
import { useSectionTracking } from '@/hooks/useSectionTracking'
import { useScrollDepthTracking } from '@/hooks/useScrollDepthTracking'
import { useUTMNavigation } from '@/lib/utm'
import { 
  trackKitPurchaseConversion, 
  trackCatalogDownloadConversion,
  trackPurchaseFunnelStep,
  trackSectionBounce
} from '@/lib/conversions'

export default function TrackingExample() {
  // 1. Get tracking context
  const { trackEvent, identifyUser, getCurrentUTM } = useTracking()
  
  // 2. Track section visibility and time spent
  const sectionRef = useSectionTracking({ 
    sectionName: 'example_section',
    threshold: 0.5, // 50% visible
    minTimeMs: 2000 // Track only if 2+ seconds
  })
  
  // 3. Enable scroll depth tracking for this component
  useScrollDepthTracking({ enabled: true })
  
  // 4. UTM-aware navigation
  const { navigateWithUTM, getCurrentUTM: getUTM } = useUTMNavigation()

  // 5. Component-level tracking
  useEffect(() => {
    // Track component mount
    trackEvent('component_mounted', {
      component_name: 'TrackingExample',
      utm_data: getCurrentUTM()
    })
  }, [trackEvent, getCurrentUTM])

  // Example tracking functions
  const handleCTAClick = () => {
    // Automatic tracking via TrackedButton component
    console.log('CTA clicked - tracking handled automatically')
  }

  const handleKitPurchase = () => {
    // Track kit purchase conversion (Primary Goal)
    trackKitPurchaseConversion({
      kit_id: 'kit_001',
      kit_name: 'Kit Premium Example',
      quantity: 2,
      total_value: 200.00,
      transaction_id: `txn_${Date.now()}`
    })
    
    // Track funnel completion
    trackPurchaseFunnelStep('PURCHASE_COMPLETE', {
      kit_id: 'kit_001',
      total_value: 200.00
    })
  }

  const handleCatalogDownload = () => {
    // Track catalog download (Secondary Goal)
    trackCatalogDownloadConversion('example_page')
  }

  const handleWhatsAppSubmit = (whatsapp: string) => {
    // Identify user for heatmap tracking
    identifyUser(whatsapp, {
      source: 'example_form',
      custom_field: 'example_value'
    })
    
    // Track funnel step
    trackPurchaseFunnelStep('WHATSAPP_SUBMIT', {
      source: 'example_form'
    })
  }

  const handleCustomEvent = () => {
    // Custom event tracking
    trackEvent('custom_interaction', {
      event_category: 'engagement',
      event_action: 'button_click',
      event_label: 'custom_button',
      value: 10,
      custom_data: {
        button_color: 'blue',
        button_size: 'large',
        user_segment: 'premium'
      }
    })
  }

  const handleSectionExit = () => {
    // Track section bounce (called when user leaves section quickly)
    const timeSpent = 3000 // 3 seconds
    trackSectionBounce('example_section', timeSpent)
  }

  const handleUTMNavigation = () => {
    // Navigate while preserving UTM parameters
    navigateWithUTM('/catalogo')
  }

  return (
    <section ref={sectionRef} className="p-8 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6">Tracking Implementation Examples</h2>
      
      <div className="space-y-4">
        {/* 1. Tracked Button with automatic CTA tracking */}
        <TrackedButton
          trackingId="example_cta_click"
          trackingCategory="engagement"
          trackingAction="cta_click"
          trackingLabel="example_button"
          location="example_section"
          onClick={handleCTAClick}
          className="bg-orange-500 text-white px-6 py-3 rounded-lg"
        >
          Tracked CTA Button
        </TrackedButton>

        {/* 2. Conversion tracking buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleKitPurchase}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Simulate Kit Purchase
          </button>
          
          <button
            onClick={handleCatalogDownload}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Simulate Catalog Download
          </button>
        </div>

        {/* 3. WhatsApp form simulation */}
        <div className="border p-4 rounded">
          <h3 className="font-semibold mb-2">WhatsApp Form Example</h3>
          <input
            type="tel"
            placeholder="(11) 99999-9999"
            className="border px-3 py-2 rounded mr-2"
            id="whatsapp-example"
          />
          <button
            onClick={() => {
              const input = document.getElementById('whatsapp-example') as HTMLInputElement
              if (input?.value) {
                handleWhatsAppSubmit(input.value)
              }
            }}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit WhatsApp
          </button>
        </div>

        {/* 4. Custom event tracking */}
        <button
          onClick={handleCustomEvent}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Track Custom Event
        </button>

        {/* 5. UTM-aware navigation */}
        <button
          onClick={handleUTMNavigation}
          className="bg-indigo-500 text-white px-4 py-2 rounded"
        >
          Navigate with UTM
        </button>

        {/* 6. Section bounce simulation */}
        <button
          onClick={handleSectionExit}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Simulate Section Exit
        </button>
      </div>

      {/* Current UTM Display */}
      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">Current UTM Parameters:</h3>
        <pre className="text-sm">
          {JSON.stringify(getUTM(), null, 2)}
        </pre>
      </div>

      {/* DataLayer Preview */}
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h3 className="font-semibold mb-2">DataLayer (Last 3 events):</h3>
        <button
          onClick={() => {
            if (typeof window !== 'undefined' && window.dataLayer) {
              const lastEvents = window.dataLayer.slice(-3)
              console.log('DataLayer Preview:', lastEvents)
              alert('Check console for dataLayer preview')
            }
          }}
          className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
        >
          Show DataLayer in Console
        </button>
      </div>
    </section>
  )
}

/**
 * USAGE PATTERNS:
 * 
 * 1. Automatic CTA Tracking:
 *    Use TrackedButton component for all CTAs
 * 
 * 2. Section Tracking:
 *    Use useSectionTracking hook in main sections
 * 
 * 3. Conversion Tracking:
 *    Call trackKitPurchaseConversion() on purchase success
 *    Call trackCatalogDownloadConversion() on catalog access
 * 
 * 4. User Identification:
 *    Call identifyUser() when WhatsApp is provided
 * 
 * 5. Custom Events:
 *    Use trackEvent() for any custom interactions
 * 
 * 6. UTM Preservation:
 *    Use useUTMNavigation hook for programmatic navigation
 *    Or createUTMAwareLink() for link components
 * 
 * 7. Funnel Tracking:
 *    Use trackPurchaseFunnelStep() at key funnel points
 * 
 * 8. Scroll Depth:
 *    Enabled automatically via useScrollDepthTracking hook
 */