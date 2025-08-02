'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function ProfitCalculator() {
  const [dailySales, setDailySales] = useState(15)
  const [monthlyProfit, setMonthlyProfit] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      setIsVisible(true)
    }
  }, [isInView])

  useEffect(() => {
    // Cálculo baseado em margem média de 300%
    // Preço médio de venda: R$ 15
    // Custo médio: R$ 5
    // Lucro por item: R$ 10
    const profitPerItem = 10
    const workingDays = 25 // dias úteis por mês
    const calculatedProfit = dailySales * profitPerItem * workingDays
    setMonthlyProfit(calculatedProfit)
  }, [dailySales])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleSliderRelease = () => {
    // Scroll to show the results section
    setTimeout(() => {
      if (resultRef.current) {
        // Scroll directly to the results section
        resultRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        })
      } else if (sectionRef.current) {
        // Fallback: scroll to bottom of calculator section
        const rect = sectionRef.current.getBoundingClientRect()
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop
        const elementTop = rect.top + scrollTop
        const elementHeight = rect.height
        const viewportHeight = window.innerHeight
        
        const targetScrollTop = elementTop + elementHeight - viewportHeight + 100
        
        window.scrollTo({
          top: Math.max(targetScrollTop, elementTop - 50),
          behavior: 'smooth'
        })
      }
    }, 150)
  }

  return (
    <section 
        ref={sectionRef}
        className="py-16 lg:py-24 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #f0fdf4 0%, #dbeafe 30%, #ede9fe 70%, #fef3c7 100%)'
        }}
      >
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-blue-200/30 rounded-full blur-2xl" />
      
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
            >
              Calcule Seu Lucro Mensal
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ delay: 0.3 }}
              className="text-lg text-gray-600"
            >
              Descubra quanto você pode faturar vendendo nossos acessórios
            </motion.p>
          </div>

          {/* Calculator Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4 }}
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
              padding: '48px'
            }}
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Calculator */}
              <div>
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-gray-900 mb-4">
                    Quantos acessórios você vende por dia?
                  </label>
                  
                  {/* Slider */}
                  <div className="relative mb-6">
                    <div className="relative">
                      <input
                        type="range"
                        min="5"
                        max="50"
                        value={dailySales}
                        onChange={(e) => setDailySales(Number(e.target.value))}
                        onMouseUp={handleSliderRelease}
                        onTouchEnd={handleSliderRelease}
                        className="w-full appearance-none cursor-pointer"
                        style={{
                          height: '8px',
                          borderRadius: '4px',
                          background: '#F0F0F0',
                          outline: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none'
                        }}
                      />
                      <div 
                        className="absolute top-0 left-0 h-2 rounded"
                        style={{
                          width: `${((dailySales - 5) / 45) * 100}%`,
                          background: '#DE472C',
                          borderRadius: '4px',
                          pointerEvents: 'none'
                        }}
                      />
                      <style jsx>{`
                        input[type="range"]::-webkit-slider-thumb {
                          appearance: none;
                          width: 20px;
                          height: 20px;
                          border-radius: 50%;
                          background: #DE472C;
                          cursor: pointer;
                          border: 2px solid white;
                          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                          position: relative;
                          z-index: 2;
                        }
                        input[type="range"]::-moz-range-thumb {
                          width: 20px;
                          height: 20px;
                          border-radius: 50%;
                          background: #DE472C;
                          cursor: pointer;
                          border: 2px solid white;
                          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
                        }
                      `}</style>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>5</span>
                      <span>25</span>
                      <span>50</span>
                    </div>
                  </div>

                  {/* Current Value Display */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full text-white font-bold text-2xl mb-3" style={{ background: '#DE472C' }}>
                      {dailySales}
                    </div>
                    <p className="text-gray-600">acessórios por dia</p>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="space-y-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span>Vendas diárias:</span>
                    <span className="font-medium">{dailySales} unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lucro por item:</span>
                    <span className="font-medium">R$ 10,00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dias úteis/mês:</span>
                    <span className="font-medium">25 dias</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold text-gray-900">
                      <span>Total mensal:</span>
                      <span>{dailySales * 25} unidades</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Result */}
              <div ref={resultRef} className="text-center">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                  <div className="mb-4">
                    <div className="text-sm font-medium text-green-600 uppercase tracking-wide mb-2">
                      Lucro Mensal Estimado
                    </div>
                    <motion.div 
                      key={monthlyProfit}
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      style={{
                        fontSize: '56px',
                        color: '#00B67A',
                        fontWeight: 700
                      }}
                      className="mb-2"
                    >
                      {formatCurrency(monthlyProfit)}
                    </motion.div>
                    <div className="text-green-700 font-medium">
                      por mês
                    </div>
                  </div>

                  {/* Annual Projection */}
                  <div className="border-t border-green-200 pt-4">
                    <div className="text-sm font-medium text-green-600 mb-1">
                      Projeção Anual
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {formatCurrency(monthlyProfit * 12)}
                    </div>
                  </div>
                </div>

                {/* Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.6 }}
                  className="mt-8"
                >
                  <button
                    onClick={() => {
                      const kitsSection = document.getElementById('kits-section')
                      if (kitsSection) {
                        kitsSection.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                    className="w-full text-white font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                    style={{ 
                      background: '#DE472C',
                      ':hover': { background: '#C63D26' }
                    }}
                  >
                    QUERO COMEÇAR A LUCRAR AGORA
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Disclaimer */}
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="text-center text-sm text-gray-500 mt-6"
          >
            *Baseado em margem média de 300% e dados de nossos lojistas parceiros
          </motion.p>
        </motion.div>
      </div>

      </section>
  )
}