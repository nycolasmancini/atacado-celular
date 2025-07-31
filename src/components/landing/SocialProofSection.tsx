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
      const target = 430
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
      style={{
        background: 'linear-gradient(180deg, #F8F9FA 0%, #F8F9FA 70%, #fef2f2 95%, #fef2f2 100%)'
      }}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        {/* Stats Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Lojistas Counter */}
            <div className="text-center">
              <div className="text-[48px] md:text-[64px] font-bold text-gray-900 mb-2">
                <span className="text-[#FF6B35]">{animatedCount}+</span>
              </div>
              <p className="text-[16px] md:text-[18px] text-gray-600 font-medium">
                Lojistas atendidos mensalmente
              </p>
            </div>

            {/* Google Reviews */}
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="text-[48px] md:text-[64px] font-bold text-gray-900 mr-4">
                  <span className="text-[#FF6B35]">5</span>
                </div>
                <div>
                  {/* Stars */}
                  <div className="flex items-center justify-center mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-6 h-6 text-yellow-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">79 reviews</p>
                </div>
              </div>
              <p className="text-[16px] md:text-[18px] text-gray-600 font-medium">
                Avaliação no Google
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF6B35]/5 to-[#2E86AB]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#58A55C]/5 to-[#FF6B35]/5 rounded-full blur-3xl" />
    </section>
  )
}