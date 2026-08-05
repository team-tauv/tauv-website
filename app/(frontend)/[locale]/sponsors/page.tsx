import type { Metadata } from "next";
import { Download, Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { defaultLocale } from "@/lib/locales";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY, SPONSORS_QUERY } from "@/sanity/lib/queries";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { PortableText } from "@/components/shared/portable-text";
import { SponsorGrid } from "@/components/sponsors/sponsor-grid";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "sponsors" });
  return { title: t("title"), description: t("description") };
}

export default async function SponsorsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "sponsors" });
  const params = { locale, defaultLocale };

  const [sponsors, settings] = await Promise.all([
    sanityFetch({ query: SPONSORS_QUERY, params, ...FETCH_OPTIONS }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, params, ...FETCH_OPTIONS }),
  ]);

  const data = settings.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      <SponsorGrid sponsors={sponsors.data} />

      <section className="border-border bg-surface mt-24 rounded-2xl border p-8 sm:p-12">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("becomeTitle")}</h2>

          {data?.sponsorshipPitch ? (
            <PortableText value={data.sponsorshipPitch} className="mt-5" />
          ) : (
            <p className="text-muted-foreground mt-5 leading-relaxed">{t("becomeFallback")}</p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {data?.sponsorshipDeck ? (
              <Button asChild>
                {/* PDF dış bir kaynakta (Sanity CDN) — locale-aware Link değil, düz <a> */}
                <a href={data.sponsorshipDeck} target="_blank" rel="noopener noreferrer" download>
                  <Download />
                  {t("downloadDeck")}
                </a>
              </Button>
            ) : null}

            <Button asChild variant="outline">
              <Link href="/contact">
                <Mail />
                {t("contactUs")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
