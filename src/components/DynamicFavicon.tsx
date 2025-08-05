'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'

export default function DynamicFavicon() {
  const [faviconUrl, setFaviconUrl] = useState<string | null>(null)
  const [appleTouchIconUrl, setAppleTouchIconUrl] = useState<string | null>(null)

  useEffect(() => {
    const updateFavicon = async () => {
      try {
        console.log('🔄 Atualizando favicon dinâmico...')
        
        const response = await fetch('/api/config?_t=' + Date.now())
        if (!response.ok) {
          console.warn('❌ Falha ao carregar configurações para favicon')
          return
        }
        
        const config = await response.json()
        const logoUrl = config.faviconUrl || config.avatarWhatsappUrl || '/images/whatsapp-avatar.svg'
        console.log('🖼️ Favicon URL:', logoUrl)
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()
        
        img.crossOrigin = 'anonymous'
        img.onload = () => {
          if (!ctx) return
          
          console.log('✅ Imagem carregada, processando favicon...')
          
          const detectContentBounds = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
            const tempCanvas = document.createElement('canvas')
            const tempCtx = tempCanvas.getContext('2d')
            if (!tempCtx) return null
            
            tempCanvas.width = img.width
            tempCanvas.height = img.height
            tempCtx.drawImage(img, 0, 0)
            
            const imageData = tempCtx.getImageData(0, 0, img.width, img.height)
            const data = imageData.data
            
            let minX = img.width, minY = img.height, maxX = 0, maxY = 0
            let hasContent = false
            
            for (let y = 0; y < img.height; y++) {
              for (let x = 0; x < img.width; x++) {
                const i = (y * img.width + x) * 4
                const alpha = data[i + 3]
                
                if (alpha > 30) {
                  hasContent = true
                  minX = Math.min(minX, x)
                  minY = Math.min(minY, y)
                  maxX = Math.max(maxX, x)
                  maxY = Math.max(maxY, y)
                }
              }
            }
            
            return hasContent ? { minX, minY, maxX, maxY } : null
          }
          
          const createOptimizedFavicon = (size: number) => {
            canvas.width = size
            canvas.height = size
            ctx.clearRect(0, 0, size, size)
            
            const bounds = detectContentBounds(canvas, ctx)
            
            if (bounds) {
              const contentWidth = bounds.maxX - bounds.minX + 1
              const contentHeight = bounds.maxY - bounds.minY + 1
              const padding = size * 0.1
              const availableSize = size - (padding * 2)
              const scale = Math.min(availableSize / contentWidth, availableSize / contentHeight)
              
              const scaledWidth = contentWidth * scale
              const scaledHeight = contentHeight * scale
              const x = (size - scaledWidth) / 2
              const y = (size - scaledHeight) / 2
              
              ctx.drawImage(
                img,
                bounds.minX, bounds.minY, contentWidth, contentHeight,
                x, y, scaledWidth, scaledHeight
              )
            } else {
              const padding = size * 0.1
              const availableSize = size - (padding * 2)
              const x = padding
              const y = padding
              ctx.drawImage(img, x, y, availableSize, availableSize)
            }
            
            return canvas.toDataURL('image/png')
          }
          
          // Criar favicons e atualizar state
          const faviconDataUrl = createOptimizedFavicon(32)
          const appleTouchDataUrl = createOptimizedFavicon(180)
          
          console.log('🎯 Favicon 32x32 criado')
          console.log('📱 Apple Touch Icon 180x180 criado')
          
          setFaviconUrl(faviconDataUrl + '?_t=' + Date.now())
          setAppleTouchIconUrl(appleTouchDataUrl + '?_t=' + Date.now())
          
          console.log('✨ Favicon dinâmico atualizado com sucesso!')
        }
        
        img.onerror = () => {
          console.warn('❌ Não foi possível carregar a logo para o favicon:', logoUrl)
          // Usar favicon padrão
          setFaviconUrl('/favicon.ico')
        }
        
        const imageUrl = logoUrl.includes('?') 
          ? `${logoUrl}&_fb=${Date.now()}` 
          : `${logoUrl}?_fb=${Date.now()}`
        
        console.log('🔗 Carregando imagem:', imageUrl)
        img.src = imageUrl
        
      } catch (error) {
        console.error('Erro ao atualizar favicon:', error)
        setFaviconUrl('/favicon.ico')
      }
    }
    
    updateFavicon()
  }, [])
  
  // Abordagem mais segura e compatível com Next.js
  useEffect(() => {
    if (faviconUrl) {
      const updateFaviconSafely = () => {
        try {
          // Usar método mais seguro - apenas atualizar href dos existentes ou criar novos
          let faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement
          
          if (faviconLink) {
            // Atualizar favicon existente
            faviconLink.href = faviconUrl
          } else {
            // Criar novo favicon se não existir
            faviconLink = document.createElement('link')
            faviconLink.rel = 'icon'
            faviconLink.type = 'image/png'
            faviconLink.href = faviconUrl
            document.head.appendChild(faviconLink)
          }
          
          // Mesmo processo para apple-touch-icon
          if (appleTouchIconUrl) {
            let appleLink = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement
            
            if (appleLink) {
              appleLink.href = appleTouchIconUrl
            } else {
              appleLink = document.createElement('link')
              appleLink.rel = 'apple-touch-icon'
              appleLink.type = 'image/png'
              appleLink.href = appleTouchIconUrl
              document.head.appendChild(appleLink)
            }
          }
          
          console.log('✨ Favicon atualizado com sucesso!')
        } catch (error) {
          console.warn('Erro ao atualizar favicon:', error)
        }
      }
      
      // Usar setTimeout para garantir que o DOM esteja pronto
      setTimeout(updateFaviconSafely, 100)
    }
  }, [faviconUrl, appleTouchIconUrl])
  
  return null
}