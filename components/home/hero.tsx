import { ArrowRight, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SanityImageCropped } from "@/components/shared/sanity-image";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/types/sanity.types";

type HeroProps = {
  title?: string | null;
  tagline?: string | null;
  videoUrl?: string | null;
  poster?: NonNullable<SITE_SETTINGS_QUERY_RESULT>["heroPoster"];
};

export function Hero({ title, tagline, videoUrl, poster }: HeroProps) {
  const t = useTranslations("hero");

  return (
    <section className="bg-abyss relative flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden">
      {/* Arka plan katmanı: video > poster > salt gradyan. Hepsi opsiyonel,
          CMS boşken de sayfa düzgün görünür. */}
      <div className="absolute inset-0 -z-10">
        {videoUrl ? (
          <video
            className="size-full object-cover opacity-40"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            {...(poster?.asset ? {} : {})}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : poster?.asset ? (
          <SanityImageCropped
            image={poster}
            alt=""
            width={1920}
            height={1080}
            priority
            sizes="100vw"
            className="size-full opacity-35"
          />
        ) : null}

        {/* Alt kenara doğru koyulaşan perde — metin her zaman okunur kalsın. */}
        <div className="from-background via-background/70 absolute inset-0 bg-gradient-to-t to-transparent" />
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-primary animate-fade-up font-mono text-xs font-bold tracking-[0.25em] uppercase">
            TEKNOFEST · TAC Challenge
          </p>

          <h1 className="animate-fade-up mt-6 text-4xl leading-[1.1] font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {title ?? t("titleFallback")}
          </h1>

          <p className="text-primary animate-fade-up mt-6 font-mono text-lg sm:text-xl">
            {tagline ?? t("taglineFallback")}
          </p>

          <div className="animate-fade-up mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/vehicles">
                {t("ctaVehicles")}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/sponsors">{t("ctaSponsor")}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div
        aria-hidden
        className="text-muted-foreground absolute inset-x-0 bottom-6 flex flex-col items-center gap-1.5"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase">{t("scrollHint")}</span>
        <ChevronDown className="size-4 animate-bounce" />
      </div>
    </section>
  );
}
