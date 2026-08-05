/**
 * Sabit listelerin tek kaynağı.
 *
 * Hem Sanity şemaları (Studio'daki seçenek listesi) hem site bileşenleri
 * (sekmeler, gruplama sırası) buradan okur. İki yerde ayrı tutulsaydı yeni bir
 * departman eklendiğinde şema güncellenip sekme unutulur ve o departmanın
 * üyeleri sitede hiç görünmezdi — sessiz bir hata olurdu.
 *
 * Buradaki `title` yalnızca Studio arayüzü içindir. Sitede görünen etiketler
 * messages/*.json içindeki `departments.*` ve `tiers.*` anahtarlarından gelir.
 *
 * Kasıtlı olarak bağımlılıksız: Studio bundle'ına next-intl, site bundle'ına
 * sanity sızmasın diye.
 */

export const DEPARTMENTS = [
  { value: "mechanical", title: "Mekanik" },
  { value: "software", title: "Yazılım" },
  { value: "autonomy", title: "Otonom" },
  { value: "electronics", title: "Elektronik" },
  { value: "media", title: "Medya & Sponsorluk" },
] as const;

export type Department = (typeof DEPARTMENTS)[number]["value"];

export const DEPARTMENT_VALUES = DEPARTMENTS.map((d) => d.value) as readonly Department[];

/** Sıra önemli: sponsor grid'i bu sırayla bölümlenir. */
export const SPONSOR_TIERS = [
  { value: "main", title: "Ana Sponsor" },
  { value: "gold", title: "Altın" },
  { value: "silver", title: "Gümüş" },
  { value: "bronze", title: "Bronz" },
  { value: "supplier", title: "Tedarik" },
] as const;

export type SponsorTier = (typeof SPONSOR_TIERS)[number]["value"];

export const TIER_VALUES = SPONSOR_TIERS.map((t) => t.value) as readonly SponsorTier[];

export const VEHICLE_TYPES = [
  { value: "AUV", title: "AUV — Otonom Su Altı Aracı" },
  { value: "ROV", title: "ROV — Uzaktan Kumandalı Araç" },
] as const;
