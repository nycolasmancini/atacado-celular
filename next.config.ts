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
  },
};

export default nextConfig;