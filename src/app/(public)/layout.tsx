import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { FloatingCartButton } from "@/components/catalog/FloatingCartButton";
import HeaderNavigation from "@/components/landing/HeaderNavigation";
import ScrollProgressBar from "@/components/ui/ScrollProgressBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PMCELL - Aumente Seu Lucro em até 600% com Acessórios que Vendem Sozinhos",
  description: "Kits completos de acessórios para celular com produtos ANATEL, garantia de 90 dias e entrega em 24h. Ideal para lojistas que querem lucrar mais vendendo o que todo mundo precisa.",
  keywords: "pmcell, atacado acessórios celular, kits atacado, revendedor acessórios, atacado celular, acessórios por atacado, produtos ANATEL",
  openGraph: {
    title: "PMCELL - Aumente Seu Lucro em até 600%",
    description: "Kits completos de acessórios para celular com produtos ANATEL, garantia de 90 dias e entrega em 24h.",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "PMCELL - Aumente Seu Lucro em até 600%",
    description: "Kits completos de acessórios para celular com produtos ANATEL, garantia de 90 dias e entrega em 24h.",
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
          {/* Scroll Progress Bar */}
          <ScrollProgressBar />
          
          {/* Header Navigation */}
          <HeaderNavigation />

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 md:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Company Info */}
                <div>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center font-bold text-xl text-white">
                      P
                    </div>
                    <span className="font-bold text-xl">PMCELL</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Especialistas em acessórios para celular no atacado.
                    Produtos ANATEL com garantia de 90 dias.
                  </p>
                  <p className="text-sm text-gray-500">
                    CNPJ: 00.000.000/0001-00<br />
                    Rua Exemplo, 123 - São Paulo, SP
                  </p>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Contato</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.567-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
                      </svg>
                      <div>
                        <p className="font-medium">(11) 99999-9999</p>
                        <p className="text-sm text-gray-400">Segunda a Sexta, 8h às 18h</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <span>contato@pmcell.com</span>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Links Úteis</h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href="/catalogo" className="text-gray-400 hover:text-white transition-colors">
                        Catálogo Completo
                      </Link>
                    </li>
                    <li>
                      <Link href="/politica-privacidade" className="text-gray-400 hover:text-white transition-colors">
                        Política de Privacidade
                      </Link>
                    </li>
                    <li>
                      <Link href="/termos-uso" className="text-gray-400 hover:text-white transition-colors">
                        Termos de Uso
                      </Link>
                    </li>
                    <li>
                      <Link href="/trocas-devolucoes" className="text-gray-400 hover:text-white transition-colors">
                        Trocas e Devoluções
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="border-t border-gray-800 mt-8 pt-8 text-center">
                <p className="text-gray-400 text-sm">
                  © 2024 PMCELL. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </footer>
          
          {/* Floating Cart Button */}
          <FloatingCartButton />
    </div>
  );
}