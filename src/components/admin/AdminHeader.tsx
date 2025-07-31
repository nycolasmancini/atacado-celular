'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'

interface BreadcrumbItem {
  label: string
  href?: string
}

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split('/').filter(Boolean)
    
    if (segments.length === 1 && segments[0] === 'admin') {
      return [{ label: 'Dashboard' }]
    }

    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Dashboard', href: '/admin' }
    ]

    if (segments.length > 1) {
      const section = segments[1]
      
      switch (section) {
        case 'produtos':
          breadcrumbs.push({ label: 'Produtos' })
          break
        case 'categorias':
          breadcrumbs.push({ label: 'Categorias' })
          break
        case 'kits':
          breadcrumbs.push({ label: 'Kits' })
          if (segments.length > 2) {
            breadcrumbs.push({ label: 'Editar Kit' })
          }
          break
        case 'relatorios':
          breadcrumbs.push({ label: 'Relatórios' })
          break
        case 'configuracoes':
          breadcrumbs.push({ label: 'Configurações' })
          break
        default:
          breadcrumbs.push({ label: section.charAt(0).toUpperCase() + section.slice(1) })
      }
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  const handleLogout = () => {
    if (confirm('Tem certeza que deseja sair?')) {
      localStorage.removeItem('admin_authenticated')
      localStorage.removeItem('admin_auth_time')
      router.push('/admin/login')
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center space-x-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <div key={index} className="flex items-center">
              {index > 0 && (
                <span className="text-gray-400 mx-2">/</span>
              )}
              {item.href ? (
                <a
                  href={item.href}
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <span className="text-gray-900 font-medium">
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* User Info and Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications Badge (future) */}
          <div className="relative">
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5zm-5-13h10l-10-10-10 10h10z" />
              </svg>
              {/* Notification dot - uncomment when implementing notifications */}
              {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
            </button>
          </div>

          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                Admin
              </div>
              <div className="text-xs text-gray-500">
                admin@atacadocelular.com
              </div>
            </div>
            
            {/* User Avatar */}
            <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                A
              </span>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  )
}