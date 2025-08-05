import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração ultra-mínima para resolver erro de manifest
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['via.placeholder.com'],
    unoptimized: true, // Temporariamente desabilitar otimização para evitar erros 400
  },
  // Disable experimental features that might cause telemetry issues
  experimental: {
    instrumentationHook: false,
  },
};

export default nextConfig;