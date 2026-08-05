import type { MetadataRoute } from "next";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Studio kimlik doğrulama arkasında ama yine de dizine girmesin —
      // arama sonucunda "TAUV İçerik Yönetimi" görünmesinin anlamı yok.
      disallow: ["/studio"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
