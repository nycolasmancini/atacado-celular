'use client'

import { useState, useEffect } from 'react'

export default function ProcessSection() {
  const [isVisible, setIsVisible] = useState(false)

  const steps = [
    {
      number: 1,
      title: "Escolha seu kit ideal",
      description: "Navegue pelo nosso catálogo e escolha o kit que melhor atende sua loja",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
          <path d="M9 8V17H11V8H9ZM13 8V17H15V8H13Z"/>
        </svg>
      )
    },
    {
      number: 2,
      title: "Pague em até 12x",
      description: "Parcele sua compra em até 12x sem juros e comece a lucrar antes de pagar",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 4H4C2.89 4 2.01 4.89 2.01 6L2 18C2 19.11 2.89 20 4 20H20C21.11 20 22 19.11 22 18V6C22 4.89 21.11 4 20 4ZM20 18H4V12H20V18ZM20 8H4V6H20V8Z"/>
          <circle cx="6" cy="15" r="1"/>
          <circle cx="10" cy="15" r="1"/>
          <circle cx="14" cy="15" r="1"/>
        </svg>
      )
    },
    {
      number: 3,
      title: "Receba em 24h",
      description: "Entregamos em até 24h para São Paulo e região metropolitana",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 8H17V4H3C1.9 4 1 4.9 1 6V17H3C3 18.66 4.34 20 6 20S9 18.66 9 17H15C15 18.66 16.34 20 18 20S21 18.66 21 17H23V12L20 8ZM6 18.5C5.17 18.5 4.5 17.83 4.5 17S5.17 15.5 6 15.5 7.5 16.17 7.5 17 6.83 18.5 6 18.5ZM19.5 9.5L21.46 12H17V9.5H19.5ZM18 18.5C17.17 18.5 16.5 17.83 16.5 17S17.17 15.5 18 15.5 19.5 16.17 19.5 17 18.83 18.5 18 18.5Z"/>
        </svg>
      )
    },
    {
      number: 4,
      title: "Comece a lucrar",
      description: "Revenda com margem de até 600% e multiplique seu faturamento",
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.8 10.9C9.53 10.31 8.8 9.7 8.8 8.75C8.8 7.66 9.81 6.9 11.5 6.9C13.28 6.9 13.94 7.75 14 9H16.21C16.14 7.28 15.09 5.7 13 5.19V3H10V5.16C8.06 5.58 6.5 6.84 6.5 8.77C6.5 11.08 8.41 12.23 11.2 12.9C13.7 13.5 14.2 14.38 14.2 15.31C14.2 16 13.71 17.1 11.5 17.1C9.44 17.1 8.63 16.18 8.5 15H6.32C6.44 17.19 8.08 18.42 10 18.83V21H13V18.85C14.95 18.5 16.5 17.35 16.5 15.3C16.5 12.46 14.07 11.5 11.8 10.9Z"/>
        </svg>
      )
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.3 }
    )

    const section = document.getElementById('process-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="process-section" className="py-16 md:py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #f0f9ff 0%, #f8fafc 30%, #f0f9ff 70%, #fef2f2 100%)'
      }}
    >
      <div className="container mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-32px md:text-40px font-montserrat font-semibold text-black mb-4 leading-tight">
            Como Funciona? É{' '}
            <span className="text-primary-orange">Super Simples!</span>
          </h2>
          <p className="text-16px md:text-18px font-inter text-gray-600 max-w-2xl mx-auto">
            Em apenas 4 passos você se torna nosso parceiro e multiplica seus lucros
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden md:block max-w-6xl mx-auto">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-16 left-0 right-0 h-1 bg-gray-200 rounded-full">
              <div 
                className={`h-full bg-gradient-to-r from-primary-orange to-success rounded-full transition-all duration-2000 ease-out ${
                  isVisible ? 'w-full' : 'w-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              />
            </div>

            {/* Steps */}
            <div className="grid grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div 
                  key={step.number}
                  className={`text-center transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ transitionDelay: `${index * 200 + 300}ms` }}
                >
                  {/* Step Circle */}
                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                    {/* Background Circle */}
                    <div className={`absolute w-full h-full rounded-full transition-all duration-500 ${
                      step.number <= 2 ? 'bg-gradient-to-br from-primary-orange to-orange-600' :
                      'bg-gradient-to-br from-success to-green-600'
                    } shadow-lg`}
                    style={{ transitionDelay: `${index * 200 + 600}ms` }}
                    />
                    
                    {/* Icon Background */}
                    <div className="absolute w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <div className="text-white">
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Step Number */}
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <span className={`text-20px font-montserrat font-bold ${
                        step.number <= 2 ? 'text-primary-orange' : 'text-success'
                      }`}>
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-3">
                    <h3 className="text-20px font-montserrat font-bold text-black leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-16px font-inter text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="md:hidden max-w-md mx-auto">
          <div className="relative">
            {/* Vertical Progress Line */}
            <div className="absolute left-8 top-16 bottom-0 w-1 bg-gray-200 rounded-full">
              <div 
                className={`w-full bg-gradient-to-b from-primary-orange via-orange-500 to-success rounded-full transition-all duration-2000 ease-out ${
                  isVisible ? 'h-full' : 'h-0'
                }`}
                style={{ transitionDelay: '500ms' }}
              />
            </div>

            {/* Steps */}
            <div className="space-y-12">
              {steps.map((step, index) => (
                <div 
                  key={step.number}
                  className={`flex items-start space-x-6 transition-all duration-700 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}
                  style={{ transitionDelay: `${index * 200 + 300}ms` }}
                >
                  {/* Step Circle */}
                  <div className="relative flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                      step.number <= 2 ? 'bg-gradient-to-br from-primary-orange to-orange-600' :
                      'bg-gradient-to-br from-success to-green-600'
                    }`}
                    style={{ transitionDelay: `${index * 200 + 600}ms` }}
                    >
                      <div className="text-white">
                        {step.icon}
                      </div>
                    </div>
                    
                    {/* Step Number */}
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center">
                      <span className={`text-14px font-montserrat font-bold ${
                        step.number <= 2 ? 'text-primary-orange' : 'text-success'
                      }`}>
                        {step.number}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <h3 className="text-18px font-montserrat font-bold text-black mb-2 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-16px font-inter text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className={`text-center mt-12 md:mt-16 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '1200ms' }}>
          <button className="bg-primary-orange hover:bg-orange-600 text-white font-montserrat font-semibold text-18px px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            Começar Agora Mesmo
          </button>
        </div>
      </div>
    </section>
  )
}