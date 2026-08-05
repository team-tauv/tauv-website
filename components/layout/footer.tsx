import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SocialIcon } from "@/components/shared/social-icon";
import { FOOTER_ITEMS, resolveSocials, UNIVERSITY_URL } from "@/lib/constants";
import { SOCIAL_PLATFORM_LABELS } from "@/lib/taxonomy";
import { Logo } from "./logo";

type FooterProps = {
  socials?: Array<{ platform: string | null; url: string | null }> | null;
  contactEmail?: string | null;
};

export function Footer({ socials, contactEmail }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  const links = resolveSocials(socials);

  return (
    <footer className="border-border bg-surface/30 mt-24 border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo size={44} />

            <p className="text-muted-foreground mt-5 max-w-sm text-sm leading-relaxed">
              {t("tagline")}
            </p>

            {/* Kurum ve iletişim bilgisi tek blokta.
                <address> kullanılıyor çünkü içeriğin kendisi bir iletişim
                adresi — ekran okuyucular ve arama motorları bunu düz bir
                paragraftan ayırt ediyor. */}
            <address className="mt-6 space-y-1.5 not-italic">
              <a
                href={UNIVERSITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              >
                {t("university")}
                <ExternalLink className="size-3.5" aria-hidden />
              </a>
              <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                {t("universityAddress")}
              </p>
              {contactEmail ? (
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-primary inline-block font-mono text-sm hover:underline"
                >
                  {contactEmail}
                </a>
              ) : null}
            </address>
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase">{t("quickLinks")}</h2>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {tNav(item.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {links.length > 0 ? (
            <div>
              <h2 className="text-sm font-bold tracking-wide uppercase">{t("followUs")}</h2>
              {/* Platform adı görünür olduğu için ikona aria-label gerekmiyor —
                  SocialIcon zaten aria-hidden, ad bağlantının metni.

                  Satır yüksekliği sabitlendi (`h-6` + `leading-none`): ikonlar
                  aynı kutuda olsa da LinkedIn'in kenarlıklı "in" işareti ile
                  SVG'lerin doğal yükseklikleri birebir aynı değil, `space-y`
                  ile bırakıldığında satır araları gözle görülür biçimde
                  eşitsizleşiyordu. Sabit yükseklik + `gap` bunu tamamen
                  içeriğe bağımlı olmaktan çıkarıyor. */}
              <ul className="mt-4 flex flex-col gap-3">
                {links.map((social) => (
                  <li key={social.platform} className="flex">
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary flex h-6 items-center gap-2.5 text-sm leading-none transition-colors"
                    >
                      <span className="flex size-4 shrink-0 items-center justify-center">
                        <SocialIcon platform={social.platform} />
                      </span>
                      {SOCIAL_PLATFORM_LABELS[social.platform]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="border-border text-muted-foreground mt-12 flex flex-col gap-3 border-t pt-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} TAUV. {t("rights")}
          </p>
          <a href="#top" className="hover:text-primary transition-colors">
            {t("backToTop")} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
