'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(true)

  const scrollToKits = () => {
    const kitsSection = document.getElementById('kits-section')
    if (kitsSection) {
      kitsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <motion.section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #ec4899 100%)' }}
      animate={{ 
        background: [
          'linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #ec4899 100%)',
          'linear-gradient(135deg, #7c3aed 0%, #ec4899 50%, #f97316 100%)',
          'linear-gradient(135deg, #ec4899 0%, #f97316 50%, #9333ea 100%)',
          'linear-gradient(135deg, #9333ea 0%, #7c3aed 50%, #ec4899 100%)'
        ]
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      style={{
        background: 'linear-gradient(180deg, #9333ea 0%, #7c3aed 40%, #ec4899 70%, #FF6B35 95%, #F8F9FA 100%)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <motion.div 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-white rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.1, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 2 }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white/90 text-sm font-medium mb-6"
            >
              ⚡ Produto ANATEL | 90 dias garantia | Entrega 24h
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            >
              Aumente Seu Lucro em até{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                600%
              </span>{' '}
              com Acessórios que Vendem Sozinhos
            </motion.h1>

            {/* Sub-headline */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl"
            >
              Kits completos de acessórios para celular com produtos ANATEL, garantia de 90 dias e entrega em 24h. 
              <strong className="text-white"> Ideal para lojistas que querem lucrar mais vendendo o que todo mundo precisa.</strong>
            </motion.p>

            {/* CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <motion.button
                onClick={scrollToKits}
                className="group relative px-8 py-4 text-white font-bold text-lg rounded-full shadow-xl overflow-hidden"
                initial={{ 
                  background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                  scale: 1,
                  y: 0
                }}
                whileHover={{ 
                  background: 'linear-gradient(135deg, #ea580c 0%, #ec4899 50%, #9333ea 100%)',
                  scale: 1.05,
                  y: -4,
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <span className="relative z-10">ESCOLHER MEU KIT AGORA</span>
              </motion.button>
              
              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.6)'
                }}
                transition={{ duration: 0.2 }}
                className="inline-flex"
              >
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center px-6 py-4 text-white border-2 border-white/30 rounded-full font-medium transition-colors duration-300"
                >
                  Ver Catálogo Completo
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust Badges */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/80 text-sm"
            >
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>✓ Produtos ANATEL</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>✓ Garantia 90 dias</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>✓ Envio em até 24h*</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span>✓ Parcele em 12x no cartão</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column - Kit Mockups */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Kit Images Placeholder - Replace with actual images */}
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                <motion.div 
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="w-32 h-40 lg:w-40 lg:h-48 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center"
                >
                  <span className="text-white/60 text-sm font-medium">Kit 1</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ delay: 0.1 }}
                  className="w-32 h-40 lg:w-40 lg:h-48 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center mt-8"
                >
                  <span className="text-white/60 text-sm font-medium">Kit 2</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ delay: 0.2 }}
                  className="w-32 h-40 lg:w-40 lg:h-48 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center col-span-2 mx-auto"
                >
                  <span className="text-white/60 text-sm font-medium">Kit 3</span>
                </motion.div>
              </div>
              
              {/* Floating Elements */}
              <motion.div 
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm"
              >
                600%
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        onClick={scrollToKits}
      >
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </motion.div>
    </motion.section>
  )
}