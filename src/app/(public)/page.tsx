import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import LandingPageClient from '@/components/landing/LandingPageClient'

export const revalidate = 300 // 5 minutes

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'PMCELL - Atacado de Capinhas e Acessórios para Celular',
    description: 'Revenda capinhas, películas e acessórios com os melhores preços do mercado. Kits exclusivos para aumentar sua margem de lucro.',
    keywords: 'atacado capinhas, atacado celular, revenda acessórios, capinhas atacado, películas atacado',
    openGraph: {
      title: 'PMCELL - Atacado de Capinhas e Acessórios',
      description: 'Revenda capinhas, películas e acessórios com os melhores preços do mercado.',
      type: 'website',
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'PMCELL - Atacado de Capinhas e Acessórios',
      description: 'Revenda capinhas, películas e acessórios com os melhores preços do mercado.',
    },
    alternates: {
      canonical: '/',
    },
  }
}

export default function LandingPage() {
  return <LandingPageClient />
}