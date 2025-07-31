'use client'

import { useState, useEffect } from 'react'

export default function UrgencySection() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [kitsLeft, setKitsLeft] = useState(12) // Default value to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return // Only run on client side
    
    // Get kits count from localStorage (same as banner)
    const savedKits = localStorage.getItem('pmcell-kits-left')
    const today = new Date().toDateString()
    const lastReset = localStorage.getItem('pmcell-last-reset')

    if (lastReset !== today) {
      const randomKits = Math.floor(Math.random() * 15) + 8
      setKitsLeft(randomKits)
      localStorage.setItem('pmcell-kits-left', randomKits.toString())
      localStorage.setItem('pmcell-last-reset', today)
    } else {
      setKitsLeft(parseInt(savedKits || '12'))
    }
  }, [isClient])

  useEffect(() => {
    if (!isClient) return // Only run on client side
    
    const calculateTimeLeft = () => {
      const now = new Date()
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(0, 0, 0, 0)
      
      const difference = tomorrow.getTime() - now.getTime()
      
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)
      
      return { hours, minutes, seconds }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    setTimeLeft(calculateTimeLeft())
    return () => clearInterval(timer)
  }, [isClient])

  const formatTime = (time: number) => time.toString().padStart(2, '0')

  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-red-50 via-orange-50 to-red-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-red-600 to-orange-600 rounded-full -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-orange-600 to-red-600 rounded-full translate-x-40 translate-y-40"></div>
      </div>

      <div className="container mx-auto px-5 md:px-10 relative">
        <div className="max-w-4xl mx-auto">
          {/* Main Urgency Card */}
          <div className="bg-white rounded-2xl shadow-xl border-2 border-red-200 p-6 md:p-10 text-center relative overflow-hidden">
            {/* Pulsing Border */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-orange-600 to-red-600 rounded-2xl opacity-20 animate-pulse"></div>
            
            <div className="relative z-10">
              {/* Fire Icon */}
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <span className="text-2xl">🔥</span>
              </div>

              {/* Main Headline */}
              <h2 className="text-24px md:text-32px font-montserrat font-bold text-black mb-4">
                <span className="text-red-600 animate-pulse">ATENÇÃO!</span> Oferta por Tempo Limitado
              </h2>

              {/* Urgency Messages */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Countdown */}
                <div className="bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl p-6">
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-yellow-300 mr-2 animate-pulse">⏰</span>
                    <span className="text-16px font-montserrat font-semibold">
                      Esta oferta expira em:
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-2">
                    <div className="bg-white/20 rounded-lg px-3 py-2 text-center min-w-[50px]">
                      <div className="text-20px md:text-24px font-montserrat font-bold">
                        {formatTime(timeLeft.hours)}
                      </div>
                      <div className="text-12px opacity-80">horas</div>
                    </div>
                    <span className="text-20px">:</span>
                    <div className="bg-white/20 rounded-lg px-3 py-2 text-center min-w-[50px]">
                      <div className="text-20px md:text-24px font-montserrat font-bold">
                        {formatTime(timeLeft.minutes)}
                      </div>
                      <div className="text-12px opacity-80">min</div>
                    </div>
                    <span className="text-20px">:</span>
                    <div className="bg-white/20 rounded-lg px-3 py-2 text-center min-w-[50px]">
                      <div className="text-20px md:text-24px font-montserrat font-bold animate-pulse">
                        {formatTime(timeLeft.seconds)}
                      </div>
                      <div className="text-12px opacity-80">seg</div>
                    </div>
                  </div>
                </div>

                {/* Scarcity */}
                <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-xl p-6">
                  <div className="flex items-center justify-center mb-3">
                    <span className="text-yellow-300 mr-2 animate-pulse">📦</span>
                    <span className="text-16px font-montserrat font-semibold">
                      Estoque Limitado:
                    </span>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-32px md:text-40px font-montserrat font-bold animate-pulse text-yellow-300 mb-2">
                      {kitsLeft}
                    </div>
                    <div className="text-14px opacity-90">
                      kits restantes com<br />preço promocional
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl p-6 mb-8">
                <h3 className="text-18px font-montserrat font-bold text-black mb-4">
                  🎯 Você recebe HOJE:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
                  <div className="flex items-center">
                    <span className="text-success mr-2">✅</span>
                    <span className="text-14px font-inter">Desconto de até 40% OFF</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-success mr-2">✅</span>
                    <span className="text-14px font-inter">Frete GRÁTIS para todo Brasil</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-success mr-2">✅</span>
                    <span className="text-14px font-inter">Garantia estendida 120 dias</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-success mr-2">✅</span>
                    <span className="text-14px font-inter">Kit exclusivo de brindes</span>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-montserrat font-bold text-18px px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl animate-pulse">
                  🔥 QUERO APROVEITAR AGORA
                </button>
                <button className="bg-success hover:bg-green-600 text-white font-montserrat font-semibold text-16px px-6 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.309" />
                  </svg>
                  Tirar Dúvidas no WhatsApp
                </button>
              </div>

              {/* Warning Text */}
              <p className="text-12px md:text-14px text-gray-600 mt-6 animate-pulse">
                ⚠️ Após o prazo, os preços voltam ao valor normal. Não perca esta oportunidade única!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}