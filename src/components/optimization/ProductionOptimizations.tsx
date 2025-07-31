'use client'

import { useEffect } from 'react'
import Script from 'next/script'

interface ProductionOptimizationsProps {
  children: React.ReactNode
}

export default function ProductionOptimizations({ children }: ProductionOptimizationsProps) {
  useEffect(() => {
    // Performance optimizations that only run in production
    if (process.env.NODE_ENV === 'production') {
      // Service Worker registration for caching
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
          console.log('SW registration failed: ', error)
        })
      }

      // Web Vitals monitoring
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(console.log)
        getFID(console.log)
        getFCP(console.log)
        getLCP(console.log)
        getTTFB(console.log)
      }).catch(() => {
        // web-vitals not available
      })

      // Preload critical resources
      const preloadLinks = [
        '/api/kits',
        '/catalogo',
      ]

      preloadLinks.forEach(href => {
        const link = document.createElement('link')
        link.rel = 'prefetch'
        link.href = href
        document.head.appendChild(link)
      })

      // Lazy load non-critical CSS
      const loadCSS = (href: string) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.media = 'print'
        link.onload = function() {
          // @ts-ignore
          this.media = 'all'
        }
        document.head.appendChild(link)
      }

      // Load non-critical styles after page load
      setTimeout(() => {
        // Add any non-critical CSS files here
        // loadCSS('/styles/non-critical.css')
      }, 1000)
    }
  }, [])

  return (
    <>
      {/* DNS Prefetch (only in production) */}
      {process.env.NODE_ENV === 'production' && (
        <>
          <link rel="dns-prefetch" href="//fonts.googleapis.com" />
          <link rel="dns-prefetch" href="//fonts.gstatic.com" />
          <link rel="dns-prefetch" href="//www.googletagmanager.com" />
          <link rel="dns-prefetch" href="//res.cloudinary.com" />
          
          {/* Preconnect for critical resources */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          
          {/* Critical resource hints */}
          <link rel="prefetch" href="/api/kits" />
          <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        </>
      )}

      {/* Web Vitals Monitoring Script */}
      {process.env.NODE_ENV === 'production' && (
        <Script
          id="web-vitals"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function sendToAnalytics(metric) {
                if (window.gtag) {
                  window.gtag('event', metric.name, {
                    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
                    event_category: 'Web Vitals',
                    event_label: metric.id,
                    non_interaction: true,
                  });
                }
              }
              
              // Only load web-vitals in production
              import('https://unpkg.com/web-vitals@3/dist/web-vitals.js').then(({
                getCLS, getFID, getFCP, getLCP, getTTFB
              }) => {
                getCLS(sendToAnalytics);
                getFID(sendToAnalytics);
                getFCP(sendToAnalytics);
                getLCP(sendToAnalytics);
                getTTFB(sendToAnalytics);
              }).catch(() => {});
            `
          }}
        />
      )}

      {children}
    </>
  )
}