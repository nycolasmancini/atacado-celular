'use client'

import { useState, useEffect } from 'react'

interface Notification {
  id: number
  name: string
  city: string
  product: string
  timeAgo: string
}

export default function PurchaseNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Mock data for notifications
  const mockNotifications: Omit<Notification, 'id'>[] = [
    { name: 'João Silva', city: 'São Paulo', product: 'Kit Completo Premium', timeAgo: 'há 2 minutos' },
    { name: 'Maria Santos', city: 'Rio de Janeiro', product: 'Kit Starter Plus', timeAgo: 'há 5 minutos' },
    { name: 'Carlos Oliveira', city: 'Belo Horizonte', product: 'Kit Professional', timeAgo: 'há 7 minutos' },
    { name: 'Ana Costa', city: 'Brasília', product: 'Kit Mega Lucro', timeAgo: 'há 12 minutos' },
    { name: 'Pedro Almeida', city: 'Salvador', product: 'Kit Premium Plus', timeAgo: 'há 15 minutos' },
    { name: 'Fernanda Lima', city: 'Fortaleza', product: 'Kit Completo Pro', timeAgo: 'há 18 minutos' },
    { name: 'Roberto Silva', city: 'Recife', product: 'Kit Atacado Max', timeAgo: 'há 22 minutos' },
  ]

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return // Only run on client side
    
    // Initialize notifications with IDs
    const initialNotifications = mockNotifications.map((notif, index) => ({
      ...notif,
      id: index + 1
    }))
    setNotifications(initialNotifications)
  }, [isClient])

  useEffect(() => {
    if (notifications.length === 0 || !isClient) return // Only run on client side

    const showRandomNotification = () => {
      const randomIndex = Math.floor(Math.random() * notifications.length)
      const notification = notifications[randomIndex]
      setCurrentNotification(notification)
      setIsVisible(true)

      // Hide after 4 seconds
      setTimeout(() => {
        setIsVisible(false)
        setTimeout(() => {
          setCurrentNotification(null)
        }, 300) // Wait for fade out animation
      }, 4000)
    }

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(showRandomNotification, 3000)

    // Then show random notifications every 8-15 seconds
    const interval = setInterval(() => {
      if (!isVisible) { // Only show if no notification is currently visible
        showRandomNotification()
      }
    }, Math.random() * 7000 + 8000) // Random between 8-15 seconds

    return () => {
      clearTimeout(initialTimeout)
      clearInterval(interval)
    }
  }, [notifications, isVisible, isClient])

  if (!currentNotification) return null

  return (
    <div className={`fixed bottom-24 left-4 md:left-6 z-40 transition-all duration-300 transform ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
    }`}>
      <div 
        className="notification rounded-lg p-4 shadow-lg max-w-sm flex items-center space-x-3 border-l-4"
        style={{ 
          background: 'var(--preto-suave)',
          borderLeftColor: 'var(--amarelo-destaque)',
          color: 'var(--branco)'
        }}
      >
        {/* Avatar */}
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
          style={{ background: 'var(--verde-confianca)' }}
        >
          {currentNotification.name.charAt(0)}
        </div>
        
        {/* Content */}
        <div className="flex-1 text-sm">
          <div className="font-semibold">
            {currentNotification.name}
          </div>
          <div style={{ color: 'var(--amarelo-destaque)' }}>
            {currentNotification.city}
          </div>
          <div className="text-xs opacity-80">
            Comprou: {currentNotification.product}
          </div>
          <div className="text-xs opacity-60">
            {currentNotification.timeAgo}
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}