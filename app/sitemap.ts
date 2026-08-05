import type { MetadataRoute } from "next";
import { getPathname } from "@/i18n/navigation";
import { locales, defaultLocale, type Locale } from "@/lib/locales";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import { NEWS_SLUGS_QUERY, VEHICLE_SLUGS_QUERY } from "@/sanity/lib/queries";

const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

type Href = Parameters<typeof getPathname>[0]["href"];

function absolute(href: Href, locale: Locale) {
  return `${baseUrl}${getPathname({ href, locale })}`;
}

/**
 * Her giriş, diğer dildeki karşılığını `alternates.languages` ile bildirir.
 * Arama motoru böylece /araclar ile /en/vehicles'ı ayrı sayfalar değil aynı
 * sayfanın iki dili olarak görür.
 */
function entry(href: Href, lastModified?: string): MetadataRoute.Sitemap[number] {
  return {
    url: absolute(href, defaultLocale),
    ...(lastModified ? { lastModified } : {}),
    alternates: {
      languages: Object.fromEntries(locales.map((locale) => [locale, absolute(href, locale)])),
    },
  };
}

const STATIC_PAGES = [
  "/",
  "/about",
  "/vehicles",
  "/competitions",
  "/sponsors",
  "/news",
  "/contact",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [vehicles, news] = await Promise.all([
    sanityFetch({ query: VEHICLE_SLUGS_QUERY, perspective: "published", ...FETCH_OPTIONS }),
    sanityFetch({ query: NEWS_SLUGS_QUERY, perspective: "published", ...FETCH_OPTIONS }),
  ]);

  return [
    ...STATIC_PAGES.map((href) => entry(href)),

    ...vehicles.data
      .filter((item) => item.slug)
      .map((item) => entry({ pathname: "/vehicles/[slug]", params: { slug: item.slug! } })),

    ...news.data
      .filter((item) => item.slug)
      .map((item) => entry({ pathname: "/news/[slug]", params: { slug: item.slug! } })),
  ];
}
