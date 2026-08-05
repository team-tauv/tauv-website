import type { Metadata } from "next";
import { ExternalLink, MapPin, Mail, Users } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { defaultLocale } from "@/lib/locales";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { resolveSocials } from "@/lib/constants";
import { SOCIAL_PLATFORM_LABELS } from "@/lib/taxonomy";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { SocialIcon } from "@/components/shared/social-icon";
import { ContactForm } from "@/components/contact/contact-form";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("description") };
}

export default async function ContactPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "contact" });
  const { data } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    params: { locale, defaultLocale },
    ...FETCH_OPTIONS,
  });

  // CMS boşsa geçici bağlantılara düşer; footer ile aynı mantık.
  const socials = resolveSocials(data?.socials);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
        <div className="min-w-0">
          <ContactForm />
        </div>

        <aside className="space-y-8">
          {data?.contactEmail ? (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
                <Mail className="text-primary size-4" aria-hidden />
                {t("emailHeading")}
              </h2>
              <a
                href={`mailto:${data.contactEmail}`}
                className="text-primary font-mono text-sm break-all hover:underline"
              >
                {data.contactEmail}
              </a>
            </div>
          ) : null}

          {data?.address ? (
            <div>
              <h2 className="mb-3 flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
                <MapPin className="text-primary size-4" aria-hidden />
                {t("addressHeading")}
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {data.address}
              </p>
            </div>
          ) : null}

          {socials.length > 0 ? (
            <div>
              <h2 className="mb-3 text-sm font-bold tracking-wide uppercase">
                {t("socialHeading")}
              </h2>
              <ul className="flex flex-wrap gap-2">
                {socials.map((social) => (
                  <li key={social.platform}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={SOCIAL_PLATFORM_LABELS[social.platform]}
                      className="border-border text-muted-foreground hover:border-primary hover:text-primary flex size-10 items-center justify-center rounded-lg border transition-colors"
                    >
                      <SocialIcon platform={social.platform} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Üye alımı: kapalıyken de bir şey gösteriliyor, aday boşluğa bakmasın. */}
          <div className="border-border bg-surface rounded-xl border p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold tracking-wide uppercase">
              <Users className="text-primary size-4" aria-hidden />
              {t("recruitmentHeading")}
            </h2>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
              {data?.recruitmentNotice ??
                (data?.recruitmentOpen ? t("recruitmentOpenFallback") : t("recruitmentClosed"))}
            </p>
            {data?.recruitmentOpen && data?.recruitmentUrl ? (
              <Button asChild size="sm" className="mt-4">
                <a href={data.recruitmentUrl} target="_blank" rel="noopener noreferrer">
                  {t("applyNow")}
                  <ExternalLink />
                </a>
              </Button>
            ) : null}
          </div>
        </aside>
      </div>

      {data?.mapEmbedUrl ? (
        <section className="mt-16">
          <h2 className="mb-5 text-sm font-bold tracking-wide uppercase">{t("mapHeading")}</h2>
          <div className="border-border aspect-video overflow-hidden rounded-xl border sm:aspect-3/1">
            <iframe
              src={data.mapEmbedUrl}
              title={t("mapHeading")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="size-full"
            />
          </div>
        </section>
      ) : null}
    </div>
  );
}
