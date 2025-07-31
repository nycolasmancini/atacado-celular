'use client'

import { motion, useScroll, useSpring } from 'framer-motion'

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <motion.div
        className="h-full bg-gradient-to-r from-purple-500 via-orange-500 to-pink-500 origin-left shadow-lg"
        style={{ 
          scaleX,
          boxShadow: '0 0 10px rgba(255, 107, 53, 0.5)'
        }}
      />
    </div>
  )
}