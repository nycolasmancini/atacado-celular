import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TrackingProvider } from "@/components/providers/TrackingProvider";
import { CartProvider } from "@/contexts/CartContext";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { ABTestingProvider } from "@/contexts/ABTestingContext";
import { Toaster } from "react-hot-toast";
import WebVitalsReporter from "@/components/optimization/WebVitalsReporter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

// SEO Optimized Metadata
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://atacado-celular.com'),
  
  title: {
    default: "Atacado Celular - Acessórios no Atacado | Melhores Preços",
    template: "%s | Atacado Celular"
  },
  
  description: "Acessórios para celular no atacado com os melhores preços do Brasil. Kits prontos, catálogo completo e condições especiais para revendedores. Pedido mínimo 30 peças.",
  
  keywords: [
    "atacado celular",
    "acessórios celular atacado",
    "revenda acessórios",
    "capinha celular atacado",
    "película atacado",
    "carregador atacado",
    "fone atacado",
    "kits revenda"
  ],

  authors: [{ name: "Atacado Celular" }],
  creator: "Atacado Celular",
  publisher: "Atacado Celular",

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    siteName: 'Atacado Celular',
    title: 'Atacado Celular - Acessórios no Atacado com Melhores Preços',
    description: 'Acessórios para celular no atacado com os melhores preços. Kits prontos e catálogo completo para revendedores.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Atacado Celular - Acessórios no Atacado',
      }
    ],
  },

  // Twitter
  twitter: {
    card: 'summary_large_image',
    title: 'Atacado Celular - Acessórios no Atacado',
    description: 'Acessórios para celular no atacado com os melhores preços. Kits prontos para revendedores.',
    images: ['/images/og-image.jpg'],
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    nocache: false,
  },

  // Verification (add your actual verification codes)
  verification: {
    google: process.env.GOOGLE_VERIFICATION,
    // other: process.env.OTHER_VERIFICATION,
  },

  // Category
  category: 'business',

  // App specific
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Atacado Celular',
  },

  // Manifest
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // JSON-LD Schema Markup
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Store',
    name: 'Atacado Celular',
    description: 'Acessórios para celular no atacado com os melhores preços do Brasil',
    url: process.env.NEXT_PUBLIC_BASE_URL || 'https://atacado-celular.com',
    logo: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://atacado-celular.com'}/images/logo.png`,
    image: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://atacado-celular.com'}/images/og-image.jpg`,
    telephone: '+55-11-99999-9999', // Replace with actual phone
    email: 'contato@atacado-celular.com', // Replace with actual email
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rua Exemplo, 123',
      addressLocality: 'São Paulo',
      addressRegion: 'SP',
      postalCode: '01000-000',
      addressCountry: 'BR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -23.5505,
      longitude: -46.6333
    },
    openingHours: 'Mo-Fr 09:00-18:00',
    currenciesAccepted: 'BRL',
    paymentAccepted: 'PIX, Cartão de Crédito, Boleto',
    priceRange: '$$',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Catálogo de Acessórios',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Product',
            name: 'Acessórios para Celular no Atacado'
          }
        }
      ]
    }
  };

  return (
    <html lang="pt-BR">
      <head>
        {/* Performance Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* DNS Prefetch for external resources */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Favicon and App Icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Theme Color */}
        <meta name="theme-color" content="#f97316" />
        <meta name="msapplication-TileColor" content="#f97316" />
        
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Additional SEO Meta Tags */}
        <meta name="geo.region" content="BR" />
        <meta name="geo.placename" content="Brasil" />
        <meta name="ICBM" content="-23.5505, -46.6333" />
        
        {/* Cache Control for better performance */}
        <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <WebVitalsReporter /> */}
        <SessionProvider>
          {/* <ABTestingProvider> */}
            <TrackingProvider>
              <CartProvider>
                {children}
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </CartProvider>
            </TrackingProvider>
          {/* </ABTestingProvider> */}
        </SessionProvider>
      </body>
    </html>
  );
}
