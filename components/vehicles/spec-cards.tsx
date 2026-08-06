import { cn } from "@/lib/utils";
import { specIcon } from "@/components/vehicles/spec-icon";

type Spec = {
  label: string | null;
  value: string | null;
  icon?: string | null;
  highlight?: boolean | null;
};

/**
 * Teknik özellik kartları.
 *
 * `tone="overlay"` görselin üzerinde durur: koyu cam efektli kartlar, görselin
 * içeriğinden bağımsız okunabilsin diye kendi arka planını taşır.
 * `tone="plain"` ise görselin olmadığı (ya da dar ekranda altta akan) hâl için.
 *
 * Değerler mono/tabular — rakamlar kartlar arasında aynı hizada durur.
 */
export function SpecCards({
  specs,
  tone = "plain",
  className,
}: {
  specs: Spec[] | null;
  tone?: "overlay" | "plain";
  className?: string;
}) {
  if (!specs || specs.length === 0) return null;

  const overlay = tone === "overlay";

  return (
    <ul className={cn("grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4", className)}>
      {specs.map((spec) => {
        const Icon = specIcon(spec.icon);

        return (
          <li
            key={spec.label}
            className={cn(
              "rounded-lg border p-3",
              overlay ? "border-white/15 bg-black/45 backdrop-blur-md" : "border-border bg-surface",
              spec.highlight && (overlay ? "border-primary/50" : "border-primary/40 bg-primary/5"),
            )}
          >
            <Icon
              className={cn("size-4", overlay ? "text-primary" : "text-muted-foreground")}
              aria-hidden
            />
            <p
              className={cn(
                "mt-2.5 text-[11px] tracking-wide uppercase",
                overlay ? "text-white/60" : "text-muted-foreground",
              )}
            >
              {spec.label}
            </p>
            <p
              className={cn(
                "tabular mt-0.5 text-sm font-bold",
                overlay ? "text-white" : spec.highlight && "text-primary",
              )}
            >
              {spec.value}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
