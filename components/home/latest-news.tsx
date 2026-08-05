import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { NewsCard } from "@/components/news/news-card";
import type { LATEST_NEWS_QUERY_RESULT } from "@/types/sanity.types";

export function LatestNews({ items }: { items: LATEST_NEWS_QUERY_RESULT }) {
  const t = useTranslations("home");

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("newsEyebrow")}
          title={t("newsTitle")}
          action={
            items.length > 0 ? (
              <Button asChild variant="outline" size="sm">
                <Link href="/news">{t("newsAll")}</Link>
              </Button>
            ) : null
          }
        />

        {items.length === 0 ? (
          <p className="border-border text-muted-foreground mt-10 rounded-xl border border-dashed p-12 text-center text-sm">
            {t("newsEmpty")}
          </p>
        ) : (
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <FadeIn key={item._id} as="li" index={index}>
                <NewsCard item={item} />
              </FadeIn>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
