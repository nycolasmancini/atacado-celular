'use client'

import { useState, useEffect } from 'react'

export default function ComparisonSection() {
  const [isVisible, setIsVisible] = useState(false)

  const comparisons = [
    {
      diferencial: "Garantia",
      pmcell: "90 dias completa",
      pmcellIcon: "✓",
      others: "30 dias limitada",
      othersIcon: "✗"
    },
    {
      diferencial: "Entrega",
      pmcell: "24h para SP",
      pmcellIcon: "✓",
      others: "5-15 dias úteis",
      othersIcon: "✗"
    },
    {
      diferencial: "Nota Fiscal",
      pmcell: "Sempre emitida",
      pmcellIcon: "✓",
      others: "Nem sempre",
      othersIcon: "✗"
    },
    {
      diferencial: "ANATEL",
      pmcell: "Certificado",
      pmcellIcon: "✓",
      others: "Sem certificação",
      othersIcon: "✗"
    },
    {
      diferencial: "Suporte",
      pmcell: "WhatsApp + Telefone",
      pmcellIcon: "✓",
      others: "Apenas WhatsApp",
      othersIcon: "✗"
    },
    {
      diferencial: "Parcelamento",
      pmcell: "Até 12x no cartão",
      pmcellIcon: "✓",
      others: "À vista ou 3x",
      othersIcon: "✗"
    },
    {
      diferencial: "Estoque",
      pmcell: "Sempre disponível",
      pmcellIcon: "✓",
      others: "Frequente falta",
      othersIcon: "✗"
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

    const section = document.getElementById('comparison-section')
    if (section) {
      observer.observe(section)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="comparison-section" className="py-16 md:py-20 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #fff7ed 0%, #ffffff 40%, #f8fafc 70%, #f0f9ff 100%)'
      }}
    >
      <div className="container mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-32px md:text-40px font-montserrat font-semibold text-black mb-4 leading-tight">
            Por Que Escolher a{' '}
            <span className="text-primary-orange">PMCELL?</span>
          </h2>
          <p className="text-16px md:text-18px font-inter text-gray-600 max-w-2xl mx-auto">
            Veja as vantagens que só a PMCELL oferece para seus parceiros
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block max-w-4xl mx-auto">
          <div className={`overflow-hidden rounded-2xl shadow-lg transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <table className="w-full">
              {/* Header */}
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                  <th className="py-4 px-6 text-left text-18px font-montserrat font-semibold text-black">
                    Diferencial
                  </th>
                  <th className="py-4 px-6 text-center text-18px font-montserrat font-semibold bg-gradient-to-br from-primary-orange to-orange-600 text-white relative">
                    <div className="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-1 rounded-full font-bold">
                      MELHOR
                    </div>
                    PMCELL
                  </th>
                  <th className="py-4 px-6 text-center text-18px font-montserrat font-semibold text-black">
                    Outros Fornecedores
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, index) => (
                  <tr 
                    key={index}
                    className={`border-b border-gray-100 transition-all duration-500 ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <td className="py-4 px-6 text-16px font-inter font-medium text-black">
                      {item.diferencial}
                    </td>
                    <td className="py-4 px-6 text-center bg-gradient-to-br from-success/5 to-success/10 border-l-4 border-success">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-success text-20px font-bold">
                          {item.pmcellIcon}
                        </span>
                        <span className="text-16px font-inter font-semibold text-success">
                          {item.pmcell}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-danger text-20px font-bold">
                          {item.othersIcon}
                        </span>
                        <span className="text-16px font-inter text-gray-500">
                          {item.others}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          {comparisons.map((item, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b">
                <h3 className="text-18px font-montserrat font-semibold text-black text-center">
                  {item.diferencial}
                </h3>
              </div>

              {/* Comparison Content */}
              <div className="p-4 space-y-4">
                {/* PMCELL */}
                <div className="bg-gradient-to-br from-success/5 to-success/10 rounded-lg p-4 border-l-4 border-success relative">
                  <div className="absolute -top-2 -right-2 bg-success text-white text-xs px-2 py-1 rounded-full font-bold">
                    MELHOR
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-14px font-montserrat font-semibold text-black">
                      PMCELL
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-success text-18px font-bold">
                        {item.pmcellIcon}
                      </span>
                      <span className="text-16px font-inter font-semibold text-success">
                        {item.pmcell}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Others */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-14px font-montserrat font-semibold text-black">
                      Outros Fornecedores
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-danger text-18px font-bold">
                        {item.othersIcon}
                      </span>
                      <span className="text-16px font-inter text-gray-500">
                        {item.others}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className={`text-center mt-12 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`} style={{ transitionDelay: '800ms' }}>
          <p className="text-16px font-inter text-gray-600 mb-6">
            Faça parte dos lojistas que escolheram a melhor opção do mercado
          </p>
          <button className="bg-primary-orange hover:bg-orange-600 text-white font-montserrat font-semibold text-18px px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl">
            Quero ver o catálogo completo
          </button>
        </div>
      </div>
    </section>
  )
}