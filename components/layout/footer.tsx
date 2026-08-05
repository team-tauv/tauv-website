import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SocialIcon } from "@/components/shared/social-icon";
import { NAV_ITEMS, SOCIAL_ICON_LABELS } from "@/lib/constants";
import { Logo } from "./logo";

type FooterProps = {
  socials?: Array<{ platform: string | null; url: string | null }> | null;
  contactEmail?: string | null;
};

export function Footer({ socials, contactEmail }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  const links = (socials ?? []).filter(
    (s): s is { platform: string; url: string } => Boolean(s.platform && s.url),
  );

  return (
    <footer className="border-border bg-surface/30 mt-24 border-t">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <Logo size={44} />
            <p className="text-muted-foreground mt-4 max-w-sm text-sm leading-relaxed">
              {t("tagline")}
            </p>
            {contactEmail ? (
              <a
                href={`mailto:${contactEmail}`}
                className="text-primary mt-4 inline-block font-mono text-sm hover:underline"
              >
                {contactEmail}
              </a>
            ) : null}
          </div>

          <div>
            <h2 className="text-sm font-bold tracking-wide uppercase">{t("quickLinks")}</h2>
            <ul className="mt-4 space-y-2.5">
              {NAV_ITEMS.map((item) => (
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
              <ul className="mt-4 flex flex-wrap gap-2">
                {links.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_ICON_LABELS[social.platform] ?? social.platform}
                      className="border-border text-muted-foreground hover:border-primary hover:text-primary flex size-10 items-center justify-center rounded-lg border transition-colors"
                    >
                      <SocialIcon platform={social.platform} />
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
