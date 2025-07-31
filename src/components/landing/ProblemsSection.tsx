'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface Problem {
  title: string
  description: string
  icon: string
}

const problems: Problem[] = [
  {
    title: "Fornecedores caros e sem garantia",
    description: "Preços altos que sufocam sua margem de lucro e produtos sem respaldo",
    icon: "❌"
  },
  {
    title: "Produtos que não vendem",
    description: "Acessórios que ninguém quer comprar ficam encalhados no estoque",
    icon: "❌"
  },
  {
    title: "Margem de lucro baixa",
    description: "Vendas que mal cobrem os custos operacionais da sua loja",
    icon: "❌"
  },
  {
    title: "Pedidos mínimos muito altos",
    description: "Fornecedores exigindo grandes volumes que comprometem o caixa",
    icon: "❌"
  },
  {
    title: "Demora na entrega",
    description: "Fornecedores lentos que fazem você perder vendas por falta de produto",
    icon: "❌"
  },
  {
    title: "Sem nota fiscal = problemas",
    description: "Produtos sem documentação causando dores de cabeça com fiscalização",
    icon: "❌"
  }
]

export default function ProblemsSection() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" })

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #fef2f2 0%, #fef2f2 30%, #fee2e2 60%, #f0f9ff 95%, #f0f9ff 100%)'
      }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-100/50 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
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
            <span className="text-red-600">Você Está Perdendo Dinheiro</span> a Cada Cliente que Sai da Sua Loja{' '}
            <span className="text-red-600">Sem Acessório</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto"
          >
            Enquanto você luta contra esses problemas, seus concorrentes faturam até{' '}
            <strong className="text-red-600">600% de lucro</strong> vendendo os mesmos produtos
          </motion.p>
        </motion.div>

        {/* Problems Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16"
        >
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                delay: 0.8 + (index * 0.1),
                duration: 0.6
              }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="group bg-white p-3 lg:p-4 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-red-200 hover:bg-red-50/30 cursor-pointer"
            >
              {/* Icon */}
              <motion.div 
                whileHover={{ scale: 1.2, rotate: 10 }}
                className="text-3xl lg:text-4xl mb-3"
              >
                {problem.icon}
              </motion.div>

              {/* Content */}
              <h3 className="text-base lg:text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-300">
                {problem.title}
              </h3>
              <p className="text-sm lg:text-base text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                {problem.description}
              </p>

              {/* Hover indicator */}
              <motion.div 
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                className="mt-3 h-0.5 bg-gradient-to-r from-red-500 to-red-600"
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.5 }}
          className="text-center"
        >
          <div className="bg-white rounded-2xl p-8 shadow-xl border border-red-100 max-w-2xl mx-auto">
            <p className="text-xl lg:text-2xl text-gray-900 mb-4 font-semibold">
              A PMCELL resolve todos esses problemas
            </p>
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="inline-flex items-center space-x-3 text-red-600 font-bold text-lg"
            >
              <span>👇</span>
              <span>Veja a solução abaixo</span>
              <span>👇</span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}