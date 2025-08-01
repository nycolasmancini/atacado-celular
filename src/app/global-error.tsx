'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Global application error:', error)
  }, [error])

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
          <div className="max-w-md w-full text-center px-6">
            <div className="mb-8">
              <div className="text-6xl font-bold text-red-600 mb-4">💥</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Erro Crítico
              </h1>
              <p className="text-gray-600 mb-8">
                Ocorreu um erro crítico na aplicação. Por favor, recarregue a página ou entre em contato conosco.
              </p>
            </div>

            <div className="space-y-4">
              <button 
                onClick={reset}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Tentar Novamente
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full border border-red-300 text-red-600 hover:bg-red-50 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Recarregar Página
              </button>
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">ID do Erro:</p>
              <p className="text-xs text-gray-500 font-mono break-all">
                {error.digest || new Date().toISOString()}
              </p>
            </div>

            <div className="mt-8 text-sm text-gray-500">
              <p>Suporte técnico:</p>
              <a 
                href="https://wa.me/5511999999999?text=Erro crítico no sistema - ID: ${error.digest}" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-red-600 hover:text-red-800 font-medium"
              >
                WhatsApp: (11) 99999-9999
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}