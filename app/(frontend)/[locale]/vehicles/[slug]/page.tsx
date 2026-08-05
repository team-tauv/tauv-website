import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, Trophy } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { defaultLocale } from "@/lib/locales";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import { VEHICLE_BY_SLUG_QUERY, VEHICLE_SLUGS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import { SanityImageCropped } from "@/components/shared/sanity-image";
import { PortableText } from "@/components/shared/portable-text";
import { SpecTable } from "@/components/vehicles/spec-table";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { VehicleModelViewer } from "@/components/vehicles/vehicle-model-viewer";

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: VEHICLE_SLUGS_QUERY,
    perspective: "published",
    ...FETCH_OPTIONS,
  });

  return routing.locales.flatMap((locale) =>
    data.filter((item) => item.slug).map((item) => ({ locale, slug: item.slug! })),
  );
}

async function getVehicle(locale: string, slug: string) {
  const { data } = await sanityFetch({
    query: VEHICLE_BY_SLUG_QUERY,
    params: { slug, locale, defaultLocale },
    ...FETCH_OPTIONS,
  });
  return data;
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await props.params;
  const vehicle = await getVehicle(locale, slug);
  if (!vehicle) return {};

  const ogSource = vehicle.seo?.ogImage?.asset ? vehicle.seo.ogImage : vehicle.mainImage;

  return {
    title: vehicle.seo?.title ?? vehicle.title ?? undefined,
    description: vehicle.seo?.description ?? vehicle.tagline ?? undefined,
    ...(vehicle.seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "article",
      title: vehicle.title ?? undefined,
      description: vehicle.tagline ?? undefined,
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

export default async function VehicleDetailPage(props: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await props.params;
  setRequestLocale(locale);

  const vehicle = await getVehicle(locale, slug);
  if (!vehicle) notFound();

  const t = await getTranslations({ locale, namespace: "vehicle" });

  // Model yüklenene kadar gösterilen kare. Ayrı poster girilmediyse kapak görseli.
  const posterSource = vehicle.modelPoster?.asset ? vehicle.modelPoster : vehicle.mainImage;
  const posterUrl = posterSource?.asset
    ? urlFor({ _type: "image", asset: { _type: "reference", _ref: posterSource.asset._id } })
        .width(1200)
        .fit("max")
        .url()
    : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <Link
        href="/vehicles"
        className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        {t("backToList")}
      </Link>

      <header className="mt-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="border-primary/40 text-primary rounded-md border px-2.5 py-1 font-mono text-xs font-bold">
            {vehicle.type}
          </span>
          <span className="text-muted-foreground font-mono text-sm">{vehicle.year}</span>
          {vehicle.status ? (
            <span className="text-muted-foreground bg-surface rounded-md px-2.5 py-1 text-xs">
              {t(`status.${vehicle.status}`)}
            </span>
          ) : null}
        </div>

        <h1 className="mt-5 text-4xl font-bold tracking-tight sm:text-5xl">{vehicle.title}</h1>

        {vehicle.tagline ? (
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed">
            {vehicle.tagline}
          </p>
        ) : null}
      </header>

      {vehicle.mainImage?.asset ? (
        <SanityImageCropped
          image={vehicle.mainImage}
          alt={vehicle.mainImage.alt || vehicle.title || ""}
          width={1600}
          height={900}
          priority
          sizes="(max-width: 1152px) 100vw, 1152px"
          className="border-border mt-10 w-full rounded-xl border"
        />
      ) : null}

      <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_20rem] lg:gap-16">
        <div className="min-w-0">
          <PortableText value={vehicle.description} />

          {vehicle.gallery && vehicle.gallery.length > 0 ? (
            <div className="mt-14">
              <h2 className="mb-5 text-sm font-bold tracking-wide uppercase">{t("gallery")}</h2>
              <VehicleGallery images={vehicle.gallery} />
            </div>
          ) : null}

          {/* Kendi GLB'miz varsa o kazanır; renderUrl yalnızca yedek (Sketchfab vb.). */}
          {vehicle.model3dUrl ? (
            <div className="mt-14">
              <h2 className="mb-5 text-sm font-bold tracking-wide uppercase">{t("render3d")}</h2>
              <VehicleModelViewer
                src={vehicle.model3dUrl}
                alt={`${vehicle.title ?? ""} — ${t("render3d")}`}
                poster={posterUrl}
              />
            </div>
          ) : vehicle.renderUrl ? (
            <div className="mt-14">
              <h2 className="mb-5 text-sm font-bold tracking-wide uppercase">{t("render3d")}</h2>
              <div className="border-border aspect-video overflow-hidden rounded-xl border">
                <iframe
                  src={vehicle.renderUrl}
                  title={`${vehicle.title ?? ""} — ${t("render3d")}`}
                  loading="lazy"
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  allowFullScreen
                  className="size-full"
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Teknik veriler yan sütunda sabit kalır; uzun açıklamada kaybolmasın. */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {vehicle.specs && vehicle.specs.length > 0 ? (
            <>
              <h2 className="mb-4 text-sm font-bold tracking-wide uppercase">{t("specs")}</h2>
              <SpecTable specs={vehicle.specs} />
            </>
          ) : null}

          {vehicle.competitions && vehicle.competitions.length > 0 ? (
            <div className="mt-10">
              <h2 className="mb-4 text-sm font-bold tracking-wide uppercase">
                {t("competitions")}
              </h2>
              <ul className="space-y-3">
                {vehicle.competitions.map((competition) => (
                  <li
                    key={competition._id}
                    className="border-border bg-surface flex items-start gap-3 rounded-lg border p-3"
                  >
                    <Trophy className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                    <div className="min-w-0">
                      <p className="text-sm font-bold">{competition.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {[competition.year, competition.result].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
