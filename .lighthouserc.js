module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/catalogo',
        'http://localhost:3000/carrinho'
      ],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'ready on',
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --headless',
        preset: 'desktop',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        skipAudits: [
          'canonical', // Will be added later
          'robots-txt', // Will be added later
        ]
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Core Web Vitals
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-input-delay': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        
        // Performance metrics
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 5000 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Resource optimization
        'unused-css-rules': ['error', { maxNumericValue: 10000 }],
        'unused-javascript': ['error', { maxNumericValue: 20000 }],
        'render-blocking-resources': ['error', { maxNumericValue: 0 }],
        
        // Image optimization
        'modern-image-formats': 'error',
        'offscreen-images': 'error',
        'properly-sized-images': 'error',
        
        // Best practices
        'uses-text-compression': 'error',
        'uses-responsive-images': 'error',
        'efficient-animated-content': 'error'
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}