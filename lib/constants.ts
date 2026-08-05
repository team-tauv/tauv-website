import type { Pathnames } from "@/i18n/routing";
import { isSocialPlatform, type SocialPlatform } from "@/lib/taxonomy";

/**
 * Dinamik segment içermeyen rotalar. Menüye `/vehicles/[slug]` gibi bir yol
 * konamaz — <Link> onu doldurulmuş params olmadan kabul etmez, ve tip sistemi
 * bunu derleme anında yakalasın istiyoruz.
 */
type StaticPathname = Exclude<Pathnames, `${string}[${string}`>;

/**
 * Navigasyon. `href` değerleri dosya sistemi yollarıdır — kullanıcıya görünen
 * URL'yi i18n/routing.ts üretir. `label` bir çeviri anahtarıdır (messages/*.json).
 */
export const NAV_ITEMS: ReadonlyArray<{ href: StaticPathname; label: string }> = [
  { href: "/about", label: "about" },
  { href: "/vehicles", label: "vehicles" },
  { href: "/competitions", label: "competitions" },
  { href: "/sponsors", label: "sponsors" },
  { href: "/news", label: "news" },
  { href: "/contact", label: "contact" },
];

/**
 * Footer'da menünün tamamı değil bir alt kümesi gösterilir; yarışmalar
 * yalnızca üst menüde kalır.
 *
 * NAV_ITEMS'tan süzülüyor, ayrı bir liste olarak yazılmıyor: etiket veya rota
 * değiştiğinde iki yerin ayrışma ihtimali kalmasın. Sıra da NAV_ITEMS'tan gelir.
 */
const FOOTER_HREFS: ReadonlySet<StaticPathname> = new Set([
  "/about",
  "/vehicles",
  "/sponsors",
  "/news",
  "/contact",
]);

export const FOOTER_ITEMS = NAV_ITEMS.filter((item) => FOOTER_HREFS.has(item.href));

/** Bağlı olunan kurum. Adres metni messages/*.json içinde. */
export const UNIVERSITY_URL = "https://www.tau.edu.tr/";

export type ResolvedSocial = { platform: SocialPlatform; url: string };

/**
 * Takımın resmî hesapları. Sanity'de Site Ayarları → Sosyal Medya doldurulana
 * kadar footer ve iletişim sayfasında bunlar gösterilir; CMS'e tek bir kayıt
 * girildiği anda tamamı devralınır (bkz. resolveSocials).
 *
 * TikTok adresinden `?_r=1&_t=...` parametreleri çıkarıldı: bunlar uygulamanın
 * paylaşım bağlantısına eklediği oturum belirteçleri, kalıcı adresin parçası
 * değil. Profil onlarsız da açılıyor.
 */
export const DEFAULT_SOCIALS: ReadonlyArray<ResolvedSocial> = [
  { platform: "instagram", url: "https://www.instagram.com/tauv.team/" },
  { platform: "linkedin", url: "https://www.linkedin.com/company/tauv-team" },
  { platform: "tiktok", url: "https://www.tiktok.com/@tauvteam" },
  { platform: "linktree", url: "https://linktr.ee/tauv.team" },
  { platform: "github", url: "https://github.com/team-tauv" },
];

/**
 * CMS'ten gelen listeyi temizler; boşsa geçici listeye düşer.
 *
 * Tek yerde toplandı çünkü hem footer hem iletişim sayfası aynı işi yapıyor ve
 * ikisinde ayrı ayrı filtrelemek, birinde platform doğrulamasını atlamak gibi
 * sessiz farklara yol açıyordu.
 */
export function resolveSocials(
  fromCms: ReadonlyArray<{ platform: string | null; url: string | null }> | null | undefined,
): ResolvedSocial[] {
  const filled = (fromCms ?? []).flatMap((social) =>
    social.url && isSocialPlatform(social.platform)
      ? [{ platform: social.platform, url: social.url }]
      : [],
  );

  return filled.length > 0 ? filled : [...DEFAULT_SOCIALS];
}
