import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { defaultLocale } from "@/lib/locales";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import { VEHICLES_QUERY } from "@/sanity/lib/queries";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { VehicleCard } from "@/components/vehicles/vehicle-card";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "vehicle" });
  return { title: t("listTitle"), description: t("listDescription") };
}

export default async function VehiclesPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "vehicle" });
  const { data: vehicles } = await sanityFetch({
    query: VEHICLES_QUERY,
    params: { locale, defaultLocale },
    ...FETCH_OPTIONS,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow={t("listEyebrow")}
        title={t("listTitle")}
        description={t("listDescription")}
      />

      {vehicles.length === 0 ? (
        <p className="border-border text-muted-foreground mt-12 rounded-xl border border-dashed p-16 text-center text-sm">
          {t("empty")}
        </p>
      ) : (
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((vehicle, index) => (
            <FadeIn key={vehicle._id} as="li" index={index}>
              <VehicleCard vehicle={vehicle} />
            </FadeIn>
          ))}
        </ul>
      )}
    </div>
  );
}
