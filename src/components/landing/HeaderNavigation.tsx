'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Input } from "@/components/ui/Input"

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
}

export default function HeaderNavigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('/images/whatsapp-avatar.svg')
  
  const router = useRouter()
  const pathname = usePathname()
  const isOnCatalogPage = pathname === '/catalogo'
  const isOnHomePage = pathname === '/'

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync with URL parameters when on catalog page
  useEffect(() => {
    if (isOnCatalogPage && mounted) {
      const updateFromURL = () => {
        const searchParams = new URLSearchParams(window.location.search);
        const categoryParam = searchParams.get('category');
        const searchParam = searchParams.get('search');
        
        setSelectedCategory(categoryParam || "all");
        setSearchQuery(searchParam || "");
      };

      // Initial sync
      updateFromURL();

      // Listen for URL changes
      const handlePopState = () => updateFromURL();
      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isOnCatalogPage, pathname, mounted])

  useEffect(() => {
    if (!mounted) return

    const handleScroll = () => {
      if (isOnHomePage) {
        // Na página inicial, só fica sticky após rolar mais, permitindo que o hero seja visto
        setIsScrolled(window.scrollY > window.innerHeight * 0.8)
      } else {
        // Em outras páginas, sempre visível com fundo sólido
        setIsScrolled(true)
      }
    }

    // Trigger initial state
    handleScroll()
    
    // Only add scroll listener for home page, other pages are always scrolled
    if (isOnHomePage) {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [isOnHomePage, mounted])

  // Force scrolled state for non-home pages
  useEffect(() => {
    if (!isOnHomePage && mounted) {
      setIsScrolled(true)
    }
  }, [isOnHomePage, pathname, mounted])

  // Fetch categories, products and site config
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes, configRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
          fetch('/api/config')
        ])

        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          const categories = Array.isArray(categoriesData) ? categoriesData : categoriesData.categories || categoriesData
          setCategories(categories)
        }

        if (productsRes.ok) {
          const productsData = await productsRes.json()
          const products = Array.isArray(productsData) ? productsData : productsData.products
          setProducts(products)
        }

        if (configRes.ok) {
          const config = await configRes.json()
          setAvatarUrl(config.avatarWhatsappUrl || '/images/whatsapp-avatar.svg')
        }
      } catch (error) {
        console.error('Error fetching data for header search:', error)
      }
    }

    fetchData()
  }, [])

  const openWhatsApp = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre os kits PMCELL', '_blank')
  }

  // Search autocomplete logic
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5)

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setShowSearchSuggestions(value.length > 0)
  }

  const handleProductSelect = (product: Product) => {
    setSearchQuery("")
    setShowSearchSuggestions(false)
    if (!isOnCatalogPage) {
      router.push(`/catalogo?search=${encodeURIComponent(product.name)}`)
    } else if (mounted) {
      // If already on catalog page, trigger search via URL params
      const url = new URL(window.location.href)
      url.searchParams.set('search', product.name)
      router.replace(url.toString())
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setShowSearchSuggestions(false)
      if (!isOnCatalogPage) {
        router.push(`/catalogo?search=${encodeURIComponent(searchQuery.trim())}`)
      } else if (mounted) {
        const url = new URL(window.location.href)
        url.searchParams.set('search', searchQuery.trim())
        router.replace(url.toString())
      }
    }
  }

  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug)
    if (!isOnCatalogPage) {
      router.push(`/catalogo${categorySlug !== 'all' ? `?category=${categorySlug}` : ''}`)
    } else if (mounted) {
      const url = new URL(window.location.href)
      if (categorySlug === 'all') {
        url.searchParams.delete('category')
      } else {
        url.searchParams.set('category', categorySlug)
      }
      router.replace(url.toString())
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null
  }

  return (
    <>
      <motion.header
        initial={{ y: isOnHomePage ? 0 : 0 }}
        animate={{ y: 0 }}
        className={`${
          isOnHomePage 
            ? (isScrolled ? 'fixed top-0 left-0 right-0' : 'hidden')
            : 'fixed top-0 left-0 right-0'
        } z-50 transition-all duration-500 ${
          !isOnHomePage
            ? 'bg-white/95 backdrop-blur-md shadow-lg' 
            : isScrolled 
              ? 'bg-white/95 backdrop-blur-md shadow-lg'
              : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/catalogo" className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-all duration-300 overflow-hidden bg-white">
                <img 
                  src={avatarUrl} 
                  alt="PMCELL Logo" 
                  className="w-10 h-10 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/whatsapp-avatar.svg'
                  }}
                />
              </div>
              <span className={`font-bold text-xl transition-colors duration-300 ${
                isScrolled || !isOnHomePage ? 'text-gray-900' : 'text-white'
              }`}>
                PMCELL
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
              {/* Search Bar */}
              <div className="relative flex-1">
                <form onSubmit={handleSearchSubmit}>
                  <Input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                    onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                    className={`pl-10 ${
                      isScrolled || !isOnHomePage
                        ? 'bg-white border-gray-300' 
                        : 'bg-white/20 backdrop-blur-sm border-white/30 text-white placeholder-white/70'
                    }`}
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className={`w-5 h-5 ${isScrolled || !isOnHomePage ? 'text-gray-400' : 'text-white/70'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </form>
                
                {/* Search Suggestions */}
                <AnimatePresence>
                  {showSearchSuggestions && filteredProducts.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                    >
                      {filteredProducts.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => handleProductSelect(product)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                        >
                          <span className="text-gray-900">{product.name}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={`px-3 py-2 rounded-lg font-medium transition-all duration-300 focus:ring-2 focus:ring-purple-500 ${
                  isScrolled || !isOnHomePage
                    ? 'bg-white border border-gray-300 text-gray-900'
                    : 'bg-white/20 backdrop-blur-sm border-white/30 text-white'
                }`}
              >
                <option value="all">Todas categorias</option>
                {categories.map(category => (
                  <option key={category.id} value={category.slug} className="text-gray-900">
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* WhatsApp Button */}
            <button
              onClick={openWhatsApp}
              className={`hidden md:flex items-center space-x-2 px-4 py-2 rounded-full font-medium transition-all duration-300 hover:scale-105 ${
                isScrolled || !isOnHomePage
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30'
              }`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.567-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
              </svg>
              <span className="hidden lg:inline">WhatsApp</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-300 ${
                isScrolled || !isOnHomePage
                  ? 'text-gray-900 hover:bg-gray-100'
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Menu"
            >
              <motion.div
                animate={isMobileMenuOpen ? { rotate: 90 } : { rotate: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </motion.div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 md:hidden"
          >
            <div className="container mx-auto px-4 py-6">
              <div className="flex flex-col space-y-4">
                {/* Mobile Search */}
                <div className="relative">
                  <form onSubmit={handleSearchSubmit}>
                    <Input
                      type="text"
                      placeholder="Buscar produtos..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onFocus={() => setShowSearchSuggestions(searchQuery.length > 0)}
                      onBlur={() => setTimeout(() => setShowSearchSuggestions(false), 200)}
                      className="pl-10 bg-white border-gray-300"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </form>
                  
                  {/* Mobile Search Suggestions */}
                  <AnimatePresence>
                    {showSearchSuggestions && filteredProducts.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                      >
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => {
                              handleProductSelect(product)
                              setIsMobileMenuOpen(false)
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors duration-200"
                          >
                            <span className="text-gray-900">{product.name}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Mobile Category Filter */}
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    handleCategoryChange(e.target.value)
                    setIsMobileMenuOpen(false)
                  }}
                  className="px-3 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="all">Todas as categorias</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.slug}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <Link
                  href="/catalogo"
                  className="text-gray-900 font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Catálogo Completo
                </Link>
                
                <button
                  onClick={() => {
                    openWhatsApp()
                    setIsMobileMenuOpen(false)
                  }}
                  className="flex items-center space-x-3 bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.567-.01-.197 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.690"/>
                  </svg>
                  <span>Falar no WhatsApp</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}