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
      name: "Carlos Silva",
      business: "Silva Celulares",
      city: "São Paulo - SP",
      photo: "https://via.placeholder.com/60x60/FF6B35/FFFFFF?text=CS",
      quote: "Desde que comecei a trabalhar com a PMCELL, minha margem de lucro aumentou 400%. Os produtos chegam super rápido e a qualidade é excepcional. Meus clientes sempre voltam!",
      rating: 5
    },
    {
      id: 2,
      name: "Maria Santos",
      business: "Tech Store Santos",
      city: "Santos - SP",
      photo: "https://via.placeholder.com/60x60/58A55C/FFFFFF?text=MS",
      quote: "A qualidade dos produtos é impressionante! Nunca tive problemas com defeitos e a garantia de 90 dias me dá total segurança. Recomendo de olhos fechados!",
      rating: 5
    },
    {
      id: 3,
      name: "João Oliveira",  
      business: "JO Acessórios",
      city: "Campinas - SP",
      quote: "Trabalho há 3 anos com a PMCELL e posso dizer que revolucionou meu negócio. Margem de 500% em alguns produtos e entrega sempre no prazo. Parceria de sucesso!",
      photo: "https://via.placeholder.com/60x60/2E86AB/FFFFFF?text=JO",
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
        background: 'linear-gradient(180deg, #f0f9ff 0%, #dbeafe 30%, #fef3c7 70%, #fff7ed 100%)'
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
            Mais de 340 lojistas confiam na PMCELL para multiplicar seus resultados
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
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
      {/* Quote Icon */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35L8.82 5.5c-.238.06-.479.162-.725.242-.246.08-.513.17-.742.307-.23.138-.487.286-.693.462-.208.177-.397.364-.553.57-.13.186-.222.372-.274.572-.074.227-.074.457-.097.709-.097 1.844-.097 3.758 0 5.653.132.263.31.49.527.681.264.232.577.413.885.605.672.395 1.319.812 2.108 1.051.777.235 1.579.404 2.38.5.776.095 1.552.139 2.329.139.776 0 1.552-.044 2.329-.139.801-.096 1.603-.265 2.38-.5.789-.239 1.436-.656 2.108-1.051.308-.192.621-.373.885-.605.217-.191.395-.418.527-.681.097-1.895.097-3.809 0-5.653-.023-.252-.023-.482-.097-.709-.052-.2-.144-.386-.274-.572-.156-.206-.345-.393-.553-.57-.206-.176-.463-.324-.693-.462-.229-.137-.496-.227-.742-.307-.246-.08-.487-.182-.725-.242L15.18 5.5c.216.035.418.14.65.35.222.148.501.253.714.463.192.201.491.313.692.604.177.269.355.536.469.844.114.212.185.448.254.68-.213-.031-.427-.065-.65-.065z"/>
        </svg>
      </div>

      {/* Stars */}
      <div className="flex justify-center mb-4">
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
      <blockquote className="text-16px font-inter text-gray-700 text-center mb-6 leading-relaxed italic">
        "{testimonial.quote}"
      </blockquote>

      {/* Client Info */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
          <img 
            src={testimonial.photo} 
            alt={testimonial.name}
            className="w-full h-full object-cover"
          />
        </div>
        <h4 className="text-18px font-montserrat font-bold text-black mb-1">
          {testimonial.name}
        </h4>
        <p className="text-14px font-inter text-primary-orange font-medium mb-1">
          {testimonial.business}
        </p>
        <p className="text-14px font-inter text-gray-500">
          {testimonial.city}
        </p>
      </div>
    </div>
  )
}