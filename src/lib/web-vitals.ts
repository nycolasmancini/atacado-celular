import { onCLS, onFID, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

// Types for Web Vitals
export interface WebVitalsReport {
  id: string;
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  navigationType: string;
  entries: PerformanceEntry[];
}

// Analytics endpoint
const ANALYTICS_ENDPOINT = '/api/analytics/web-vitals';

// Send metrics to analytics
function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    id: metric.id,
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    navigationType: metric.navigationType,
    url: window.location.pathname,
    userAgent: navigator.userAgent,
    timestamp: Date.now(),
  });

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(ANALYTICS_ENDPOINT, body);
  } else {
    fetch(ANALYTICS_ENDPOINT, {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      keepalive: true,
    }).catch(console.error);
  }
}

// Send to Google Analytics (if GTM is configured)
function sendToGoogleAnalytics(metric: Metric) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
      custom_map: {
        metric_rating: metric.rating,
        metric_delta: metric.delta,
      },
    });
  }
}

// Main Web Vitals tracking function
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  try {
    // Track Core Web Vitals
    onCLS((metric) => {
      sendToAnalytics(metric);
      sendToGoogleAnalytics(metric);
    });

    onFID((metric) => {
      sendToAnalytics(metric);
      sendToGoogleAnalytics(metric);
    });

    onFCP((metric) => {
      sendToAnalytics(metric);
      sendToGoogleAnalytics(metric);
    });

    onLCP((metric) => {
      sendToAnalytics(metric);
      sendToGoogleAnalytics(metric);
    });

    onTTFB((metric) => {
      sendToAnalytics(metric);
      sendToGoogleAnalytics(metric);
    });

  } catch (error) {
    console.error('Error tracking Web Vitals:', error);
  }
}

// Performance Observer for custom metrics
export function trackCustomMetrics() {
  if (typeof window === 'undefined' || !window.PerformanceObserver) return;

  try {
    // Track Long Tasks
    const longTaskObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 50) { // Tasks longer than 50ms
          sendToAnalytics({
            id: `long-task-${Date.now()}`,
            name: 'long-task',
            value: entry.duration,
            rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
            delta: 0,
            navigationType: 'navigate',
            entries: [entry],
          } as any);
        }
      }
    });

    longTaskObserver.observe({ entryTypes: ['longtask'] });

    // Track Navigation Timing
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const navEntry = entry as PerformanceNavigationTiming;
        
        // DOM Content Loaded
        const domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.domContentLoadedEventStart;
        if (domContentLoaded > 0) {
          sendToAnalytics({
            id: `dcl-${Date.now()}`,
            name: 'dom-content-loaded',
            value: domContentLoaded,
            rating: domContentLoaded < 1000 ? 'good' : domContentLoaded < 2000 ? 'needs-improvement' : 'poor',
            delta: 0,
            navigationType: 'navigate',
            entries: [entry],
          } as any);
        }

        // Page Load Time
        const loadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
        if (loadTime > 0) {
          sendToAnalytics({
            id: `load-${Date.now()}`,
            name: 'page-load',
            value: loadTime,
            rating: loadTime < 2000 ? 'good' : loadTime < 4000 ? 'needs-improvement' : 'poor',
            delta: 0,
            navigationType: 'navigate',
            entries: [entry],
          } as any);
        }
      }
    });

    navObserver.observe({ entryTypes: ['navigation'] });

    // Track Resource Loading
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const resourceEntry = entry as PerformanceResourceTiming;
        
        // Track slow resources (>1s)
        if (resourceEntry.duration > 1000) {
          sendToAnalytics({
            id: `slow-resource-${Date.now()}`,
            name: 'slow-resource',
            value: resourceEntry.duration,
            rating: 'poor',
            delta: 0,
            navigationType: 'navigate',
            entries: [entry],
          } as any);
        }
      }
    });

    resourceObserver.observe({ entryTypes: ['resource'] });

  } catch (error) {
    console.error('Error tracking custom metrics:', error);
  }
}

// Memory usage tracking
export function trackMemoryUsage() {
  if (typeof window === 'undefined' || !('memory' in performance)) return;

  try {
    const memInfo = (performance as any).memory;
    
    sendToAnalytics({
      id: `memory-${Date.now()}`,
      name: 'memory-usage',
      value: memInfo.usedJSHeapSize,
      rating: memInfo.usedJSHeapSize > 50000000 ? 'poor' : 
              memInfo.usedJSHeapSize > 25000000 ? 'needs-improvement' : 'good',
      delta: 0,
      navigationType: 'navigate',
      entries: [],
    } as any);

  } catch (error) {
    console.error('Error tracking memory usage:', error);
  }
}

// Initialize all tracking
export function initPerformanceTracking() {
  if (typeof window === 'undefined') return;

  // Wait for page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        trackWebVitals();
        trackCustomMetrics();
        trackMemoryUsage();
      }, 1000);
    });
  } else {
    setTimeout(() => {
      trackWebVitals();
      trackCustomMetrics();
      trackMemoryUsage();
    }, 1000);
  }
}