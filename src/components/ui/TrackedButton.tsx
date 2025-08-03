'use client'

import { forwardRef, ReactNode } from 'react'
import { Button, ButtonProps } from './Button'
import { useTracking } from '@/contexts/TrackingContext'
import { trackCTAClick } from '@/lib/gtm'
import { trackHeatmapCTAClick } from '@/lib/heatmaps'

interface TrackedButtonProps extends ButtonProps {
  trackingId: string
  trackingCategory?: string
  trackingAction?: string
  trackingLabel?: string
  trackingValue?: number
  location?: string
  kitId?: string
  children: ReactNode
}

export const TrackedButton = forwardRef<HTMLButtonElement, TrackedButtonProps>(
  ({
    trackingId,
    trackingCategory = 'engagement',
    trackingAction = 'click',
    trackingLabel,
    trackingValue,
    location = 'unknown',
    kitId,
    children,
    onClick,
    ...props
  }, ref) => {
    const { trackEvent } = useTracking()

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      try {
        // Track with GTM
        trackCTAClick(location, trackingLabel || children?.toString(), kitId)

        // Track with heatmaps
        trackHeatmapCTAClick(location, trackingLabel || children?.toString(), e.currentTarget)

        // Track with custom event
        trackEvent(trackingId, {
          event_category: trackingCategory,
          event_action: trackingAction,
          event_label: trackingLabel || children?.toString(),
          value: trackingValue,
          location,
          kit_id: kitId,
          button_text: children?.toString(),
          timestamp: Date.now()
        })

        // Call original onClick handler
        onClick?.(e)
      } catch (error) {
        console.error('Error tracking button click:', error)
        // Still call original onClick even if tracking fails
        onClick?.(e)
      }
    }

    return (
      <Button
        ref={ref}
        onClick={handleClick}
        data-tracking-id={trackingId}
        data-tracking-location={location}
        {...props}
      >
        {children}
      </Button>
    )
  }
)

TrackedButton.displayName = 'TrackedButton'