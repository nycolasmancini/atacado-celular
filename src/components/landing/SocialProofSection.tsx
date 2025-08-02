'use client'

import { useEffect, useState, useRef } from 'react'

export default function SocialProofSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [animatedCount, setAnimatedCount] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  // Intersection Observer for viewport animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Animated counter for lojistas
  useEffect(() => {
    if (isVisible) {
      const target = 4200
      const duration = 2000
      const increment = target / (duration / 16)
      
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        setAnimatedCount(Math.floor(current))
      }, 16)

      return () => clearInterval(timer)
    }
  }, [isVisible])

  // Mock client logos - replace with actual client logos
  const clientLogos = [
    { name: "TechStore SP", logo: "TS" },
    { name: "Mobile Center", logo: "MC" },
    { name: "Cell Express", logo: "CE" },
    { name: "Acessórios Plus", logo: "AP" },
    { name: "Smart Shop", logo: "SS" },
    { name: "Phone Zone", logo: "PZ" },
    { name: "Digital Store", logo: "DS" },
    { name: "Mobile World", logo: "MW" }
  ]

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-20 relative overflow-hidden"
      style={{ backgroundColor: '#FFFBF7' }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Stats Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 max-w-6xl mx-auto">
            {/* Lucro Card */}
            <div className="text-center relative flex-shrink-0">
              <div className="text-[32px] sm:text-[40px] md:text-[48px] font-bold mb-1">
                <span className="text-[#FC6D36]">600%</span>
              </div>
              <p className="text-[12px] sm:text-[13px] md:text-[14px] text-[#4A4A4A] uppercase tracking-wide whitespace-nowrap">
                DE AUMENTO NO LUCRO
              </p>
            </div>

            {/* Divisor - Hidden on mobile */}
            <div className="hidden md:flex justify-center">
              <div className="w-px h-8 sm:h-10 md:h-12 bg-[#E5E5E5] self-center"></div>
            </div>

            {/* Lojistas Counter - Hidden on mobile */}
            <div className="hidden md:block text-center relative flex-shrink-0">
              <div className="text-[32px] sm:text-[40px] md:text-[48px] font-bold mb-1">
                <span className="text-[#1E3A5F]">{animatedCount}+</span>
              </div>
              <p className="text-[12px] sm:text-[13px] md:text-[14px] text-[#4A4A4A] uppercase tracking-wide whitespace-nowrap">
                LOJISTAS ATENDIDOS
              </p>
            </div>

            {/* Divisor - Hidden on mobile */}
            <div className="hidden md:flex justify-center">
              <div className="w-px h-8 sm:h-10 md:h-12 bg-[#E5E5E5] self-center"></div>
            </div>

            {/* Google Reviews */}
            <div className="text-center relative flex-shrink-0">
              <div className="flex items-center justify-center mb-1">
                <div className="text-[32px] sm:text-[40px] md:text-[48px] font-bold mr-1 sm:mr-2">
                  <span className="text-[#0A0A0A]">5.0</span>
                </div>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#FC6D36]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <p className="text-[12px] sm:text-[13px] md:text-[14px] text-[#4A4A4A] uppercase tracking-wide whitespace-nowrap">
                AVALIAÇÃO GOOGLE
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FC6D36]/5 to-[#1E3A5F]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#FC6D36]/5 to-[#0A0A0A]/5 rounded-full blur-3xl" />
    </section>
  )
}