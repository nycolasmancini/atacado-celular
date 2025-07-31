// Critical CSS for above-the-fold content
export const CRITICAL_CSS = `
  /* Reset and base styles */
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: system-ui, -apple-system, 'Inter', sans-serif;
    font-size: 16px;
    line-height: 1.5;
    color: #111827;
    background-color: #ffffff;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Layout containers */
  .container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  @media (min-width: 640px) {
    .container {
      max-width: 640px;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
    }
  }

  @media (min-width: 768px) {
    .container {
      max-width: 768px;
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  @media (min-width: 1024px) {
    .container {
      max-width: 1024px;
      padding-left: 2.5rem;
      padding-right: 2.5rem;
    }
  }

  @media (min-width: 1280px) {
    .container {
      max-width: 1280px;
    }
  }

  /* Hero section critical styles */
  .hero-section {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
  }

  .hero-grid {
    display: grid;
    gap: 3rem;
    align-items: center;
  }

  @media (min-width: 1024px) {
    .hero-grid {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* Typography critical styles */
  .hero-title {
    font-size: 2.5rem;
    line-height: 1.1;
    font-weight: 700;
    color: #111827;
    margin-bottom: 1.5rem;
  }

  @media (min-width: 768px) {
    .hero-title {
      font-size: 3.5rem;
    }
  }

  .hero-subtitle {
    font-size: 1.125rem;
    line-height: 1.6;
    color: #6b7280;
    margin-bottom: 2rem;
  }

  @media (min-width: 768px) {
    .hero-subtitle {
      font-size: 1.25rem;
    }
  }

  /* Button critical styles */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #ff6b35 0%, #e55a2b 100%);
    color: white;
    font-weight: 600;
    font-size: 1.125rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    text-decoration: none;
    border: none;
    cursor: pointer;
    min-height: 44px;
  }

  .btn-primary:hover {
    background: linear-gradient(135deg, #e55a2b 0%, #cc4f24 100%);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    transform: translateY(-1px);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    border: 2px solid #2e86ab;
    color: #2e86ab;
    font-weight: 600;
    font-size: 1.125rem;
    border-radius: 0.5rem;
    transition: all 0.3s ease;
    text-decoration: none;
    background: transparent;
    cursor: pointer;
    min-height: 44px;
  }

  .btn-secondary:hover {
    background-color: #2e86ab;
    color: white;
    transform: translateY(-1px);
  }

  /* Loading states */
  .loading-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading-shimmer 1.5s infinite;
  }

  @keyframes loading-shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* Image optimization */
  img {
    max-width: 100%;
    height: auto;
  }

  /* Prevent layout shift */
  img[src*="placeholder"] {
    background-color: #f3f4f6;
    color: transparent;
  }

  /* Focus styles for accessibility */
  *:focus-visible {
    outline: 2px solid #ff6b35;
    outline-offset: 2px;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Header critical styles */
  .header {
    background: linear-gradient(135deg, #ff6b35 0%, #ff7a47 100%);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 4rem;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.125rem;
  }

  .nav-link {
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    transition: color 0.3s ease;
    min-height: 44px;
    display: flex;
    align-items: center;
    font-size: 1rem;
  }

  .nav-link:hover {
    color: white;
  }

  /* Mobile menu button */
  .mobile-menu-btn {
    display: block;
    color: white;
    min-height: 44px;
    min-width: 44px;
    border: none;
    background: none;
    cursor: pointer;
  }

  @media (min-width: 768px) {
    .mobile-menu-btn {
      display: none;
    }
  }

  /* Grid utilities */
  .grid {
    display: grid;
  }

  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }

  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: 768px) {
    .md\\:grid-cols-4 {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }

  .gap-3 {
    gap: 0.75rem;
  }

  .gap-4 {
    gap: 1rem;
  }

  /* Flex utilities */
  .flex {
    display: flex;
  }

  .items-center {
    align-items: center;
  }

  .justify-center {
    justify-content: center;
  }

  .space-x-2 > * + * {
    margin-left: 0.5rem;
  }

  .space-x-4 > * + * {
    margin-left: 1rem;
  }

  /* Spacing utilities */
  .mb-4 {
    margin-bottom: 1rem;
  }

  .mb-6 {
    margin-bottom: 1.5rem;
  }

  .mb-8 {
    margin-bottom: 2rem;
  }

  .mb-10 {
    margin-bottom: 2.5rem;
  }

  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  /* Text utilities */
  .text-center {
    text-align: center;
  }

  .text-white {
    color: white;
  }

  .text-gray-600 {
    color: #6b7280;
  }

  .text-gray-700 {
    color: #374151;
  }

  .font-semibold {
    font-weight: 600;
  }

  .font-bold {
    font-weight: 700;
  }

  /* Color utilities */
  .text-orange-500 {
    color: #ff6b35;
  }

  .text-blue-600 {
    color: #2e86ab;
  }

  .text-green-600 {
    color: #58a55c;
  }

  .bg-white {
    background-color: white;
  }

  .bg-gray-50 {
    background-color: #f9fafb;
  }

  /* Border utilities */
  .rounded-lg {
    border-radius: 0.5rem;
  }

  .rounded-full {
    border-radius: 9999px;
  }

  /* Shadow utilities */
  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }

  /* Responsive utilities */
  .hidden {
    display: none;
  }

  @media (min-width: 768px) {
    .md\\:flex {
      display: flex;
    }
    
    .md\\:hidden {
      display: none;
    }
  }
`

// Function to inject critical CSS
export function injectCriticalCSS() {
  if (typeof document !== 'undefined') {
    const style = document.createElement('style')
    style.innerHTML = CRITICAL_CSS
    style.setAttribute('data-critical', 'true')
    document.head.insertBefore(style, document.head.firstChild)
  }
}