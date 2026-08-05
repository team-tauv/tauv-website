import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionHeadingProps = {
  /** Başlığın üstünde küçük turkuaz etiket. */
  eyebrow?: string;
  title: string;
  description?: string;
  /** Sağ tarafa yerleşen "Tümünü gör" bağlantısı gibi öğeler. */
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centered ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "flex flex-col items-center")}>
        {eyebrow ? (
          <p className="text-primary font-mono text-xs font-bold tracking-[0.2em] uppercase">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        {description ? (
          <p className="text-muted-foreground mt-4 text-base leading-relaxed">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
