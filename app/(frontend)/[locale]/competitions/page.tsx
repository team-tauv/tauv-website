import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { defaultLocale } from "@/lib/locales";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import { COMPETITIONS_QUERY } from "@/sanity/lib/queries";
import { SectionHeading } from "@/components/shared/section-heading";
import { Timeline } from "@/components/competitions/timeline";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "competitions" });
  return { title: t("title"), description: t("description") };
}

export default async function CompetitionsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "competitions" });
  const { data: competitions } = await sanityFetch({
    query: COMPETITIONS_QUERY,
    params: { locale, defaultLocale },
    ...FETCH_OPTIONS,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />
      <Timeline competitions={competitions} />
    </div>
  );
}
