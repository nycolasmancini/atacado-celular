'use client'

import Link from 'next/link'

export default function CatalogCTA() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-5 md:px-10 max-w-4xl text-center">
        {/* Question */}
        <p className="text-xl md:text-2xl font-inter text-gray-text mb-6">
          Prefere montar seu próprio pedido?
        </p>

        {/* CTA Button */}
        <Link
          href="/catalogo"
          className="inline-flex items-center px-10 py-4 bg-primary-blue text-white font-montserrat font-semibold text-lg rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-600 uppercase tracking-wider"
        >
          <span>Acessar Catálogo Completo</span>
          <svg
            className="ml-3 w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}