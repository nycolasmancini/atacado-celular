import { Suspense } from 'react'
import { Metadata } from 'next'
import CatalogoPageClient from '@/components/catalog/CatalogoPageClient'
import { CatalogoSkeleton } from '@/components/catalog/CatalogoSkeleton'

export const revalidate = 300 // 5 minutes

type SearchParams = {
  category?: string
  search?: string
  page?: string
}

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const params = await searchParams
  const category = params.category
  const search = params.search
  
  let title = 'Catálogo de Produtos - PMCELL Atacado'
  let description = 'Encontre capinhas, películas e acessórios para celular com os melhores preços do atacado.'
  
  if (category) {
    title = `${category} - Catálogo PMCELL Atacado`
    description = `Produtos da categoria ${category} com preços especiais para revenda.`
  }
  
  if (search) {
    title = `Busca: ${search} - Catálogo PMCELL`
    description = `Resultados da busca por "${search}" no catálogo de produtos para atacado.`
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function CatalogoPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams
  
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <Suspense fallback={<CatalogoSkeleton />}>
        <CatalogoPageClient searchParams={params} />
      </Suspense>
    </div>
  )
}