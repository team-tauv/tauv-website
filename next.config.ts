import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  typescript: {
    // Tip hataları build'i kırmalı — CI'da sessizce geçmesin.
    ignoreBuildErrors: false,
  },

  async redirects() {
    return [
      // Brief'teki yazım hatasından gelen trafiği doğru rotaya taşı.
      // next.config redirect'leri middleware'den ÖNCE çalışır, bu yüzden
      // next-intl locale çözümlemesine girmeden yakalanır.
      { source: "/yarisamalar", destination: "/yarismalar", permanent: true },
    ];
  },
};

export default withNextIntl(nextConfig);
