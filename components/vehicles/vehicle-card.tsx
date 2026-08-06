import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SanityImageCropped } from "@/components/shared/sanity-image";
import type { VEHICLES_QUERY_RESULT } from "@/types/sanity.types";

type Vehicle = VEHICLES_QUERY_RESULT[number];

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const t = useTranslations("vehicle");
  if (!vehicle.slug) return null;

  return (
    <Link
      href={{ pathname: "/vehicles/[slug]", params: { slug: vehicle.slug } }}
      className="group border-border bg-surface hover:border-primary/50 hover:shadow-glow relative flex flex-col overflow-hidden rounded-xl border transition duration-300 hover:-translate-y-1"
    >
      <div className="bg-background relative aspect-4/3 overflow-hidden">
        <SanityImageCropped
          image={vehicle.mainImage}
          alt={vehicle.mainImage?.alt || vehicle.title || ""}
          width={800}
          height={600}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="size-full transition-transform duration-500 group-hover:scale-105"
        />
        <span className="bg-background/80 text-primary absolute top-3 left-3 rounded-md px-2.5 py-1 font-mono text-xs font-bold backdrop-blur-sm">
          {vehicle.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-xl font-bold tracking-tight">{vehicle.title}</h3>
          <span className="text-muted-foreground shrink-0 font-mono text-sm">{vehicle.year}</span>
        </div>

        {vehicle.tagline ? (
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{vehicle.tagline}</p>
        ) : null}

        {vehicle.highlights && vehicle.highlights.length > 0 ? (
          <dl className="border-border mt-4 grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-4">
            {vehicle.highlights.map((spec) => (
              <div key={spec.label}>
                <dt className="text-muted-foreground text-xs">{spec.label}</dt>
                <dd className="tabular text-foreground text-sm font-bold">{spec.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <span className="text-primary mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium">
          {t("detail")}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
