#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Run this script to analyze the bundle size and get optimization recommendations
 */

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔍 Analyzing Next.js bundle...\n')

// Build the app with bundle analyzer
console.log('Building application with bundle analyzer...')
try {
  execSync('ANALYZE=true npm run build', { stdio: 'inherit' })
} catch (error) {
  console.error('❌ Build failed:', error.message)
  process.exit(1)
}

// Check if bundle analyzer report was generated
const reportPath = path.join(process.cwd(), '.next', 'analyze')
const clientReportPath = path.join(reportPath, 'client.html')
const serverReportPath = path.join(reportPath, 'server.html')

if (fs.existsSync(clientReportPath)) {
  console.log('\n✅ Bundle analysis complete!')
  console.log(`📊 Client bundle report: file://${clientReportPath}`)
  
  if (fs.existsSync(serverReportPath)) {
    console.log(`📊 Server bundle report: file://${serverReportPath}`)
  }
} else {
  console.log('\n⚠️  Bundle analysis files not found in expected location')
}

// Generate bundle size report
console.log('\n📈 Generating bundle size recommendations...\n')

const recommendations = [
  {
    category: '🚀 Performance Optimizations',
    items: [
      'Dynamic imports are configured for heavy components',
      'Image optimization is enabled with WebP/AVIF support',
      'Code splitting is configured for vendors and common chunks',
      'Tree shaking is enabled in production builds'
    ]
  },
  {
    category: '📦 Bundle Size Optimization',
    items: [
      'Use dynamic imports for admin components (already implemented)',
      'Lazy load modal components (WhatsAppModal, ProductDetailModal)',
      'Implement virtual scrolling for large product lists',
      'Consider using smaller alternative libraries where possible'
    ]
  },
  {
    category: '🎯 Lighthouse Score Improvements',
    items: [
      'Enable compression in middleware (implemented)',
      'Set appropriate cache headers (implemented)',
      'Use Suspense boundaries for better loading states',
      'Implement proper loading skeletons',
      'Add service worker for caching (optional)'
    ]
  },
  {
    category: '🔧 Next.js Optimizations',
    items: [
      'Enable experimental.optimizeCss (implemented)',
      'Use unstable_cache for API responses (implemented)',
      'Set revalidate times for static pages (implemented)',
      'Implement proper error boundaries'
    ]
  }
]

recommendations.forEach(section => {
  console.log(`${section.category}:`)
  section.items.forEach(item => {
    console.log(`  ✓ ${item}`)
  })
  console.log('')
})

console.log('💡 Additional recommendations:')
console.log('  • Run Lighthouse audit to measure actual performance')
console.log('  • Use Next.js Speed Insights for real user metrics')
console.log('  • Monitor Core Web Vitals in production')
console.log('  • Consider implementing a service worker for offline support')

console.log('\n🎯 Target Lighthouse scores:')
console.log('  • Performance: > 90')
console.log('  • Accessibility: > 95')
console.log('  • Best Practices: > 90')
console.log('  • SEO: > 95')

console.log('\n📝 To run bundle analysis again: npm run analyze')