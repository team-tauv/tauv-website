import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import { SanityImageCropped } from "@/components/shared/sanity-image";
import type { FEATURED_VEHICLE_QUERY_RESULT } from "@/types/sanity.types";

export function FeaturedVehicle({ vehicle }: { vehicle: FEATURED_VEHICLE_QUERY_RESULT }) {
  const t = useTranslations("home");
  const tVehicle = useTranslations("vehicle");

  if (!vehicle?.slug) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FadeIn className="border-border bg-surface grid overflow-hidden rounded-2xl border lg:grid-cols-2">
          <div className="bg-background relative aspect-4/3 lg:aspect-auto">
            <SanityImageCropped
              image={vehicle.mainImage}
              alt={vehicle.mainImage?.alt || vehicle.title || ""}
              width={1200}
              height={900}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="size-full"
            />
          </div>

          <div className="flex flex-col justify-center gap-6 p-8 lg:p-12">
            <div>
              <p className="text-primary font-mono text-xs font-bold tracking-[0.2em] uppercase">
                {t("featuredEyebrow")}
              </p>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{vehicle.title}</h2>
                <span className="text-muted-foreground font-mono text-sm">
                  {vehicle.type} · {vehicle.year}
                </span>
              </div>
              {vehicle.tagline ? (
                <p className="text-muted-foreground mt-4 leading-relaxed">{vehicle.tagline}</p>
              ) : null}
            </div>

            {vehicle.highlights && vehicle.highlights.length > 0 ? (
              <dl className="border-border grid grid-cols-2 gap-x-6 gap-y-4 border-t pt-6 sm:grid-cols-3">
                {vehicle.highlights.map((spec) => (
                  <div key={spec.label}>
                    <dt className="text-muted-foreground text-xs tracking-wide uppercase">
                      {spec.label}
                    </dt>
                    <dd className="tabular mt-1 text-lg font-bold">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link href={{ pathname: "/vehicles/[slug]", params: { slug: vehicle.slug } }}>
                  {t("featuredCta")}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/vehicles">{t("vehiclesAll")}</Link>
              </Button>
            </div>

            <span className="sr-only">{tVehicle("specs")}</span>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
