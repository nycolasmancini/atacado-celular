import { Metadata } from 'next'
import KitsPageClient from '@/components/kits/KitsPageClient'

export const metadata: Metadata = {
  title: 'Kits Prontos - Atacado Celular',
  description: 'Descubra nossos kits completos com os melhores acessórios para celular com preços especiais.',
}

export default function KitsPage() {
  return <KitsPageClient />
}