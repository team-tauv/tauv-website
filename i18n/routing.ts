import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "../lib/locales";

export { defaultLocale, locales };
export type { Locale } from "../lib/locales";

/**
 * Dosya sistemindeki segment adları (soldaki anahtarlar) İngilizce tutulur;
 * kullanıcıya görünen URL'ler locale başına buradan üretilir.
 * Varsayılan dil (tr) ön ek almaz: /araclar  ↔  /en/vehicles
 */
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: true,
  pathnames: {
    "/": "/",
    "/about": {
      tr: "/hakkimizda",
      en: "/about",
    },
    "/vehicles": {
      tr: "/araclar",
      en: "/vehicles",
    },
    "/vehicles/[slug]": {
      tr: "/araclar/[slug]",
      en: "/vehicles/[slug]",
    },
    "/competitions": {
      tr: "/yarismalar",
      en: "/competitions",
    },
    "/sponsors": {
      tr: "/sponsorlar",
      en: "/sponsors",
    },
    // Dosya sistemindeki segment "news" olarak kalıyor (Sanity doküman tipiyle
    // aynı ad), kullanıcıya görünen adres iki dilde de /blog.
    "/news": {
      tr: "/blog",
      en: "/blog",
    },
    "/news/[slug]": {
      tr: "/blog/[slug]",
      en: "/blog/[slug]",
    },
    "/contact": {
      tr: "/iletisim",
      en: "/contact",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
