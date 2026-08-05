import { Award } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { FadeIn } from "@/components/shared/fade-in";
import { cn } from "@/lib/utils";
import type { ACHIEVEMENTS_QUERY_RESULT } from "@/types/sanity.types";

type Achievements = ACHIEVEMENTS_QUERY_RESULT;

export function Achievements({ achievements }: { achievements: Achievements }) {
  const t = useTranslations("sponsors");

  if (achievements.length === 0) return null;

  return (
    <section className="mt-24">
      <div className="flex items-center gap-4">
        <h2 className="text-primary font-mono text-xs font-bold tracking-[0.2em] uppercase">
          {t("achievementsTitle")}
        </h2>
        <span className="rule-glow h-px flex-1" aria-hidden />
      </div>

      <p className="text-muted-foreground mt-4 max-w-2xl text-base leading-relaxed">
        {t("achievementsDescription")}
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {achievements.map((item, index) => (
          <FadeIn
            key={item._id}
            as="li"
            index={index}
            className="border-border bg-surface flex h-full gap-4 rounded-xl border p-5"
          >
            {/* İlk üç derece altın/gümüş/bronz; gerisi ve derecesizler nötr. */}
            <Award
              className={cn(
                "mt-0.5 size-5 shrink-0",
                item.rank === 1 && "text-amber-400",
                item.rank === 2 && "text-zinc-400",
                item.rank === 3 && "text-amber-700",
                (!item.rank || item.rank > 3) && "text-primary",
              )}
              aria-hidden
            />
            <div>
              <p className="font-semibold tracking-tight">{item.name}</p>
              <p className="text-muted-foreground mt-1 text-sm leading-relaxed">{item.result}</p>
            </div>
          </FadeIn>
        ))}
      </ul>

      <p className="mt-6 text-sm">
        <Link href="/competitions" className="text-primary hover:underline">
          {t("achievementsLink")}
        </Link>
      </p>
    </section>
  );
}
