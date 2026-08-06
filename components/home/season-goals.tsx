import { CalendarDays, MapPin, Target } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { cn } from "@/lib/utils";
import type { TARGET_COMPETITIONS_QUERY_RESULT } from "@/types/sanity.types";

type Targets = TARGET_COMPETITIONS_QUERY_RESULT;

/** Sezonda 3'ten fazla hedef olabilir — sütun sayısı içerikten geliyor. */
const COLUMNS: Record<number, string> = {
  1: "md:grid-cols-1 md:max-w-2xl",
  2: "md:grid-cols-2",
};

/**
 * Hedeflerin kapsadığı yıllardan sezon etiketi üretir: hepsi aynı yıldaysa
 * "2026", yıla yayılıyorsa "2026–2027".
 */
function seasonLabel(targets: Targets): string | null {
  const years = targets.map((item) => item.year).filter((year): year is number => Boolean(year));
  if (years.length === 0) return null;

  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min}–${max}`;
}

export function SeasonGoals({ targets }: { targets: Targets }) {
  const t = useTranslations("home");
  const format = useFormatter();

  if (targets.length === 0) return null;

  const season = seasonLabel(targets);

  return (
    <section className="border-border bg-surface/40 border-y py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={season ? t("goalsEyebrow", { season }) : t("goalsEyebrowPlain")}
          title={t("goalsTitle")}
          description={t("goalsDescription")}
          action={
            <Button asChild variant="ghost">
              <Link href="/competitions">{t("goalsAll")}</Link>
            </Button>
          }
        />

        <ul className={cn("mt-12 grid gap-6 md:grid-cols-3", COLUMNS[targets.length])}>
          {targets.map((target, index) => (
            <FadeIn
              key={target._id}
              as="li"
              index={index}
              className="border-border bg-background flex flex-col gap-4 rounded-2xl border p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <Target className="text-primary size-5 shrink-0" aria-hidden />
                <span className="text-muted-foreground/60 font-mono text-xs font-bold tracking-[0.2em]">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold tracking-tight">{target.name}</h3>
                {target.organizer ? (
                  <p className="text-muted-foreground mt-1 text-sm">{target.organizer}</p>
                ) : null}
              </div>

              <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
                {target.date ? (
                  <time
                    dateTime={target.date}
                    className="inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <CalendarDays className="size-3.5" aria-hidden />
                    {format.dateTime(new Date(target.date), { month: "long", year: "numeric" })}
                  </time>
                ) : null}
                {target.location ? (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5" aria-hidden />
                    {target.location}
                  </span>
                ) : null}
              </div>

              {target.goal ? (
                <p className="border-border mt-auto border-t pt-4 text-sm leading-relaxed">
                  {target.goal}
                </p>
              ) : null}
            </FadeIn>
          ))}
        </ul>
      </div>
    </section>
  );
}
