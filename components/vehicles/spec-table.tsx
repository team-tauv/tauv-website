import { cn } from "@/lib/utils";

type Spec = {
  label: string | null;
  value: string | null;
  highlight?: boolean | null;
};

/**
 * Teknik özellik tablosu.
 *
 * <table> değil <dl> kullanılıyor: veri iki sütunlu bir ızgara değil,
 * etiket-değer çiftleri. Ekran okuyucu "Ağırlık: 32 kg" diye okur, tablo
 * gezinme moduna girmez.
 * Değerler mono fontta ve tabular-nums ile — rakamlar alt alta hizalanır.
 */
export function SpecTable({ specs, className }: { specs: Spec[] | null; className?: string }) {
  if (!specs || specs.length === 0) return null;

  return (
    <dl className={cn("border-border divide-border divide-y border-y", className)}>
      {specs.map((spec) => (
        <div
          key={spec.label}
          className={cn(
            "flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-3.5",
            spec.highlight && "bg-primary/5 -mx-4 px-4",
          )}
        >
          <dt className="text-muted-foreground text-sm">{spec.label}</dt>
          <dd className={cn("tabular text-sm font-bold", spec.highlight && "text-primary")}>
            {spec.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
