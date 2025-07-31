'use client'

import { ReactNode } from 'react'
import { useInViewAnimation, getAnimationClasses } from '@/hooks/useInViewAnimation'

interface AnimatedSectionProps {
  children: ReactNode
  animation?: 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'fadeInScale' | 'fadeIn'
  delay?: number
  threshold?: number
  className?: string
  id?: string
}

export function AnimatedSection({
  children,
  animation = 'fadeInUp',
  delay = 0,
  threshold = 0.1,
  className = '',
  id
}: AnimatedSectionProps) {
  const { elementRef, isInView } = useInViewAnimation({ 
    threshold, 
    delay 
  })

  return (
    <div
      ref={elementRef}
      id={id}
      className={`${getAnimationClasses(animation, isInView)} ${className}`}
    >
      {children}
    </div>
  )
}

// Specialized components for common use cases
export function AnimatedCard({ 
  children, 
  className = '', 
  delay = 0,
  interactive = true 
}: { 
  children: ReactNode
  className?: string
  delay?: number
  interactive?: boolean
}) {
  const { elementRef, isInView } = useInViewAnimation({ delay })

  return (
    <div
      ref={elementRef}
      className={`${getAnimationClasses('fadeInUp', isInView)} ${
        interactive ? 'card-interactive card-glow' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function AnimatedButton({ 
  children, 
  className = '', 
  variant = 'primary',
  onClick,
  ...props 
}: { 
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary'
  onClick?: () => void
  [key: string]: any
}) {
  const baseClass = variant === 'primary' 
    ? 'btn-primary-interactive' 
    : 'btn-secondary-interactive'

  return (
    <button
      className={`${baseClass} focus-ring ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export function AnimatedLink({ 
  children, 
  href, 
  className = '',
  ...props 
}: { 
  children: ReactNode
  href: string
  className?: string
  [key: string]: any
}) {
  return (
    <a
      href={href}
      className={`link-animated focus-ring ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}