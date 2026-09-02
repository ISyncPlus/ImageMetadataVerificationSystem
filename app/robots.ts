import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://provenance-unizik.edu.ng";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/case-studies", "/privacy", "/thank-you", "/login"],
        disallow: ["/api/", "/lecturer", "/student", "/onboarding"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
