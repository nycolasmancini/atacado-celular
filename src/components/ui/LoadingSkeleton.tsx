'use client'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'image'
  width?: string | number
  height?: string | number
  lines?: number
}

export function LoadingSkeleton({ 
  className = '', 
  variant = 'rectangular',
  width,
  height,
  lines = 1
}: LoadingSkeletonProps) {
  const getSkeletonClasses = () => {
    const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]'
    
    switch (variant) {
      case 'text':
        return `${baseClasses} h-4 rounded`
      case 'circular':
        return `${baseClasses} rounded-full`
      case 'rectangular':
        return `${baseClasses} rounded`
      case 'card':
        return `${baseClasses} rounded-xl`
      case 'image':
        return `${baseClasses} rounded-lg`
      default:
        return `${baseClasses} rounded`
    }
  }

  const getStyle = () => {
    const style: React.CSSProperties = {}
    if (width) style.width = typeof width === 'number' ? `${width}px` : width
    if (height) style.height = typeof height === 'number' ? `${height}px` : height
    return style
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }, (_, index) => (
          <div 
            key={index}
            className={getSkeletonClasses()}
            style={getStyle()}
          />
        ))}
      </div>
    )
  }

  return (
    <div 
      className={`${getSkeletonClasses()} ${className}`}
      style={getStyle()}
    />
  )
}

// Predefined skeleton components
export function ImageSkeleton({ 
  className = '', 
  width = '100%', 
  height = '200px' 
}: { 
  className?: string
  width?: string | number
  height?: string | number 
}) {
  return (
    <LoadingSkeleton 
      variant="image"
      className={className}
      width={width}
      height={height}
    />
  )
}

export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`p-6 space-y-4 ${className}`}>
      <LoadingSkeleton variant="rectangular" height={200} />
      <LoadingSkeleton variant="text" width="75%" />
      <LoadingSkeleton variant="text" width="50%" />
      <div className="flex space-x-2">
        <LoadingSkeleton variant="rectangular" width={80} height={32} />
        <LoadingSkeleton variant="rectangular" width={100} height={32} />
      </div>
    </div>
  )
}

export function TextSkeleton({ 
  lines = 3, 
  className = '' 
}: { 
  lines?: number
  className?: string 
}) {
  return (
    <LoadingSkeleton 
      variant="text"
      lines={lines}
      className={className}
    />
  )
}

export function AvatarSkeleton({ 
  size = 40, 
  className = '' 
}: { 
  size?: number
  className?: string 
}) {
  return (
    <LoadingSkeleton 
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  )
}