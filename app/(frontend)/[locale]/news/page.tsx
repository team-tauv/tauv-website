import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { defaultLocale } from "@/lib/locales";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import { NEWS_QUERY } from "@/sanity/lib/queries";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { NewsCard } from "@/components/news/news-card";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("title"), description: t("description") };
}

export default async function NewsPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "news" });
  const { data: items } = await sanityFetch({
    query: NEWS_QUERY,
    params: { locale, defaultLocale },
    ...FETCH_OPTIONS,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      {items.length === 0 ? (
        <p className="border-border text-muted-foreground mt-12 rounded-xl border border-dashed p-16 text-center text-sm">
          {t("empty")}
        </p>
      ) : (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <FadeIn key={item._id} as="li" index={index}>
              <NewsCard item={item} />
            </FadeIn>
          ))}
        </ul>
      )}
    </div>
  );
}
