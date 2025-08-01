'use client'

import { useState, useMemo } from 'react'
import { ProductCard } from '@/components/catalog/ProductCard'
import { Button } from '@/components/ui/Button'

interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  specialPrice: number;
  specialPriceMinQty: number;
  imageUrl?: string;
  category: {
    id: number;
    name: string;
    slug: string;
  };
}

interface ProductGridProps {
  products: Product[]
  pricesUnlocked: boolean
  onRequestWhatsApp: () => void
}

const PRODUCTS_PER_PAGE = 20

export function ProductGrid({ products, pricesUnlocked, onRequestWhatsApp }: ProductGridProps) {
  const [currentPage, setCurrentPage] = useState(1)

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
    const endIndex = startIndex + PRODUCTS_PER_PAGE
    const currentProducts = products.slice(startIndex, endIndex)
    
    const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE)
    const hasNextPage = currentPage < totalPages
    const hasPrevPage = currentPage > 1

    return {
      products: currentProducts,
      totalPages,
      hasNextPage,
      hasPrevPage,
      currentPage,
      totalProducts: products.length
    }
  }, [products, currentPage])

  const loadMore = () => {
    if (paginatedData.hasNextPage) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const loadPrevious = () => {
    if (paginatedData.hasPrevPage) {
      setCurrentPage(prev => prev - 1)
    }
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of products grid
    document.getElementById('products-grid')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const { totalPages, currentPage } = paginatedData
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <>
      {/* Products Grid */}
      <div id="products-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {paginatedData.products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            pricesUnlocked={pricesUnlocked}
            onRequestWhatsApp={onRequestWhatsApp}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {paginatedData.totalPages > 1 && (
        <div className="flex flex-col items-center space-y-4">
          {/* Page Info */}
          <div className="text-sm text-gray-600">
            Mostrando {((paginatedData.currentPage - 1) * PRODUCTS_PER_PAGE) + 1} - {Math.min(paginatedData.currentPage * PRODUCTS_PER_PAGE, paginatedData.totalProducts)} de {paginatedData.totalProducts} produtos
          </div>

          {/* Pagination Buttons */}
          <div className="flex items-center space-x-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              onClick={loadPrevious}
              disabled={!paginatedData.hasPrevPage}
              className="px-3 py-2"
            >
              ← Anterior
            </Button>

            {/* Page Numbers */}
            <div className="flex space-x-1">
              {getPageNumbers().map(pageNum => (
                <Button
                  key={pageNum}
                  variant={pageNum === paginatedData.currentPage ? "default" : "outline"}
                  onClick={() => goToPage(pageNum)}
                  className="px-3 py-2 min-w-[40px]"
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            {/* Next Button */}
            <Button
              variant="outline"
              onClick={loadMore}
              disabled={!paginatedData.hasNextPage}
              className="px-3 py-2"
            >
              Próxima →
            </Button>
          </div>

          {/* Quick Jump to First/Last */}
          {paginatedData.totalPages > 5 && (
            <div className="flex space-x-2 text-sm">
              {paginatedData.currentPage > 3 && (
                <Button variant="ghost" onClick={() => goToPage(1)} className="px-2 py-1">
                  Primeira página
                </Button>
              )}
              {paginatedData.currentPage < paginatedData.totalPages - 2 && (
                <Button variant="ghost" onClick={() => goToPage(paginatedData.totalPages)} className="px-2 py-1">
                  Última página
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  )
}