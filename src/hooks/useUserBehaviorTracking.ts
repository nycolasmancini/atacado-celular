'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { trackEvent } from '@/lib/tracking'

// Interfaces para tracking de comportamento
interface MouseHeatmapData {
  x: number
  y: number
  timestamp: number
  element?: string
}

interface ClickHeatmapData {
  x: number
  y: number
  element: string
  timestamp: number
  pageX: number
  pageY: number
}

interface FormAnalytics {
  formId: string
  fieldInteractions: Record<string, {
    focuses: number
    blurs: number
    changes: number
    timeSpent: number
    errors: number
  }>
  abandonmentPoint?: string
  completionTime?: number
  submitted: boolean
}

interface ReadingPattern {
  section: string
  timeSpent: number
  scrollDepth: number
  readingSpeed: number // palavras por minuto
  backtracking: number // quantas vezes voltou na seção
}

// Hook principal para tracking de comportamento
export function useUserBehaviorTracking() {
  const [isActive, setIsActive] = useState(false)
  const mouseMovements = useRef<MouseHeatmapData[]>([])
  const clickData = useRef<ClickHeatmapData[]>([])
  const formAnalytics = useRef<Record<string, FormAnalytics>>({})
  const readingPatterns = useRef<ReadingPattern[]>([])
  const sessionData = useRef({
    ragePicks: 0, // Cliques rápidos repetidos
    deadClicks: 0, // Cliques em elementos não clicáveis
    frustrationEvents: 0,
    pageReloads: 0,
    backButtonUsage: 0
  })

  // Mouse Movement Tracking
  useEffect(() => {
    if (!isActive) return

    let throttleTimeout: NodeJS.Timeout | null = null
    
    const handleMouseMove = (e: MouseEvent) => {
      if (throttleTimeout) return
      
      throttleTimeout = setTimeout(() => {
        const target = e.target as HTMLElement
        mouseMovements.current.push({
          x: e.clientX,
          y: e.clientY,
          timestamp: Date.now(),
          element: target.tagName.toLowerCase() + (target.className ? `.${target.className.split(' ')[0]}` : '')
        })

        // Limitar array para performance
        if (mouseMovements.current.length > 1000) {
          mouseMovements.current = mouseMovements.current.slice(-500)
        }

        throttleTimeout = null
      }, 100) // Throttle para 100ms
    }

    document.addEventListener('mousemove', handleMouseMove, { passive: true })
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (throttleTimeout) clearTimeout(throttleTimeout)
    }
  }, [isActive])

  // Click Tracking Avançado
  useEffect(() => {
    if (!isActive) return

    let lastClickTime = 0
    let clickCount = 0
    let lastClickPosition = { x: 0, y: 0 }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const now = Date.now()
      const clickData: ClickHeatmapData = {
        x: e.clientX,
        y: e.clientY,
        pageX: e.pageX,
        pageY: e.pageY,
        element: target.tagName.toLowerCase() + (target.id ? `#${target.id}` : '') + (target.className ? `.${target.className.split(' ')[0]}` : ''),
        timestamp: now
      }

      // Detectar rage clicks (cliques rápidos repetidos)
      const timeDiff = now - lastClickTime
      const positionDiff = Math.abs(e.clientX - lastClickPosition.x) + Math.abs(e.clientY - lastClickPosition.y)
      
      if (timeDiff < 1000 && positionDiff < 50) { // Menos de 1s e posição similar
        clickCount++
        if (clickCount >= 3) {
          sessionData.current.ragePicks++
          trackEvent('rage_click_detected', {
            element: clickData.element,
            click_count: clickCount,
            position: { x: e.clientX, y: e.clientY },
            timestamp: new Date().toISOString()
          })
        }
      } else {
        clickCount = 1
      }

      // Detectar dead clicks (cliques em elementos não interativos)
      const isInteractive = target.tagName.toLowerCase() === 'button' ||
                           target.tagName.toLowerCase() === 'a' ||
                           target.tagName.toLowerCase() === 'input' ||
                           target.tagName.toLowerCase() === 'select' ||
                           target.tagName.toLowerCase() === 'textarea' ||
                           target.hasAttribute('onclick') ||
                           target.getAttribute('role') === 'button' ||
                           target.style.cursor === 'pointer' ||
                           window.getComputedStyle(target).cursor === 'pointer'

      if (!isInteractive) {
        sessionData.current.deadClicks++
        trackEvent('dead_click_detected', {
          element: clickData.element,
          position: { x: e.clientX, y: e.clientY },
          timestamp: new Date().toISOString()
        })
      }

      lastClickTime = now
      lastClickPosition = { x: e.clientX, y: e.clientY }

      // Salvar dados do click
      clickData.current.push(clickData)
      if (clickData.current.length > 500) {
        clickData.current = clickData.current.slice(-250)
      }

      // Track click geral
      trackEvent('element_clicked_detailed', {
        element: clickData.element,
        position: { x: e.clientX, y: e.clientY, pageX: e.pageX, pageY: e.pageY },
        is_interactive: isInteractive,
        timestamp: new Date().toISOString()
      })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [isActive])

  // Form Analytics
  const trackFormField = useCallback((formId: string, fieldName: string, action: 'focus' | 'blur' | 'change' | 'error') => {
    if (!formAnalytics.current[formId]) {
      formAnalytics.current[formId] = {
        formId,
        fieldInteractions: {},
        submitted: false
      }
    }

    if (!formAnalytics.current[formId].fieldInteractions[fieldName]) {
      formAnalytics.current[formId].fieldInteractions[fieldName] = {
        focuses: 0,
        blurs: 0,
        changes: 0,
        timeSpent: 0,
        errors: 0
      }
    }

    const field = formAnalytics.current[formId].fieldInteractions[fieldName]
    
    switch (action) {
      case 'focus':
        field.focuses++
        break
      case 'blur':
        field.blurs++
        break
      case 'change':
        field.changes++
        break
      case 'error':
        field.errors++
        break
    }

    trackEvent('form_field_interaction', {
      form_id: formId,
      field_name: fieldName,
      action,
      interaction_count: field[action === 'error' ? 'errors' : `${action}s`],
      timestamp: new Date().toISOString()
    })
  }, [])

  // Reading Pattern Analysis
  const trackReadingPattern = useCallback((section: string, content: string) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const startTime = Date.now()
            const wordCount = content.split(' ').length
            let scrollPosition = window.scrollY

            const handleScroll = () => {
              const newPosition = window.scrollY
              // Detectar backtracking (scroll para cima dentro da seção)
              if (newPosition < scrollPosition - 100) {
                const existingPattern = readingPatterns.current.find(p => p.section === section)
                if (existingPattern) {
                  existingPattern.backtracking++
                }
              }
              scrollPosition = newPosition
            }

            const handleSectionExit = () => {
              const timeSpent = Date.now() - startTime
              const readingSpeed = wordCount / (timeSpent / 60000) // palavras por minuto
              
              const pattern: ReadingPattern = {
                section,
                timeSpent,
                scrollDepth: Math.min(100, (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100),
                readingSpeed: isFinite(readingSpeed) ? readingSpeed : 0,
                backtracking: 0
              }

              readingPatterns.current.push(pattern)

              trackEvent('reading_pattern', {
                ...pattern,
                word_count: wordCount,
                timestamp: new Date().toISOString()
              })

              window.removeEventListener('scroll', handleScroll)
              observer.disconnect()
            }

            window.addEventListener('scroll', handleScroll, { passive: true })
            
            // Sair da seção quando não estiver mais visível
            const exitObserver = new IntersectionObserver(
              ([entry]) => {
                if (!entry.isIntersecting) {
                  handleSectionExit()
                }
              },
              { threshold: 0.1 }
            )
            
            exitObserver.observe(entry.target)
          }
        })
      },
      { threshold: 0.5 }
    )

    const element = document.querySelector(`[data-section="${section}"]`)
    if (element) {
      observer.observe(element)
    }

    return () => observer.disconnect()
  }, [])

  // Error and Frustration Detection
  useEffect(() => {
    if (!isActive) return

    // Detectar recarregamentos da página
    const handleBeforeUnload = () => {
      sessionData.current.pageReloads++
    }

    // Detectar uso do botão voltar
    const handlePopState = () => {
      sessionData.current.backButtonUsage++
      trackEvent('back_button_used', {
        timestamp: new Date().toISOString()
      })
    }

    // Detectar erros JavaScript
    const handleError = (e: ErrorEvent) => {
      sessionData.current.frustrationEvents++
      trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        line: e.lineno,
        column: e.colno,
        timestamp: new Date().toISOString()
      })
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    window.addEventListener('popstate', handlePopState)
    window.addEventListener('error', handleError)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      window.removeEventListener('popstate', handlePopState)
      window.removeEventListener('error', handleError)
    }
  }, [isActive])

  // Iniciar tracking
  const startTracking = useCallback(() => {
    setIsActive(true)
    trackEvent('behavior_tracking_started', {
      timestamp: new Date().toISOString()
    })
  }, [])

  // Parar tracking
  const stopTracking = useCallback(() => {
    setIsActive(false)
    
    // Enviar dados finais
    trackEvent('behavior_tracking_stopped', {
      session_data: sessionData.current,
      mouse_movements_count: mouseMovements.current.length,
      clicks_count: clickData.current.length,
      forms_analyzed: Object.keys(formAnalytics.current).length,
      reading_patterns_count: readingPatterns.current.length,
      timestamp: new Date().toISOString()
    })
  }, [])

  // Obter heatmap de mouse
  const getMouseHeatmapData = useCallback(() => {
    return mouseMovements.current.slice()
  }, [])

  // Obter heatmap de clicks
  const getClickHeatmapData = useCallback(() => {
    return clickData.current.slice()
  }, [])

  // Obter analytics de formulários
  const getFormAnalytics = useCallback(() => {
    return { ...formAnalytics.current }
  }, [])

  // Obter padrões de leitura
  const getReadingPatterns = useCallback(() => {
    return readingPatterns.current.slice()
  }, [])

  // Obter dados da sessão
  const getSessionData = useCallback(() => {
    return { ...sessionData.current }
  }, [])

  // Auto-start tracking
  useEffect(() => {
    startTracking()
    return () => {
      stopTracking()
    }
  }, [startTracking, stopTracking])

  return {
    isActive,
    startTracking,
    stopTracking,
    trackFormField,
    trackReadingPattern,
    getMouseHeatmapData,
    getClickHeatmapData,
    getFormAnalytics,
    getReadingPatterns,
    getSessionData
  }
}

// Hook para tracking específico de elementos
export function useElementTracking(elementRef: React.RefObject<HTMLElement>, elementName: string) {
  const [isVisible, setIsVisible] = useState(false)
  const [hoverTime, setHoverTime] = useState(0)
  const hoverStartRef = useRef<number>(0)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Intersection Observer para visibilidade
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
        
        if (entry.isIntersecting) {
          trackEvent('element_visible', {
            element: elementName,
            timestamp: new Date().toISOString()
          })
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(element)

    // Hover tracking
    const handleMouseEnter = () => {
      hoverStartRef.current = Date.now()
      trackEvent('element_hover_start', {
        element: elementName,
        timestamp: new Date().toISOString()
      })
    }

    const handleMouseLeave = () => {
      if (hoverStartRef.current) {
        const duration = Date.now() - hoverStartRef.current
        setHoverTime(prev => prev + duration)
        
        trackEvent('element_hover_end', {
          element: elementName,
          duration,
          timestamp: new Date().toISOString()
        })
      }
    }

    element.addEventListener('mouseenter', handleMouseEnter)
    element.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      observer.disconnect()
      element.removeEventListener('mouseenter', handleMouseEnter)
      element.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [elementName, elementRef])

  return {
    isVisible,
    hoverTime
  }
}

// Componente para tracking automático de seções
interface TrackingSectionProps {
  sectionName: string
  content: string
  children: React.ReactNode
  className?: string
}

export function TrackingSection({ sectionName, content, children, className = '' }: TrackingSectionProps) {
  const { trackReadingPattern } = useUserBehaviorTracking()

  useEffect(() => {
    const cleanup = trackReadingPattern(sectionName, content)
    return cleanup
  }, [sectionName, content, trackReadingPattern])

  return (
    <div data-section={sectionName} className={className}>
      {children}
    </div>
  )
}