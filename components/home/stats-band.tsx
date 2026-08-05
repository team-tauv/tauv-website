"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/types/sanity.types";

type Stats = NonNullable<SITE_SETTINGS_QUERY_RESULT>["stats"];

/** Görünür olunca 0'dan hedefe sayan rakam. */
function Counter({ value, suffix }: { value: number; suffix?: string | null }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, value, reduceMotion]);

  return (
    <span ref={ref} className="tabular text-primary text-4xl font-bold sm:text-5xl">
      {display}
      {suffix}
    </span>
  );
}

/** Üç metrikte dört sütun boş bir hücre bırakırdı — sütun sayısı içerikten. */
const COLUMNS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
};

type StatsBandProps = {
  stats: Stats;
  /**
   * `band` ana sayfadaki tam genişlik şerit; `card` bir bölümün içine gömülen
   * kutu (sponsorluk sayfası) — kendi yatay dolgusunu getirmez.
   */
  variant?: "band" | "card";
};

export function StatsBand({ stats, variant = "band" }: StatsBandProps) {
  if (!stats || stats.length === 0) return null;

  const grid = (
    <dl className={cn("grid grid-cols-2 gap-8", COLUMNS[stats.length] ?? "sm:grid-cols-4")}>
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col items-center text-center">
          <dt className="sr-only">{stat.label}</dt>
          <dd className="flex flex-col items-center gap-2">
            <Counter value={stat.value ?? 0} suffix={stat.suffix} />
            <span className="text-muted-foreground text-sm font-medium">{stat.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );

  if (variant === "card") {
    return (
      <section className="border-border bg-surface/40 rounded-2xl border px-6 py-10 sm:px-10">
        {grid}
      </section>
    );
  }

  return (
    <section className="border-border bg-surface/40 border-y">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{grid}</div>
    </section>
  );
}
