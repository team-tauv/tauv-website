import { Check, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { FadeIn } from "@/components/shared/fade-in";
import { TIER_VALUES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import type { SPONSORSHIP_PACKAGES_QUERY_RESULT } from "@/types/sanity.types";

type Packages = SPONSORSHIP_PACKAGES_QUERY_RESULT;

/**
 * Katman rozetinin rengi. Tema değişkenlerine bağlanmadı: bunlar madalya
 * renkleri, açık/koyu temada aynı kalmaları gerekiyor.
 */
const TIER_ACCENT: Record<string, string> = {
  main: "text-primary",
  platinum: "text-slate-300",
  gold: "text-amber-400",
  silver: "text-zinc-400",
  bronze: "text-amber-700",
  supplier: "text-muted-foreground",
};

/** "Her satır bir madde" alanını listeye çevirir; boş satırları atar. */
function toLines(value: string | null): string[] {
  if (!value) return [];
  return value
    .split("\n")
    .map((line) => line.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
}

export function SponsorshipPackages({ packages }: { packages: Packages }) {
  const t = useTranslations("tiers");
  const tSponsors = useTranslations("sponsors");

  if (packages.length === 0) return null;

  // Sıralama GROQ'ta değil burada: doğru sıra alfabetik değil, TIER_VALUES.
  const ordered = [...packages].sort(
    (a, b) => TIER_VALUES.indexOf(a.tier!) - TIER_VALUES.indexOf(b.tier!),
  );

  return (
    <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {ordered.map((pkg, index) => {
        const benefits = toLines(pkg.benefits);
        const accent = TIER_ACCENT[pkg.tier ?? ""] ?? TIER_ACCENT.supplier!;

        return (
          <FadeIn
            key={pkg._id}
            as="li"
            index={index}
            className={cn(
              "bg-surface flex flex-col rounded-2xl border p-6",
              pkg.featured ? "border-primary/60 shadow-primary/10 shadow-lg" : "border-border",
            )}
          >
            <div className="flex items-center gap-2">
              <Star className={cn("size-4 shrink-0 fill-current", accent)} aria-hidden />
              <h3 className="font-mono text-xs font-bold tracking-[0.2em] uppercase">
                {t(pkg.tier ?? "supplier")}
              </h3>
            </div>

            <p className="mt-3 text-xl font-bold tracking-tight tabular-nums">
              {pkg.priceLabel ?? tSponsors("packagePriceOnRequest")}
            </p>

            <ul className="mt-5 flex-1 space-y-3 text-sm leading-relaxed">
              {benefits.map((benefit) => (
                <li key={benefit} className="flex gap-2.5">
                  <Check className="text-primary mt-0.5 size-4 shrink-0" aria-hidden />
                  <span className="text-muted-foreground">{benefit}</span>
                </li>
              ))}
            </ul>

            {pkg.note ? (
              <p className="border-border text-muted-foreground mt-5 border-t pt-4 text-xs leading-relaxed">
                {pkg.note}
              </p>
            ) : null}
          </FadeIn>
        );
      })}
    </ul>
  );
}
