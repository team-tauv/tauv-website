/**
 * Dil listesinin tek kaynağı. Kasıtlı olarak bağımlılıksız tutuldu: hem Next
 * tarafı (i18n/routing.ts) hem Sanity Studio (sanity.config.ts) buradan okur.
 * Studio bundle'ına next-intl sızmasın diye ayrı bir dosyada duruyor.
 */
export const locales = ["tr", "en", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "tr";

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
  de: "Deutsch",
};

/** Open Graph `og:locale` biçimi — dil koduyla birebir aynı değil. */
export const openGraphLocales: Record<Locale, string> = {
  tr: "tr_TR",
  en: "en_US",
  de: "de_DE",
};

/** Varsayılan dışındaki diller: çeviri hedefleri buradan türetiliyor. */
export const translationTargets = locales.filter((locale) => locale !== defaultLocale);

/** Sanity `internationalizedArray` eklentisinin beklediği biçim. */
export const sanityLanguages = locales.map((id) => ({ id, title: localeNames[id] }));

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
