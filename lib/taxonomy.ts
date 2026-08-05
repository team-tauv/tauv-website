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

/** Sıra önemli: Studio menüsü ve site sekmeleri bu sırayla dizilir. */
export const DEPARTMENTS = [
  { value: "mechanical", title: "Mekanik" },
  { value: "electronics", title: "Elektronik" },
  { value: "software", title: "Yazılım" },
  { value: "organization", title: "Organizasyon" },
  { value: "mentors", title: "Mentörler" },
] as const;

export type Department = (typeof DEPARTMENTS)[number]["value"];

export const DEPARTMENT_VALUES = DEPARTMENTS.map((d) => d.value) as readonly Department[];

export function isDepartment(value: unknown): value is Department {
  return typeof value === "string" && (DEPARTMENT_VALUES as readonly string[]).includes(value);
}

/**
 * Sıra önemli: sponsor grid'i ve sponsorluk paketi kartları bu sırayla
 * bölümlenir. Katmanlar sponsorluk dosyasındaki bütçe aralıklarına karşılık
 * gelir; tutarlar Studio'daki "Sponsorluk Paketi" dokümanından girilir, burada
 * tutulmaz — sezona göre değişirler.
 */
export const SPONSOR_TIERS = [
  { value: "main", title: "Ana Sponsor" },
  { value: "platinum", title: "Platin" },
  { value: "gold", title: "Altın" },
  { value: "silver", title: "Gümüş" },
  { value: "bronze", title: "Bronz" },
  { value: "supplier", title: "Ürün / Tedarik" },
] as const;

export type SponsorTier = (typeof SPONSOR_TIERS)[number]["value"];

export const TIER_VALUES = SPONSOR_TIERS.map((t) => t.value) as readonly SponsorTier[];

export const VEHICLE_TYPES = [
  { value: "AUV", title: "AUV — Otonom Su Altı Aracı" },
  { value: "ROV", title: "ROV — Uzaktan Kumandalı Araç" },
] as const;

/** Sıra önemli: footer ve iletişim sayfasında bu sırayla dizilir. */
export const SOCIAL_PLATFORMS = [
  { value: "instagram", title: "Instagram" },
  { value: "linkedin", title: "LinkedIn" },
  { value: "tiktok", title: "TikTok" },
  { value: "linktree", title: "Linktree" },
  { value: "youtube", title: "YouTube" },
  { value: "x", title: "X (Twitter)" },
  { value: "github", title: "GitHub" },
  { value: "email", title: "E-posta" },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["value"];

export const SOCIAL_PLATFORM_VALUES = SOCIAL_PLATFORMS.map(
  (p) => p.value,
) as readonly SocialPlatform[];

export const SOCIAL_PLATFORM_LABELS = Object.fromEntries(
  SOCIAL_PLATFORMS.map((p) => [p.value, p.title]),
) as Record<SocialPlatform, string>;

export function isSocialPlatform(value: unknown): value is SocialPlatform {
  return typeof value === "string" && (SOCIAL_PLATFORM_VALUES as readonly string[]).includes(value);
}
