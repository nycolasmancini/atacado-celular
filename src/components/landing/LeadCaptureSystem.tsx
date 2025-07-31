'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { trackEvent } from '@/lib/tracking'
import { validateBrazilianWhatsApp } from '@/lib/whatsapp'

// Tipos de triggers disponíveis
export enum TriggerType {
  EXIT_INTENT = 'exit_intent',
  SCROLL_PERCENTAGE = 'scroll_percentage',
  TIME_ON_SITE = 'time_on_site',
  SCROLL_UP = 'scroll_up',
  IDLE_TIME = 'idle_time',
  MULTIPLE_PAGES = 'multiple_pages',
  CART_ABANDONMENT = 'cart_abandonment'
}

// Configurações de trigger
interface TriggerConfig {
  type: TriggerType
  value?: number
  delay?: number
  maxTriggers?: number
}

// Props do componente principal
interface LeadCaptureSystemProps {
  triggers?: TriggerConfig[]
  title?: string
  subtitle?: string
  offer?: string
  className?: string
  onCapture?: (data: LeadData) => void
}

// Dados do lead
interface LeadData {
  name: string
  whatsapp: string
  email?: string
  interest?: string
  source: string
  trigger: string
}

// Componente principal
export default function LeadCaptureSystem({
  triggers = [
    { type: TriggerType.EXIT_INTENT, maxTriggers: 1 },
    { type: TriggerType.SCROLL_PERCENTAGE, value: 80, maxTriggers: 1 },
    { type: TriggerType.TIME_ON_SITE, value: 120000, maxTriggers: 1 }, // 2 minutos
    { type: TriggerType.IDLE_TIME, value: 30000, maxTriggers: 1 } // 30 segundos
  ],
  title = "🎁 OFERTA ESPECIAL PARA VOCÊ!",
  subtitle = "Deixe seu WhatsApp e receba um desconto exclusivo",
  offer = "10% OFF no seu primeiro pedido",
  className = "",
  onCapture
}: LeadCaptureSystemProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTrigger, setCurrentTrigger] = useState<string>('')
  const [triggerCounts, setTriggerCounts] = useState<Record<string, number>>({})
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    interest: 'catalogo'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Refs para tracking
  const startTimeRef = useRef<number>(Date.now())
  const lastScrollRef = useRef<number>(0)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)
  const pageCountRef = useRef<number>(1)

  // Função para verificar se pode mostrar modal
  const canShowModal = useCallback((triggerType: string) => {
    const storageKey = `lead_capture_${triggerType}`
    const lastShown = localStorage.getItem(storageKey)
    const count = triggerCounts[triggerType] || 0
    const maxTriggers = triggers.find(t => t.type === triggerType)?.maxTriggers || 1

    // Verificar se já foi mostrado nas últimas 24 horas
    if (lastShown) {
      const lastShownTime = parseInt(lastShown)
      const twentyFourHours = 24 * 60 * 60 * 1000
      if (Date.now() - lastShownTime < twentyFourHours) {
        return false
      }
    }

    // Verificar limite de triggers
    return count < maxTriggers
  }, [triggerCounts, triggers])

  // Função para mostrar modal
  const showModal = useCallback((triggerType: string) => {
    if (!canShowModal(triggerType) || isModalOpen) return

    setCurrentTrigger(triggerType)
    setIsModalOpen(true)
    
    // Atualizar contadores
    setTriggerCounts(prev => ({
      ...prev,
      [triggerType]: (prev[triggerType] || 0) + 1
    }))

    // Salvar timestamp
    localStorage.setItem(`lead_capture_${triggerType}`, Date.now().toString())

    // Track trigger
    trackEvent('lead_capture_triggered', {
      trigger_type: triggerType,
      timestamp: new Date().toISOString()
    })
  }, [canShowModal, isModalOpen])

  // Exit Intent Detection
  useEffect(() => {
    if (!triggers.some(t => t.type === TriggerType.EXIT_INTENT)) return

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        showModal(TriggerType.EXIT_INTENT)
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [triggers, showModal])

  // Scroll Percentage Detection
  useEffect(() => {
    const scrollTrigger = triggers.find(t => t.type === TriggerType.SCROLL_PERCENTAGE)
    if (!scrollTrigger) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercentage = (scrollTop / documentHeight) * 100

      if (scrollPercentage >= (scrollTrigger.value || 80)) {
        showModal(TriggerType.SCROLL_PERCENTAGE)
      }

      // Detectar scroll para cima (scroll up)
      if (scrollTop < lastScrollRef.current - 100) { // 100px para cima
        const scrollUpTrigger = triggers.find(t => t.type === TriggerType.SCROLL_UP)
        if (scrollUpTrigger && scrollPercentage > 30) {
          showModal(TriggerType.SCROLL_UP)
        }
      }

      lastScrollRef.current = scrollTop
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [triggers, showModal])

  // Time on Site Detection
  useEffect(() => {
    const timeTrigger = triggers.find(t => t.type === TriggerType.TIME_ON_SITE)
    if (!timeTrigger) return

    const timer = setTimeout(() => {
      showModal(TriggerType.TIME_ON_SITE)
    }, timeTrigger.value || 120000)

    return () => clearTimeout(timer)
  }, [triggers, showModal])

  // Idle Time Detection
  useEffect(() => {
    const idleTrigger = triggers.find(t => t.type === TriggerType.IDLE_TIME)
    if (!idleTrigger) return

    const resetIdleTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }

      idleTimerRef.current = setTimeout(() => {
        showModal(TriggerType.IDLE_TIME)
      }, idleTrigger.value || 30000)
    }

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart']
    events.forEach(event => {
      document.addEventListener(event, resetIdleTimer, { passive: true })
    })

    resetIdleTimer()

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetIdleTimer)
      })
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current)
      }
    }
  }, [triggers, showModal])

  // Validação de formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    if (!formData.whatsapp.trim()) {
      newErrors.whatsapp = 'WhatsApp é obrigatório'
    } else {
      const validation = validateBrazilianWhatsApp(formData.whatsapp)
      if (!validation.isValid) {
        newErrors.whatsapp = validation.errors[0] || 'WhatsApp inválido'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submissão do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const leadData: LeadData = {
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email || undefined,
        interest: formData.interest,
        source: 'lead_capture_modal',
        trigger: currentTrigger
      }

      // Track lead capture
      trackEvent('lead_captured', {
        ...leadData,
        timestamp: new Date().toISOString()
      })

      // Chamar callback se fornecido
      onCapture?.(leadData)

      // Simular envio (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Fechar modal e mostrar sucesso
      setIsModalOpen(false)
      
      // Reset form
      setFormData({
        name: '',
        whatsapp: '',
        email: '',
        interest: 'catalogo'
      })

      // Mostrar notificação de sucesso (implementar toast)
      alert('Obrigado! Em breve entraremos em contato.')

    } catch (error) {
      console.error('Erro ao capturar lead:', error)
      alert('Erro ao enviar. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false)
            }
          }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 20 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-2xl">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
              >
                ×
              </button>
              
              <h2 className="text-xl font-bold mb-2">{title}</h2>
              <p className="text-purple-100">{subtitle}</p>
              
              {offer && (
                <div className="mt-3 bg-white/20 rounded-lg p-2 text-center">
                  <span className="font-bold text-yellow-300">{offer}</span>
                </div>
              )}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Seu nome completo"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                    errors.whatsapp ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(11) 99999-9999"
                />
                {errors.whatsapp && (
                  <p className="text-red-500 text-xs mt-1">{errors.whatsapp}</p>
                )}
              </div>

              {/* Email (opcional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email (opcional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="seu@email.com"
                />
              </div>

              {/* Interesse */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Principal interesse
                </label>
                <select
                  value={formData.interest}
                  onChange={(e) => setFormData(prev => ({ ...prev, interest: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="catalogo">Ver catálogo completo</option>
                  <option value="precos">Preços especiais</option>
                  <option value="kits">Kits promocionais</option>
                  <option value="revenda">Informações sobre revenda</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              {/* Botão de envio */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 px-6 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Enviando...
                  </div>
                ) : (
                  'QUERO RECEBER A OFERTA'
                )}
              </button>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 text-center">
                Seus dados estão seguros. Não compartilhamos com terceiros.
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook para controlar o sistema de captura
export function useLeadCapture() {
  const [capturedLeads, setCapturedLeads] = useState<LeadData[]>([])

  const addLead = (lead: LeadData) => {
    setCapturedLeads(prev => [...prev, lead])
    
    // Salvar no localStorage para persistência
    const leads = JSON.parse(localStorage.getItem('captured_leads') || '[]')
    leads.push({ ...lead, captured_at: new Date().toISOString() })
    localStorage.setItem('captured_leads', JSON.stringify(leads))
  }

  const getCapturedLeads = () => {
    return JSON.parse(localStorage.getItem('captured_leads') || '[]')
  }

  const clearLeads = () => {
    setCapturedLeads([])
    localStorage.removeItem('captured_leads')
  }

  return {
    capturedLeads,
    addLead,
    getCapturedLeads,
    clearLeads
  }
}