import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { FloatingCartButton } from "@/components/catalog/FloatingCartButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Atacado Acessórios Celular - Kits Exclusivos para Revendedores",
  description: "Kits exclusivos de acessórios para celular no atacado. Preços de fábrica, pedido mínimo 30 peças. Produtos testados e entrega garantida em 48h.",
  keywords: "atacado acessórios celular, kits atacado, revendedor acessórios, atacado celular, acessórios por atacado",
  openGraph: {
    title: "Atacado Acessórios Celular - Kits Exclusivos",
    description: "Kits exclusivos de acessórios para celular no atacado. Preços de fábrica, pedido mínimo 30 peças.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Atacado Acessórios Celular - Kits Exclusivos",
    description: "Kits exclusivos de acessórios para celular no atacado. Preços de fábrica, pedido mínimo 30 peças.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <header className="bg-gradient-to-r from-orange-500 to-orange-600 shadow-md">
            <div className="container mx-auto px-4 md:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-orange-500 font-bold text-lg">A</span>
                  </div>
                  <span className="text-white font-semibold text-lg">
                    Atacado Celular
                  </span>
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  <Link
                    href="/"
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    Início
                  </Link>
                  <Link
                    href="/catalogo"
                    className="text-white/90 hover:text-white transition-colors"
                  >
                    Catálogo
                  </Link>
                  <Link
                    href="/kits"
                    className="bg-white text-orange-600 px-4 py-2 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
                  >
                    Ver Kits
                  </Link>
                </nav>

                {/* Mobile menu button */}
                <button className="md:hidden text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company Info */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Atacado Celular</h3>
                  <p className="text-gray-400 text-sm">
                    Especialistas em acessórios para celular no atacado.
                    Pedido mínimo 30 peças.
                  </p>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Links Rápidos</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/catalogo" className="text-gray-400 hover:text-white transition-colors">
                        Catálogo
                      </Link>
                    </li>
                    <li>
                      <Link href="/kits" className="text-gray-400 hover:text-white transition-colors">
                        Kits Promocionais
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Contato</h3>
                  <p className="text-gray-400 text-sm mb-2">
                    WhatsApp: (11) 99999-9999
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
    </div>
  );
}