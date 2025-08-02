'use client'

import { useState, useRef, useEffect } from 'react'

export default function TestimonialsSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      id: 1,
      name: "Juliana Pereira",
      business: "",
      city: "",
      photo: "https://placehold.co/60x60/FC6D36/FFFFFF?text=JP",
      quote: "Atendimento diferenciado demais, a vendedora Laís foi super atenciosa, me auxiliou do início ao fim, tirando todas as minhas dúvidas e me dando segurança para efetuar a compra. A entrega foi super rápida, estava previsto para chegar em 10 dias e chegou em 3. Parabéns pelo atendimento e organização da equipe 🥰🫶😘",
      rating: 5
    },
    {
      id: 2,
      name: "Eduardo Xavier Alves",
      business: "",
      city: "",
      photo: "",
      quote: "Honestidade e transparência. Muito bem atendido. Por isso já fiz várias compras com eles todas pelo WhatsApp. Nunca cheguei a visitar a empresa pessoalmente. Produtos de qualidade e com preço justo. Parabéns a toda a equipe.",
      rating: 5
    },
    {
      id: 3,
      name: "Sergio Lima",
      business: "",
      city: "",
      quote: "Fui atendido pelo Jair... atendimento de rei! Tirou todas as dúvidas pacientemente e nos deu muita atenção. Somos clientes fiéis agora! Parabéns e que nunca mudem de caminho pois o ótimo atendimento é garantia de sucesso da empresa!!!",
      photo: "",
      rating: 5
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Touch/Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartX(e.touches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    e.preventDefault()
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    
    const endX = e.changedTouches[0].clientX
    const deltaX = startX - endX
    const threshold = 50 // Minimum swipe distance
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        // Swiped left - next slide
        nextSlide()
      } else {
        // Swiped right - previous slide
        prevSlide()
      }
    }
  }

  // Mouse handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartX(e.pageX)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
  }

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isDragging) return
    setIsDragging(false)
    
    const endX = e.pageX
    const deltaX = startX - endX
    const threshold = 50
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
  }

  return (
    <section className="py-16 md:py-20 relative overflow-hidden"
      style={{
        backgroundColor: '#FFFBF7'
      }}
    >
      <div className="container mx-auto mobile-padding md:px-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-32px md:text-40px font-montserrat font-semibold text-black mb-4 leading-tight">
            O Que Nossos{' '}
            <span className="text-primary-orange">Parceiros Dizem</span>
          </h2>
          <p className="text-16px md:text-18px font-inter text-gray-600 max-w-2xl mx-auto">
            Mais de 4200 lojistas confiam na PMCELL para multiplicar seus resultados
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <div className="relative overflow-hidden">
            <div 
              ref={containerRef}
              className="flex transition-transform duration-300 ease-in-out cursor-grab active:cursor-grabbing select-none"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={() => setIsDragging(false)}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`min-w-[44px] min-h-[44px] p-3 rounded-full transition-all duration-200 flex items-center justify-center ${
                  currentSlide === index 
                    ? 'bg-orange-100' 
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                aria-label={`Ir para depoimento ${index + 1}`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  currentSlide === index ? 'bg-orange-500 scale-110' : 'bg-gray-400'
                }`} />
              </button>
            ))}
          </div>

          {/* Navigation Arrows */}
          <div className="flex justify-center mt-4 space-x-4">
            <button
              onClick={prevSlide}
              className="min-w-[44px] min-h-[44px] p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
              aria-label="Depoimento anterior"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className="min-w-[44px] min-h-[44px] p-3 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center"
              aria-label="Próximo depoimento"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: { testimonial: any }) {
  const handleCardClick = () => {
    window.open('https://share.google/KoTYAtYeBkikZjIi6', '_blank')
  }

  return (
    <div 
      className="bg-white rounded-xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 relative cursor-pointer mx-2 md:mx-0 flex flex-col h-full"
      onClick={handleCardClick}
    >

      {/* Stars */}
      <div className="flex justify-center mb-3">
        {[...Array(testimonial.rating)].map((_, i) => (
          <svg
            key={i}
            className="w-5 h-5 text-yellow-400 fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
          </svg>
        ))}
      </div>

      {/* Quote */}
      <blockquote className="text-14px md:text-16px font-inter text-gray-700 text-center mb-4 md:mb-6 leading-relaxed italic flex-grow">
        "{testimonial.quote}"
      </blockquote>

      {/* Client Info */}
      <div className="flex flex-col items-center mt-auto">
        <h4 className="text-16px md:text-18px font-montserrat font-bold text-black mb-1">
          {testimonial.name}
        </h4>
        {testimonial.business && (
          <p className="text-12px md:text-14px font-inter text-primary-orange font-medium mb-1">
            {testimonial.business}
          </p>
        )}
        {testimonial.city && (
          <p className="text-12px md:text-14px font-inter text-gray-500">
            {testimonial.city}
          </p>
        )}
      </div>
    </div>
  )
}