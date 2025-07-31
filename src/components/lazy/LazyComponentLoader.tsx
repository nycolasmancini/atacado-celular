'use client'

import { Suspense, lazy, ComponentType } from 'react'
import LoadingSkeleton from '@/components/ui/LoadingSkeleton'

interface LazyComponentLoaderProps {
  importFunction: () => Promise<{ default: ComponentType<any> }>
  fallback?: React.ReactNode
  className?: string
  // Performance options
  preload?: boolean
  // Error boundary
  onError?: (error: Error) => void
}

// Higher-order component for lazy loading with error boundary
function withErrorBoundary<P extends object>(
  Component: ComponentType<P>,
  onError?: (error: Error) => void
) {
  return function ErrorBoundaryWrapper(props: P) {
    try {
      return <Component {...props} />
    } catch (error) {
      onError?.(error as Error)
      return (
        <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">
          <p className="text-sm">Erro ao carregar componente</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
          >
            Recarregar página
          </button>
        </div>
      )
    }
  }
}

export default function LazyComponentLoader({
  importFunction,
  fallback,
  className = '',
  preload = false,
  onError,
  ...props
}: LazyComponentLoaderProps & any) {
  // Create lazy component
  const LazyComponent = lazy(importFunction)
  
  // Preload component if requested
  if (preload && typeof window !== 'undefined') {
    // Preload on next tick to avoid blocking initial render
    setTimeout(() => {
      importFunction().catch(console.error)
    }, 0)
  }

  // Wrap with error boundary if onError is provided
  const WrappedComponent = onError 
    ? withErrorBoundary(LazyComponent, onError)
    : LazyComponent

  const defaultFallback = (
    <div className={`animate-pulse ${className}`}>
      <LoadingSkeleton />
    </div>
  )

  return (
    <Suspense fallback={fallback || defaultFallback}>
      <WrappedComponent {...props} />
    </Suspense>
  )
}

// Utility function to create lazy components with consistent loading
export function createLazyComponent<P extends object>(
  importFunction: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    fallback?: React.ReactNode
    preload?: boolean
    onError?: (error: Error) => void
  }
) {
  return function LazyWrapper(props: P) {
    return (
      <LazyComponentLoader
        importFunction={importFunction}
        fallback={options?.fallback}
        preload={options?.preload}
        onError={options?.onError}
        {...props}
      />
    )
  }
}

// Pre-configured lazy components for common use cases
export const LazyModal = createLazyComponent(
  () => import('@/components/ui/Modal'),
  {
    fallback: <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg animate-pulse">
        <div className="w-64 h-32 bg-gray-200 rounded"></div>
      </div>
    </div>
  }
)

export const LazyChart = createLazyComponent(
  () => import('@/components/charts/ChartComponent'),
  {
    fallback: <div className="w-full h-64 bg-gray-100 rounded animate-pulse flex items-center justify-center">
      <span className="text-gray-500">Carregando gráfico...</span>
    </div>
  }
)

export const LazyEditor = createLazyComponent(
  () => import('@/components/editor/RichEditor'),
  {
    fallback: <div className="w-full h-40 bg-gray-100 rounded animate-pulse"></div>
  }
)