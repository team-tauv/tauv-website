import type { Pathnames } from "@/i18n/routing";

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

export const SOCIAL_ICON_LABELS: Record<string, string> = {
  instagram: "Instagram",
  linkedin: "LinkedIn",
  x: "X",
  youtube: "YouTube",
  github: "GitHub",
  email: "E-posta",
};
