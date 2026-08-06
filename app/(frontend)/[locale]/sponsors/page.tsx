import type { Metadata } from "next";
import { Download, Mail } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { defaultLocale } from "@/lib/locales";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import {
  ACHIEVEMENTS_QUERY,
  SITE_SETTINGS_QUERY,
  SPONSORS_QUERY,
  SPONSORSHIP_PACKAGES_QUERY,
} from "@/sanity/lib/queries";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/shared/section-heading";
import { PortableText } from "@/components/shared/portable-text";
import { StatsBand } from "@/components/home/stats-band";
import { Achievements } from "@/components/sponsors/achievements";
import { SponsorGrid } from "@/components/sponsors/sponsor-grid";
import { SponsorshipPackages } from "@/components/sponsors/sponsorship-packages";

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

  const [sponsors, settings, packages, achievements] = await Promise.all([
    sanityFetch({ query: SPONSORS_QUERY, params, ...FETCH_OPTIONS }),
    sanityFetch({ query: SITE_SETTINGS_QUERY, params, ...FETCH_OPTIONS }),
    sanityFetch({ query: SPONSORSHIP_PACKAGES_QUERY, params, ...FETCH_OPTIONS }),
    sanityFetch({ query: ACHIEVEMENTS_QUERY, params, ...FETCH_OPTIONS }),
  ]);

  const data = settings.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      {/* Sponsor bu sayfayı "karşılığında ne var" sorusuyla okuyor —
          katman/karşılık tablosu en üstte, kanıt (metrikler, dereceler) altında.
          "Destekçilerimiz" başlığı ise ait olduğu yerde: sponsor logolarının üstünde. */}
      <SectionHeading
        eyebrow={t("packagesEyebrow")}
        title={t("packagesTitle")}
        description={t("packagesDescription")}
      />
      <SponsorshipPackages packages={packages.data} />

      {data?.sponsorshipStats?.length ? (
        <div className="mt-24">
          <StatsBand stats={data.sponsorshipStats} variant="card" />
        </div>
      ) : null}

      <section className="mt-24">
        <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
        <SponsorGrid sponsors={sponsors.data} />
      </section>

      <Achievements achievements={achievements.data} />

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
