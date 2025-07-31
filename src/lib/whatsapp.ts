import { trackEvent } from './tracking'

// Configurações do WhatsApp
const WHATSAPP_CONFIG = {
  businessNumber: '5511981326609', // Número principal do WhatsApp
  baseUrl: 'https://wa.me',
  webUrl: 'https://web.whatsapp.com/send',
  apiUrl: 'https://api.whatsapp.com/send'
}

// Tipos de mensagens disponíveis
export enum MessageType {
  INITIAL_INTEREST = 'initial_interest',
  PRICE_REQUEST = 'price_request',
  KIT_INTEREST = 'kit_interest',
  CATALOG_ACCESS = 'catalog_access',
  ORDER_INQUIRY = 'order_inquiry',
  SUPPORT = 'support',
  FOLLOW_UP = 'follow_up'
}

// Interface para dados de contexto
interface MessageContext {
  userName?: string
  kitName?: string
  productName?: string
  quantity?: number
  totalValue?: number
  source?: string
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
}

// Mensagens personalizadas baseadas no contexto
const MessageTemplates = {
  [MessageType.INITIAL_INTEREST]: (ctx: MessageContext) => {
    const base = `🔥 *Olá! Vim pelo site e tenho interesse nos acessórios para revenda!*

📱 Quero saber mais sobre:
• Preços especiais para atacado
• Kits disponíveis  
• Formas de pagamento
• Prazo de entrega

${ctx.utm_source ? `\n📊 _Fonte: ${ctx.utm_source}_` : ''}`

    return base.trim()
  },

  [MessageType.PRICE_REQUEST]: (ctx: MessageContext) => {
    const base = `💰 *Oi! Quero liberar os preços especiais!*

🎯 Informações:
${ctx.userName ? `• Nome: ${ctx.userName}` : ''}
• Interesse: Preços atacado
• Objetivo: Revenda de acessórios

📱 Quando posso receber o catálogo completo com preços?

${ctx.source ? `\n📍 _Via: ${ctx.source}_` : ''}`

    return base.trim()
  },

  [MessageType.KIT_INTEREST]: (ctx: MessageContext) => {
    const base = `🎁 *Interesse no ${ctx.kitName || 'kit de acessórios'}!*

✨ Vi no site e quero saber mais sobre:
• Preço especial do kit
• O que está incluído
• Desconto para quantidade
• Forma de pagamento

💼 Tenho interesse em revender, qual o valor atacado?

${ctx.source ? `\n🌐 _Origem: ${ctx.source}_` : ''}`

    return base.trim()
  },

  [MessageType.CATALOG_ACCESS]: (ctx: MessageContext) => {
    const base = `📱 *Olá! Preciso acessar o catálogo completo!*

🛍️ Quero ver:
• Todos os produtos disponíveis
• Preços especiais atacado
• Quantidades mínimas
• Condições de pagamento

💳 Já tenho WhatsApp validado, como acesso o catálogo?

${ctx.utm_campaign ? `\n🎯 _Campanha: ${ctx.utm_campaign}_` : ''}`

    return base.trim()
  },

  [MessageType.ORDER_INQUIRY]: (ctx: MessageContext) => {
    let base = `🛒 *Quero fazer um pedido!*

📦 Detalhes:`

    if (ctx.productName) {
      base += `\n• Produto: ${ctx.productName}`
    }
    if (ctx.quantity) {
      base += `\n• Quantidade: ${ctx.quantity} unidades`
    }
    if (ctx.totalValue) {
      base += `\n• Valor estimado: R$ ${ctx.totalValue.toFixed(2).replace('.', ',')}`
    }

    base += `

💰 Preciso confirmar:
• Preço final
• Prazo de entrega  
• Forma de pagamento
• Frete para minha região

📍 Como proceder com o pedido?`

    return base.trim()
  },

  [MessageType.SUPPORT]: (ctx: MessageContext) => {
    const base = `🆘 *Preciso de ajuda!*

❓ Tenho dúvidas sobre:
• Como funciona o atacado
• Pedido mínimo
• Formas de pagamento
• Prazo de entrega

📞 Podem me ajudar?

${ctx.source ? `\n📱 _Via: ${ctx.source}_` : ''}`

    return base.trim()
  },

  [MessageType.FOLLOW_UP]: (ctx: MessageContext) => {
    const base = `📞 *Retomando o contato!*

💭 Estava interessado nos acessórios para revenda e gostaria de:
• Atualizar preços
• Ver novos produtos
• Fazer um pedido
• Esclarecer dúvidas

🕐 Qual o melhor horário para conversarmos?

${ctx.source ? `\n🔄 _Follow-up via: ${ctx.source}_` : ''}`

    return base.trim()
  }
}

// Detectar dispositivo para escolher a melhor URL
export function getWhatsAppUrl(phoneNumber: string, message: string): string {
  const encodedMessage = encodeURIComponent(message)
  const cleanPhone = phoneNumber.replace(/\D/g, '')
  
  // Verificar se é mobile
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
  if (isMobile) {
    // Para mobile, usar wa.me que abre o app diretamente
    return `${WHATSAPP_CONFIG.baseUrl}/${cleanPhone}?text=${encodedMessage}`
  } else {
    // Para desktop, usar web.whatsapp.com
    return `${WHATSAPP_CONFIG.webUrl}?phone=${cleanPhone}&text=${encodedMessage}`
  }
}

// Função principal para gerar links do WhatsApp
export function generateWhatsAppLink(
  messageType: MessageType,
  context: MessageContext = {},
  phoneNumber: string = WHATSAPP_CONFIG.businessNumber
): string {
  // Adicionar dados de UTM se disponíveis
  const urlParams = new URLSearchParams(window.location.search)
  const enhancedContext = {
    ...context,
    utm_source: urlParams.get('utm_source') || context.utm_source,
    utm_medium: urlParams.get('utm_medium') || context.utm_medium,
    utm_campaign: urlParams.get('utm_campaign') || context.utm_campaign,
    source: context.source || document.referrer ? new URL(document.referrer).hostname : 'direto'
  }

  // Gerar mensagem personalizada
  const message = MessageTemplates[messageType](enhancedContext)
  
  // Track evento de geração de link
  trackEvent('whatsapp_link_generated', {
    message_type: messageType,
    context: enhancedContext,
    message_length: message.length,
    timestamp: new Date().toISOString()
  })

  return getWhatsAppUrl(phoneNumber, message)
}

// Abrir WhatsApp com tracking
export function openWhatsApp(
  messageType: MessageType,
  context: MessageContext = {},
  trackingData?: Record<string, any>
) {
  const url = generateWhatsAppLink(messageType, context)
  
  // Track evento de abertura
  trackEvent('whatsapp_opened', {
    message_type: messageType,
    context,
    url,
    ...trackingData,
    timestamp: new Date().toISOString()
  })

  // Abrir em nova aba/janela
  window.open(url, '_blank', 'noopener,noreferrer')
}

// Validar número de WhatsApp brasileiro
export function validateBrazilianWhatsApp(phone: string): {
  isValid: boolean
  formatted: string
  errors: string[]
} {
  const errors: string[] = []
  let formatted = phone.replace(/\D/g, '')

  // Verificar se tem o código do país
  if (formatted.length === 11 && formatted.startsWith('11')) {
    formatted = '55' + formatted
  } else if (formatted.length === 10) {
    formatted = '5511' + formatted
  } else if (formatted.length === 13 && formatted.startsWith('55')) {
    // Já está no formato correto
  } else {
    errors.push('Formato inválido. Use: (11) 99999-9999')
  }

  // Verificar padrões brasileiros
  if (formatted.length === 13) {
    const ddd = formatted.substring(2, 4)
    const firstDigit = formatted.substring(4, 5)

    // Verificar DDD válido (código de área)
    const validDDDs = [
      '11', '12', '13', '14', '15', '16', '17', '18', '19', // SP
      '21', '22', '24', // RJ
      '27', '28', // ES
      '31', '32', '33', '34', '35', '37', '38', // MG
      '41', '42', '43', '44', '45', '46', // PR
      '47', '48', '49', // SC
      '51', '53', '54', '55', // RS
      '61', // DF
      '62', '64', // GO
      '63', // TO
      '65', '66', // MT
      '67', // MS
      '68', // AC
      '69', // RO
      '71', '73', '74', '75', '77', // BA
      '79', // SE
      '81', '87', // PE
      '82', // AL
      '83', // PB
      '84', // RN
      '85', '88', // CE
      '86', '89', // PI
      '91', '93', '94', // PA
      '92', '97', // AM
      '95', // RR
      '96', // AP
      '98', '99', // MA
    ]

    if (!validDDDs.includes(ddd)) {
      errors.push('DDD inválido')
    }

    // Verificar se é celular (9 como primeiro dígito após DDD)
    if (firstDigit !== '9') {
      errors.push('Deve ser um número de celular (começar com 9)')
    }
  }

  // Formatação para exibição
  let displayFormatted = formatted
  if (formatted.length === 13) {
    const country = formatted.substring(0, 2)
    const area = formatted.substring(2, 4)
    const firstPart = formatted.substring(4, 9)
    const secondPart = formatted.substring(9, 13)
    displayFormatted = `+${country} (${area}) ${firstPart}-${secondPart}`
  }

  return {
    isValid: errors.length === 0,
    formatted: displayFormatted,
    errors
  }
}

// Hook para gerenciar estado do WhatsApp
export function useWhatsAppIntegration() {
  const sendMessage = (
    messageType: MessageType,
    context: MessageContext = {},
    trackingData?: Record<string, any>
  ) => {
    openWhatsApp(messageType, context, trackingData)
  }

  const generateLink = (
    messageType: MessageType,
    context: MessageContext = {}
  ) => {
    return generateWhatsAppLink(messageType, context)
  }

  const validatePhone = (phone: string) => {
    return validateBrazilianWhatsApp(phone)
  }

  return {
    sendMessage,
    generateLink,
    validatePhone
  }
}

// Utilitários para horário comercial
export function isBusinessHours(): boolean {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay() // 0 = domingo, 6 = sábado

  // Segunda a sexta: 8h às 18h
  // Sábado: 9h às 15h
  // Domingo: fechado

  if (day === 0) return false // Domingo fechado

  if (day >= 1 && day <= 5) {
    return hour >= 8 && hour < 18
  }

  if (day === 6) {
    return hour >= 9 && hour < 15
  }

  return false
}

export function getNextBusinessHour(): string {
  const now = new Date()
  const day = now.getDay()
  const hour = now.getHours()

  if (day === 0) { // Domingo
    return 'segunda-feira às 8h'
  }

  if (day === 6) { // Sábado
    if (hour >= 15) {
      return 'segunda-feira às 8h'
    }
    if (hour < 9) {
      return 'hoje às 9h'
    }
  }

  if (day >= 1 && day <= 5) { // Segunda a sexta
    if (hour >= 18) {
      if (day === 5) { // Sexta após 18h
        return 'segunda-feira às 8h'
      } else {
        return 'amanhã às 8h'
      }
    }
    if (hour < 8) {
      return 'hoje às 8h'
    }
  }

  return 'agora'
}