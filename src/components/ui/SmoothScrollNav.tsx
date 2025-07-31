'use client'

import { useSmoothScroll } from '@/hooks/useSmoothScroll'

interface SmoothScrollNavProps {
  className?: string
}

export function SmoothScrollNav({ className = '' }: SmoothScrollNavProps) {
  const { scrollToElement } = useSmoothScroll({ offset: 100 })

  const navItems = [
    { label: 'Início', target: 'hero-section' },
    { label: 'Problemas', target: 'problems-section' },
    { label: 'Soluções', target: 'benefits-section' },
    { label: 'Produtos', target: 'kits-section' },
    { label: 'Depoimentos', target: 'testimonials-section' },
    { label: 'Comparação', target: 'comparison-section' },
    { label: 'Como Funciona', target: 'process-section' },
    { label: 'FAQ', target: 'faq-section' }
  ]

  const handleNavClick = (target: string) => {
    scrollToElement(target)
  }

  return (
    <nav className={`${className}`}>
      <ul className="flex flex-wrap gap-4">
        {navItems.map((item) => (
          <li key={item.target}>
            <button
              onClick={() => handleNavClick(item.target)}
              className="link-animated text-16px font-inter hover:text-primary-orange transition-colors duration-300 py-2 px-3 rounded-lg hover:bg-orange-50 focus-ring"
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// Quick navigation floating button
export function FloatingNav() {
  const { scrollToTop } = useSmoothScroll()

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-2">
      {/* Scroll to top button */}
      <button
        onClick={() => scrollToTop()}
        className="w-12 h-12 bg-primary-orange hover:bg-orange-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus-ring flex items-center justify-center"
        aria-label="Voltar ao topo"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  )
}