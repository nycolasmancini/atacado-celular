import dynamic from 'next/dynamic'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

// Utility for creating dynamic imports with consistent loading states
export function createDynamicComponent<P = {}>(
  importFunction: () => Promise<any>,
  options?: {
    loading?: React.ComponentType
    ssr?: boolean
    name?: string
  }
) {
  return dynamic(importFunction, {
    loading: options?.loading || (() => <LoadingSkeleton />),
    ssr: options?.ssr ?? true,
    // Add displayName for debugging
    ...(options?.name && { displayName: options.name })
  })
}

// Heavy components that should be lazy loaded
export const DynamicComponents = {
  // Admin components (only load when needed)
  AdminDashboard: createDynamicComponent(
    () => import('@/components/admin/AdminDashboard'),
    { 
      ssr: false,
      name: 'AdminDashboard',
      loading: () => <div className="p-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    }
  ),

  KitEditor: createDynamicComponent(
    () => import('@/components/admin/KitEditor'),
    { 
      ssr: false,
      name: 'KitEditor'
    }
  ),

  // Chart components (heavy libraries)
  ReportsChart: createDynamicComponent(
    () => import('@/components/charts/ReportsChart'),
    {
      ssr: false,
      name: 'ReportsChart',
      loading: () => <div className="w-full h-64 bg-gray-100 rounded animate-pulse flex items-center justify-center">
        <span className="text-gray-500">Carregando gráfico...</span>
      </div>
    }
  ),

  // Modal components
  WhatsAppModal: createDynamicComponent(
    () => import('@/components/landing/WhatsAppModal'),
    {
      ssr: false,
      name: 'WhatsAppModal',
      loading: () => <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg animate-pulse">
          <div className="w-80 h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    }
  ),

  CartDrawer: createDynamicComponent(
    () => import('@/components/catalog/CartDrawer'),
    {
      ssr: false,
      name: 'CartDrawer',
      loading: () => <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg animate-pulse">
        <div className="p-4 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    }
  ),

  // Tracking and analytics components
  PerformanceMonitor: createDynamicComponent(
    () => import('@/components/optimization/PerformanceMonitor'),
    {
      ssr: false,
      name: 'PerformanceMonitor'
    }
  ),

  TrackingProvider: createDynamicComponent(
    () => import('@/contexts/TrackingContext').then(mod => ({ default: mod.TrackingProvider })),
    {
      ssr: true,
      name: 'TrackingProvider'
    }
  ),

  // Product components for catalog
  ProductCard: createDynamicComponent(
    () => import('@/components/catalog/ProductCard'),
    {
      ssr: true,
      name: 'ProductCard',
      loading: () => <div className="border rounded-lg p-4 animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    }
  ),

  // Heavy UI components
  DateRangePicker: createDynamicComponent(
    () => import('@/components/admin/DateRangePicker'),
    {
      ssr: false,
      name: 'DateRangePicker'
    }
  ),

  // SEO and social components
  SocialProofSection: createDynamicComponent(
    () => import('@/components/landing/SocialProofSection'),
    {
      ssr: true,
      name: 'SocialProofSection'
    }
  ),

  TestimonialsSection: createDynamicComponent(
    () => import('@/components/landing/TestimonialsSection'),
    {
      ssr: true,
      name: 'TestimonialsSection'
    }
  ),
}

// Route-based code splitting helpers
export const RouteComponents = {
  // Landing page sections
  HeroSection: createDynamicComponent(
    () => import('@/components/landing/HeroSection'),
    { ssr: true, name: 'HeroSection' }
  ),

  KitsSection: createDynamicComponent(
    () => import('@/components/landing/KitsSection'),
    { ssr: true, name: 'KitsSection' }
  ),

  FAQSection: createDynamicComponent(
    () => import('@/components/landing/FAQSection'),
    { ssr: true, name: 'FAQSection' }
  ),

  // Catalog page
  CatalogGrid: createDynamicComponent(
    () => import('@/components/catalog/CatalogGrid'),
    { ssr: true, name: 'CatalogGrid' }
  ),

  // Admin pages
  AdminLayout: createDynamicComponent(
    () => import('@/app/admin/layout'),
    { ssr: false, name: 'AdminLayout' }
  ),
}

// Performance optimization utilities
export const preloadComponent = (importFunction: () => Promise<any>) => {
  if (typeof window !== 'undefined') {
    // Preload on idle or after a delay
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        importFunction().catch(console.error)
      })
    } else {
      setTimeout(() => {
        importFunction().catch(console.error)
      }, 2000)
    }
  }
}

// Bundle splitting by feature
export const FeatureBundles = {
  admin: () => import('@/features/admin'),
  catalog: () => import('@/features/catalog'),
  tracking: () => import('@/features/tracking'),
  payments: () => import('@/features/payments'),
}

// Preload critical route components
export const preloadCriticalComponents = () => {
  // Preload components likely to be needed soon
  preloadComponent(() => import('@/components/landing/WhatsAppModal'))
  preloadComponent(() => import('@/components/catalog/CartDrawer'))
}