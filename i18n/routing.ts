import { defineRouting } from "next-intl/routing";
import { defaultLocale, locales } from "../lib/locales";

export { defaultLocale, locales };
export type { Locale } from "../lib/locales";

/**
 * Dosya sistemindeki segment adları (soldaki anahtarlar) İngilizce tutulur;
 * kullanıcıya görünen URL'ler locale başına buradan üretilir.
 * Varsayılan dil (tr) ön ek almaz: /araclar ↔ /en/vehicles ↔ /de/fahrzeuge
 *
 * Her rota için `locales` içindeki tüm diller yazılmak zorunda; eksik bırakılan
 * bir dil derleme anında tip hatası verir.
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
      de: "/ueber-uns",
    },
    /**
     * Departman detay sayfası. Slug olarak departman kodu (mechanical,
     * electronics…) kullanılıyor; araç slug'larında olduğu gibi iki dilde
     * ortak — dile göre ayrı slug, kanonik URL ve yönlendirme karmaşası
     * getirir, kazancı yok.
     */
    "/about/[department]": {
      tr: "/hakkimizda/[department]",
      en: "/about/[department]",
      de: "/ueber-uns/[department]",
    },
    "/vehicles": {
      tr: "/araclar",
      en: "/vehicles",
      de: "/fahrzeuge",
    },
    "/vehicles/[slug]": {
      tr: "/araclar/[slug]",
      en: "/vehicles/[slug]",
      de: "/fahrzeuge/[slug]",
    },
    "/competitions": {
      tr: "/yarismalar",
      en: "/competitions",
      de: "/wettbewerbe",
    },
    "/sponsors": {
      tr: "/sponsorlar",
      en: "/sponsors",
      de: "/sponsoren",
    },
    // Dosya sistemindeki segment "news" olarak kalıyor (Sanity doküman tipiyle
    // aynı ad), kullanıcıya görünen adres üç dilde de /blog.
    "/news": {
      tr: "/blog",
      en: "/blog",
      de: "/blog",
    },
    "/news/[slug]": {
      tr: "/blog/[slug]",
      en: "/blog/[slug]",
      de: "/blog/[slug]",
    },
    "/contact": {
      tr: "/iletisim",
      en: "/contact",
      de: "/kontakt",
    },
  },
});

export type Pathnames = keyof typeof routing.pathnames;
