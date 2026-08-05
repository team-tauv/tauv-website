import { defaultLocale, type Locale } from "../../lib/locales";

/**
 * `sanity-plugin-internationalized-array` v5'in diskteki veri biçimi.
 * Dil, dizinin `_key`inde değil ayrı bir `language` alanında tutulur.
 */
export type IntlArray<T = string> = Array<{
  _key: string;
  language: string;
  value: T | null;
}>;

/**
 * GROQ tarafındaki dil seçimi queries.ts içinde sabit parçalar hâlinde yazılır:
 *
 *   "title": coalesce(title[language == $locale][0].value,
 *                     title[language == $defaultLocale][0].value)
 *
 * Bunu üreten bir yardımcı fonksiyon daha okunaklı olurdu, ama `sanity typegen`
 * sorgu metnini statik olarak çözebilmek zorunda — fonksiyon çağrısı gördüğünde
 * tip üretemiyor. Bu yüzden okunabilirlikten değil, tip güvenliğinden yana
 * karar verildi.
 */

/** Dil seçiminin JS tarafındaki karşılığı — Studio önizlemeleri ve testler için. */
export function pickLocale<T>(
  items: IntlArray<T> | null | undefined,
  locale: string = defaultLocale,
  fallback: string = defaultLocale,
): T | undefined {
  if (!items?.length) return undefined;
  const exact = items.find((item) => item.language === locale)?.value;
  if (exact !== null && exact !== undefined && exact !== "") return exact;
  return items.find((item) => item.language === fallback)?.value ?? undefined;
}

/** Sorgulara geçilecek standart parametre kümesi. */
export function localeParams(locale: Locale) {
  return { locale, defaultLocale };
}
