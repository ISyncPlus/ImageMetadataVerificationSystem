import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Requirement: Remove production source maps to protect internals and reduce bundle size
  productionBrowserSourceMaps: false,
  
  // Optimization: Reduce JavaScript bundle sizes by optimizing heavy package imports
  experimental: {
    optimizePackageImports: ["motion", "framer-motion", "lucide-react", "@hugeicons/react"],
  },

  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;

