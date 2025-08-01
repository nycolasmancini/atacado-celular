import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full text-center px-6">
        <div className="mb-8">
          <div className="text-6xl font-bold text-indigo-600 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Página não encontrada
          </h1>
          <p className="text-gray-600 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/">
            <Button 
              size="lg" 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              Voltar ao Início
            </Button>
          </Link>
          
          <Link href="/catalogo">
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full border-indigo-300 text-indigo-600 hover:bg-indigo-50"
            >
              Ver Catálogo
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Precisa de ajuda?</p>
          <a 
            href="https://wa.me/5511981326609?text=Oi, vim pelo site e estou com dúvidas" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Entre em contato pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}