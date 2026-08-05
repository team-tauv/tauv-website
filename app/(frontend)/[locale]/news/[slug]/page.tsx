import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getFormatter, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { defaultLocale } from "@/lib/locales";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import { NEWS_BY_SLUG_QUERY, NEWS_SLUGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { SanityImageCropped } from "@/components/shared/sanity-image";
import { PortableText } from "@/components/shared/portable-text";
import { VehicleCard } from "@/components/vehicles/vehicle-card";

/**
 * Tüm haber slug'ları derleme anında üretilir. Slug diller arasında ortak
 * olduğu için tek sorgu yetiyor; locale kombinasyonunu üst segment sağlıyor.
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: NEWS_SLUGS_QUERY,
    perspective: "published",
    ...FETCH_OPTIONS,
  });

  return routing.locales.flatMap((locale) =>
    data.filter((item) => item.slug).map((item) => ({ locale, slug: item.slug! })),
  );
}

async function getNews(locale: string, slug: string) {
  const { data } = await sanityFetch({
    query: NEWS_BY_SLUG_QUERY,
    params: { slug, locale, defaultLocale },
    ...FETCH_OPTIONS,
  });
  return data;
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const item = await getNews(locale, slug);
  if (!item) return {};

  const ogSource = item.seo?.ogImage?.asset ? item.seo.ogImage : item.coverImage;

  return {
    title: item.seo?.title ?? item.title ?? undefined,
    description: item.seo?.description ?? item.excerpt ?? undefined,
    ...(item.seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "article",
      title: item.title ?? undefined,
      description: item.excerpt ?? undefined,
      publishedTime: item.publishedAt ?? undefined,
      ...(ogSource?.asset
        ? {
            images: [
              {
                url: urlFor({
                  _type: "image",
                  asset: { _type: "reference", _ref: ogSource.asset._id },
                })
                  .width(1200)
                  .height(630)
                  .fit("crop")
                  .url(),
                width: 1200,
                height: 630,
              },
            ],
          }
        : {}),
    },
  };
}

export default async function NewsDetailPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  const item = await getNews(locale, slug);
  if (!item) notFound();

  const t = await getTranslations({ locale, namespace: "news" });
  const format = await getFormatter({ locale });

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <Link
        href="/news"
        className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        {t("backToList")}
      </Link>

      <header className="mt-8">
        {item.publishedAt ? (
          <time
            dateTime={item.publishedAt}
            className="text-primary font-mono text-xs tracking-[0.2em] uppercase"
          >
            {format.dateTime(new Date(item.publishedAt), {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </time>
        ) : null}

        <h1 className="mt-4 text-3xl leading-tight font-bold tracking-tight sm:text-4xl">
          {item.title}
        </h1>

        {item.excerpt ? (
          <p className="text-muted-foreground mt-5 text-lg leading-relaxed">{item.excerpt}</p>
        ) : null}
      </header>

      {item.coverImage?.asset ? (
        <SanityImageCropped
          image={item.coverImage}
          alt={item.coverImage.alt || item.title || ""}
          width={1400}
          height={788}
          priority
          sizes="(max-width: 768px) 100vw, 768px"
          className="border-border mt-10 w-full rounded-xl border"
        />
      ) : null}

      <PortableText value={item.content} className="mt-12" />

      {item.relatedVehicle ? (
        <section className="border-border mt-16 border-t pt-10">
          <h2 className="mb-6 text-sm font-bold tracking-wide uppercase">{t("relatedVehicle")}</h2>
          <div className="sm:max-w-sm">
            <VehicleCard vehicle={item.relatedVehicle} />
          </div>
        </section>
      ) : null}
    </article>
  );
}
