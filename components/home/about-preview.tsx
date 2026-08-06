import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/fade-in";
import { SanityImageCropped } from "@/components/shared/sanity-image";
import type { SITE_SETTINGS_QUERY_RESULT } from "@/types/sanity.types";

type Settings = NonNullable<SITE_SETTINGS_QUERY_RESULT>;

type AboutPreviewProps = {
  intro: Settings["aboutIntro"];
  photo: Settings["teamPhoto"];
};

/**
 * Hero'dan sonraki ilk bölüm: takımın kim olduğunu iki paragrafta anlatır ve
 * ayrıntı için /about'a yollar. Metin ve fotoğraf, Hakkımızda sayfasıyla aynı
 * alanlardan besleniyor — aynı içeriği iki yerde girmek gerekmesin.
 */
export function AboutPreview({ intro, photo }: AboutPreviewProps) {
  const t = useTranslations("home");
  const tAbout = useTranslations("about");

  if (!intro && !photo?.asset) return null;

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
        <FadeIn>
          <p className="text-primary font-mono text-xs font-bold tracking-[0.2em] uppercase">
            {tAbout("eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{t("aboutTitle")}</h2>
          <p className="text-muted-foreground mt-6 text-lg leading-relaxed">
            {intro ?? t("aboutFallback")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/about">
                {t("aboutCta")}
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/contact">{t("aboutJoin")}</Link>
            </Button>
          </div>
        </FadeIn>

        {photo?.asset ? (
          <FadeIn index={1}>
            <SanityImageCropped
              image={photo}
              alt={photo.alt || tAbout("title")}
              width={1200}
              height={900}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="border-border w-full rounded-2xl border"
            />
          </FadeIn>
        ) : null}
      </div>
    </section>
  );
}
