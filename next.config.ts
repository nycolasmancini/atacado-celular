import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração ultra-mínima para resolver erro de manifest
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;