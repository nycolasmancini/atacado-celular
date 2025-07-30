"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ProductCard } from "@/components/catalog/ProductCard";
import { WhatsAppModal } from "@/components/landing/WhatsAppModal";
import { usePricesUnlocked } from "@/hooks/usePricesUnlocked";
import { useTracking } from "@/contexts/TrackingContext";

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

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function CatalogoPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { pricesUnlocked, unlockPrices } = usePricesUnlocked();
  const { trackEvent, trackCustomEvent, updateTrackingData } = useTracking();

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [productsRes, categoriesRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error('Erro ao carregar dados');
        }

        const [productsData, categoriesData] = await Promise.all([
          productsRes.json(),
          categoriesRes.json()
        ]);

        // Handle paginated response format
        const products = Array.isArray(productsData) ? productsData : productsData.products;
        const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || categoriesData;
        
        if (!Array.isArray(products)) {
          throw new Error('Formato de resposta inválido para produtos');
        }
        
        setProducts(products);
        setCategories(categories);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle search with debounce
  useEffect(() => {
    if (!searchQuery) return;

    const timer = setTimeout(() => {
      trackEvent('Search', {
        search_string: searchQuery,
        content_category: 'products'
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, trackEvent]);

  // Handle category filter
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    
    if (categorySlug !== "all") {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        trackCustomEvent('CategoryFiltered', {
          category: category.name,
          category_slug: categorySlug
        });
      }
    }
  };

  // Filter products (with safety check)
  const filteredProducts = Array.isArray(products) ? products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category?.slug === selectedCategory;
    const matchesSearch = !searchQuery || 
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  }) : [];

  const handleWhatsAppSuccess = (whatsapp: string) => {
    unlockPrices(whatsapp);
    updateTrackingData({ whatsapp });
    setModalOpen(false);
  };

  const openWhatsAppModal = () => {
    setModalOpen(true);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Erro ao carregar catálogo</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Title and Kit Button */}
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Catálogo</h1>
              <Link href="/" className="md:hidden">
                <Button variant="outline" size="sm">
                  🎁 Ver Kits Prontos
                </Button>
              </Link>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center">
              {/* Search Bar */}
              <div className="relative flex-1 md:w-80">
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                <option value="all">Todas as categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>

              {/* Kit Button - Desktop */}
              <Link href="/" className="hidden md:block">
                <Button variant="outline">
                  🎁 Ver Kits Prontos
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Results Info */}
            <div className="mb-6">
              <p className="text-gray-600">
                {filteredProducts.length} produtos encontrados
                {selectedCategory !== "all" && (
                  <span className="ml-2">
                    na categoria <strong>{categories.find(c => c.slug === selectedCategory)?.name}</strong>
                  </span>
                )}
                {searchQuery && (
                  <span className="ml-2">
                    para <strong>"{searchQuery}"</strong>
                  </span>
                )}
              </p>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    pricesUnlocked={pricesUnlocked}
                    onRequestWhatsApp={openWhatsAppModal}
                  />
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} 
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum produto encontrado
                </h3>
                <p className="text-gray-600 mb-6">
                  Tente ajustar os filtros ou termo de busca.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                    }}
                  >
                    Limpar filtros
                  </Button>
                  <Link href="/">
                    <Button>Ver Kits Prontos</Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* WhatsApp Modal */}
      <WhatsAppModal 
        isOpen={modalOpen}
        onSuccess={handleWhatsAppSuccess}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}