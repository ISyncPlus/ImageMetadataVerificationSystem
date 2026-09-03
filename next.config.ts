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

  /**
   * Proxies API calls through this app's own origin instead of letting the
   * browser talk to the Provenance API domain directly.
   *
   * The API lives on a separate domain (Render/Railway/etc.), so a direct
   * browser->API request makes the session cookie third-party. Safari's
   * Intelligent Tracking Prevention — and increasingly Chrome/Firefox — block
   * third-party cookies by default, which is why sign-in worked in some
   * browsers/sessions and not others with no code change in between. Routing
   * every /api/* call through this same origin, forwarded server-side to the
   * real API, makes the browser's view of the world entirely same-origin: no
   * cookie in this flow is ever cross-site.
   *
   * Set API_ORIGIN in Vercel's project settings (Production AND Preview
   * environments) to the API's real URL, e.g.
   * https://provenance-backend-mamk.onrender.com — server-side only, no
   * NEXT_PUBLIC_ prefix, since only this rewrite (running on Vercel's
   * infrastructure) needs to know it. Pair this with NEXT_PUBLIC_API_URL=""
   * (see .env.local.example) so the browser calls this app's own /api/*
   * paths instead of the API domain directly.
   */
  async rewrites() {
    const apiOrigin = process.env.API_ORIGIN;
    if (!apiOrigin) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;

