import { Award, FileText, MapPin } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/shared/fade-in";
import { SanityImageCropped } from "@/components/shared/sanity-image";
import { PortableText } from "@/components/shared/portable-text";
import { cn } from "@/lib/utils";
import type { COMPETITIONS_QUERY_RESULT } from "@/types/sanity.types";

type Competitions = COMPETITIONS_QUERY_RESULT;

/** İlk üç derece için rozet rengi; gerisi nötr. */
function rankTone(rank: number | null) {
  if (rank === 1) return "bg-chart-4/15 text-chart-4 border-chart-4/40";
  if (rank === 2) return "bg-muted-foreground/10 text-foreground border-border";
  if (rank === 3) return "bg-chart-5/15 text-chart-5 border-chart-5/40";
  return "bg-surface text-muted-foreground border-border";
}

export function Timeline({ competitions }: { competitions: Competitions }) {
  const t = useTranslations("competitions");
  const format = useFormatter();

  if (competitions.length === 0) {
    return (
      <p className="border-border text-muted-foreground mt-12 rounded-xl border border-dashed p-16 text-center text-sm">
        {t("empty")}
      </p>
    );
  }

  return (
    <ol className="relative mt-12">
      {/* Dikey çizgi. Mobilde solda, geniş ekranda içerikle hizalı kalıyor. */}
      <span
        aria-hidden
        className="bg-border absolute top-2 bottom-2 left-[7px] w-px sm:left-[11px]"
      />

      {competitions.map((competition, index) => (
        <FadeIn key={competition._id} as="li" index={index} className="relative pb-12 pl-8 sm:pl-12">
          <span
            aria-hidden
            className="bg-primary ring-background absolute top-1.5 left-0 size-4 rounded-full ring-4 sm:size-6"
          />

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <time
              dateTime={competition.date ?? undefined}
              className="text-primary font-mono text-xs font-bold tracking-[0.2em] uppercase"
            >
              {competition.date
                ? format.dateTime(new Date(competition.date), { month: "long", year: "numeric" })
                : competition.year}
            </time>

            {competition.rank ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-bold",
                  rankTone(competition.rank),
                )}
              >
                <Award className="size-3" aria-hidden />
                {competition.result ?? t("rankLabel", { rank: competition.rank })}
              </span>
            ) : competition.result ? (
              <span className="border-border bg-surface text-muted-foreground rounded-md border px-2 py-0.5 text-xs">
                {competition.result}
              </span>
            ) : null}
          </div>

          <h3 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">{competition.name}</h3>

          <div className="text-muted-foreground mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
            {competition.organizer ? <span>{competition.organizer}</span> : null}
            {competition.location ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-3.5" aria-hidden />
                {competition.location}
              </span>
            ) : null}
          </div>

          {competition.coverImage?.asset ? (
            <SanityImageCropped
              image={competition.coverImage}
              alt={competition.coverImage.alt || competition.name || ""}
              width={1200}
              height={600}
              sizes="(max-width: 1024px) 100vw, 800px"
              className="border-border mt-5 w-full rounded-xl border"
            />
          ) : null}

          <PortableText value={competition.description} className="mt-5 max-w-2xl" />

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {competition.technicalReport ? (
              <a
                href={competition.technicalReport}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border text-muted-foreground hover:border-primary hover:text-primary inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors"
              >
                <FileText className="size-3.5" aria-hidden />
                {t("technicalReport")}
              </a>
            ) : null}

            {competition.vehiclesUsed?.map((vehicle) =>
              vehicle.slug ? (
                <Link
                  key={vehicle._id}
                  href={{ pathname: "/vehicles/[slug]", params: { slug: vehicle.slug } }}
                  className="border-primary/30 text-primary hover:bg-primary/10 inline-flex items-center rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors"
                >
                  {vehicle.title}
                </Link>
              ) : null,
            )}
          </div>
        </FadeIn>
      ))}
    </ol>
  );
}
