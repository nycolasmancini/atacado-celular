export interface WhatsAppStat {
  sessionId: string
  phoneNumber: string | null
  createdAt: Date
  userAgent: string | null
  ipAddress: string | null
}

export interface OrderStat {
  id: string
  phoneNumber: string
  totalAmount: number
  itemCount: number
  createdAt: Date
  metadata: any
}

export interface ReportSummary {
  totalWhatsApps: number
  totalOrders: number
  conversionRate: number
  averageTicket: number
}

export async function getWhatsAppStats(startDate: Date, endDate: Date): Promise<WhatsAppStat[]> {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  })

  const response = await fetch(`/api/admin/reports/whatsapp?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch WhatsApp stats')
  }

  const data = await response.json()
  // Convert createdAt strings back to Date objects
  return data.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt)
  }))
}

export async function getOrderStats(startDate: Date, endDate: Date): Promise<OrderStat[]> {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  })

  const response = await fetch(`/api/admin/reports/orders?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch order stats')
  }

  const data = await response.json()
  // Convert createdAt strings back to Date objects
  return data.map((item: any) => ({
    ...item,
    createdAt: new Date(item.createdAt)
  }))
}

export async function getReportSummary(startDate: Date, endDate: Date): Promise<ReportSummary> {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString()
  })

  const response = await fetch(`/api/admin/reports/summary?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch report summary')
  }

  return await response.json()
}

export function exportToCSV(data: any[], filename: string): void {
  if (data.length === 0) {
    alert('Não há dados para exportar')
    return
  }

  // Get headers from first object
  const headers = Object.keys(data[0])
  
  // Create CSV content
  const csvContent = [
    headers.join(','), // Header row
    ...data.map(row => 
      headers.map(header => {
        const value = row[header]
        // Handle dates, objects, and strings with commas
        if (value instanceof Date) {
          return `"${value.toLocaleString('pt-BR')}"`
        } else if (typeof value === 'object' && value !== null) {
          return `"${JSON.stringify(value)}"`
        } else if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value || ''
      }).join(',')
    )
  ].join('\n')

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

export function formatPhoneNumber(phone: string | null): string {
  if (!phone) return 'N/A'
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '')
  
  // Format as (XX) XXXXX-XXXX
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  } else if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  
  return phone
}