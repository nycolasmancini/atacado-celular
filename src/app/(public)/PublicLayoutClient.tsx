'use client'

import Link from "next/link";
import { useState } from "react";
import { FloatingCartButton } from "@/components/catalog/FloatingCartButton";
import MobileMenu, { MobileMenuButton } from "@/components/ui/MobileMenu";

export default function PublicLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-md">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[64px]">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-orange-500 font-bold text-lg">A</span>
              </div>
              <span className="text-white font-semibold text-lg">
                Atacado Celular
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-white/90 hover:text-white transition-colors min-h-[44px] flex items-center text-base"
              >
                Início
              </Link>
              <Link
                href="/catalogo"
                className="text-white/90 hover:text-white transition-colors min-h-[44px] flex items-center text-base"
              >
                Catálogo
              </Link>
              <Link
                href="#kits"
                className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors min-h-[44px] flex items-center text-base"
              >
                Ver Kits
              </Link>
            </nav>

            {/* Mobile menu button */}
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Atacado Celular</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Especialistas em acessórios para celular no atacado.
                Pedido mínimo 30 peças.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link 
                    href="/catalogo" 
                    className="text-gray-400 hover:text-white transition-colors inline-block min-h-[44px] flex items-center"
                  >
                    Catálogo
                  </Link>
                </li>
                <li>
                  <Link 
                    href="#kits" 
                    className="text-gray-400 hover:text-white transition-colors inline-block min-h-[44px] flex items-center"
                  >
                    Kits Promocionais
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Contato</h3>
              <p className="text-gray-400 text-sm mb-2">
                WhatsApp: (11) 98132-6609
              </p>
              <p className="text-gray-400 text-sm">
                Email: contato@atacadocelular.com
              </p>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Atacado Celular. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Floating Cart Button */}
      <FloatingCartButton />
      
      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </div>
  );
}