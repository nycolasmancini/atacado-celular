'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function SolutionSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })
  const [counters, setCounters] = useState({
    margin1: 0,
    margin2: 0,
    warranty: 0,
    delivery: 0
  })

  const benefits = [
    {
      title: "Margem de 100% a 600%",
      subtitle: "Compre por R$ 1, venda por R$ 3-7",
      description: "Lucros reais que multiplicam seu faturamento mensal",
      hasCounter: true,
      counterKey: 'margin1',
      icon: "📈"
    },
    {
      title: "Produtos que giram rápido",
      subtitle: "Itens validados por +340 lojistas",
      description: "Acessórios essenciais que seus clientes sempre precisam comprar",
      hasCounter: false,
      icon: "🔄"
    },
    {
      title: "Garantia real de 90 dias",
      subtitle: "Produtos ANATEL com nota fiscal",
      description: "Proteção total para você e seus clientes, sem dor de cabeça",
      hasCounter: true,
      counterKey: 'warranty',
      icon: "🛡️"
    },
    {
      title: "Envios em 24h",
      subtitle: "Estoque próprio em São Paulo",
      description: "Seu estoque nunca para, reposição super rápida e confiável",
      hasCounter: true,
      counterKey: 'delivery',
      icon: "🚚"
    },
    {
      title: "Parcelamento facilitado",
      subtitle: "Até 12x no cartão",
      description: "Compre hoje, lucre amanhã e pague depois sem comprometer o caixa",
      hasCounter: false,
      icon: "💳"
    },
    {
      title: "Suporte completo",
      subtitle: "WhatsApp + videochamada",
      description: "Atendimento humanizado com suporte técnico especializado",
      hasCounter: false,
      icon: "🎧"
    }
  ]

  useEffect(() => {
    if (isInView) {
      animateCounters()
    }
  }, [isInView])

  const animateCounters = () => {
    const duration = 2000
    const steps = 60

    const animateValue = (key: string, end: number) => {
      let current = 0
      const increment = end / steps
      const timer = setInterval(() => {
        current += increment
        if (current >= end) {
          current = end
          clearInterval(timer)
        }
        
        setCounters(prev => ({
          ...prev,
          [key]: Math.floor(current)
        }))
      }, duration / steps)
    }

    animateValue('margin1', 100)
    setTimeout(() => animateValue('margin2', 600), 200)
    setTimeout(() => animateValue('warranty', 90), 400)
    setTimeout(() => animateValue('delivery', 24), 600)
  }

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #f0f9ff 0%, #ecfdf5 40%, #f0fdf4 70%, #f0fdf4 100%)'
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-100/50 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
            className="text-3xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight"
          >
            A PMCELL Resolve Todos Esses Problemas{' '}
            <span className="text-green-600">(E Ainda Multiplica Seu Faturamento)</span>
          </motion.h2>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                delay: 0.6 + (index * 0.1),
                duration: 0.6
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group bg-white p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-green-200 hover:bg-green-50/30"
            >
              {/* Icon */}
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 5 }}
                className="text-4xl lg:text-5xl mb-4"
              >
                {benefit.icon}
              </motion.div>

              {/* Content */}
              <div>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors duration-300">
                  {benefit.hasCounter && benefit.counterKey ? (
                    <>
                      {benefit.title.includes('100%') ? (
                        <>
                          ✅ Margem de{' '}
                          <span className="text-green-800">
                            {counters.margin1}% a {counters.margin2 || 600}%
                          </span>
                        </>
                      ) : benefit.title.includes('90') ? (
                        <>
                          ✅ Garantia real de{' '}
                          <span className="text-green-800">{counters.warranty} dias</span>
                        </>
                      ) : benefit.title.includes('24') ? (
                        <>
                          ✅ Envios em{' '}
                          <span className="text-green-800">{counters.delivery}h</span>
                        </>
                      ) : (
                        `✅ ${benefit.title}`
                      )
                    }
                    </>
                  ) : (
                    `✅ ${benefit.title}`
                  )}
                </h3>
                
                <p className="text-sm font-semibold text-green-600 mb-3">
                  {benefit.subtitle}
                </p>
                
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Hover indicator */}
              <motion.div 
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="mt-4 h-0.5 bg-gradient-to-r from-green-500 to-green-600"
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom highlight */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.2 }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-100 max-w-3xl mx-auto">
            <p className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
              <span className="text-green-600">RESULTADO:</span> Nossos lojistas aumentaram o faturamento em até{' '}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">600%</span>
            </p>
            <p className="text-gray-600">
              *Dados baseados em relatórios de nossos 340+ lojistas parceiros
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}