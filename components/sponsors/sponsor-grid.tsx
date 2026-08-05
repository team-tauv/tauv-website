import { useTranslations } from "next-intl";
import { SanityImage } from "@/components/shared/sanity-image";
import { FadeIn } from "@/components/shared/fade-in";
import { TIER_VALUES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import type { SPONSORS_QUERY_RESULT } from "@/types/sanity.types";

type Sponsors = SPONSORS_QUERY_RESULT;

/**
 * Katman yükseldikçe logo büyür ve satır başına daha az sponsor düşer —
 * hiyerarşi yazıyla değil, yerleşimle anlatılıyor.
 */
const TIER_LAYOUT: Record<string, { grid: string; logo: string }> = {
  main: { grid: "grid-cols-1 sm:grid-cols-2", logo: "h-20 sm:h-24" },
  gold: { grid: "grid-cols-2 sm:grid-cols-3", logo: "h-16" },
  silver: { grid: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4", logo: "h-12" },
  bronze: { grid: "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5", logo: "h-10" },
  supplier: { grid: "grid-cols-3 sm:grid-cols-5 lg:grid-cols-6", logo: "h-9" },
};

export function SponsorGrid({ sponsors }: { sponsors: Sponsors }) {
  const t = useTranslations("tiers");
  const tSponsors = useTranslations("sponsors");

  if (sponsors.length === 0) {
    return (
      <p className="border-border text-muted-foreground mt-12 rounded-xl border border-dashed p-16 text-center text-sm">
        {tSponsors("empty")}
      </p>
    );
  }

  return (
    <div className="mt-12 space-y-16">
      {TIER_VALUES.map((tier) => {
        const group = sponsors.filter((sponsor) => sponsor.tier === tier);
        if (group.length === 0) return null;

        const layout = TIER_LAYOUT[tier] ?? TIER_LAYOUT.supplier!;

        return (
          <section key={tier}>
            <div className="flex items-center gap-4">
              <h2 className="text-primary font-mono text-xs font-bold tracking-[0.2em] uppercase">
                {t(tier)}
              </h2>
              <span className="rule-glow h-px flex-1" aria-hidden />
            </div>

            <ul className={cn("mt-6 grid gap-4", layout.grid)}>
              {group.map((sponsor, index) => {
                const logo = (
                  <SanityImage
                    image={sponsor.logo}
                    alt={sponsor.name ?? ""}
                    width={480}
                    sizes="(max-width: 640px) 40vw, 240px"
                    className={cn(
                      "w-auto max-w-full object-contain opacity-75 transition-opacity group-hover:opacity-100",
                      layout.logo,
                    )}
                  />
                );

                return (
                  <FadeIn key={sponsor._id} as="li" index={index}>
                    {sponsor.website ? (
                      <a
                        href={sponsor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group border-border bg-surface hover:border-primary/50 flex h-full items-center justify-center rounded-xl border p-6 transition-colors"
                      >
                        {logo}
                        <span className="sr-only">{sponsor.name}</span>
                      </a>
                    ) : (
                      <div className="group border-border bg-surface flex h-full items-center justify-center rounded-xl border p-6">
                        {logo}
                      </div>
                    )}
                  </FadeIn>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
