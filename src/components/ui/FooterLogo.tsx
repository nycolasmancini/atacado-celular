'use client'

import { useState, useEffect } from 'react'

export default function FooterLogo() {
  const [avatarUrl, setAvatarUrl] = useState('/images/whatsapp-avatar.svg')

  // Fetch site configuration
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config')
        if (response.ok) {
          const config = await response.json()
          setAvatarUrl(config.avatarWhatsappUrl || '/images/whatsapp-avatar.svg')
        }
      } catch (error) {
        console.error('Error fetching config for footer logo:', error)
      }
    }

    fetchConfig()
  }, [])

  return (
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 overflow-hidden bg-white">
        <img 
          src={avatarUrl} 
          alt="PMCELL Logo" 
          className="w-8 h-8 object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/images/whatsapp-avatar.svg'
          }}
        />
      </div>
      <span className="font-bold text-xl text-white">PMCELL</span>
    </div>
  )
}