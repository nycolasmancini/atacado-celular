'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
      <div className="max-w-md w-full text-center px-6">
        <div className="mb-8">
          <div className="text-6xl font-bold text-red-600 mb-4">⚠️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Algo deu errado
          </h1>
          <p className="text-gray-600 mb-8">
            Ocorreu um erro inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={reset}
            size="lg" 
            className="w-full bg-red-600 hover:bg-red-700"
          >
            Tentar Novamente
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            className="w-full border-red-300 text-red-600 hover:bg-red-50"
            onClick={() => window.location.href = '/'}
          >
            Voltar ao Início
          </Button>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">Detalhes técnicos:</p>
          <p className="text-xs text-gray-500 font-mono break-all">
            {error.digest || error.name}: {error.message}
          </p>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Precisa de ajuda urgente?</p>
          <a 
            href="https://wa.me/5511981326609?text=Oi, vim pelo site e estou com dúvidas" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Entre em contato pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}