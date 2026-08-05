import { useTranslations } from "next-intl";
import { SanityImage } from "@/components/shared/sanity-image";
import type { SPONSOR_MARQUEE_QUERY_RESULT } from "@/types/sanity.types";

type Sponsors = SPONSOR_MARQUEE_QUERY_RESULT;

/**
 * Kesintisiz kayan sponsor şeridi.
 *
 * Liste iki kez basılır ve şerit %50 kaydırılır — böylece döngü başa
 * döndüğünde görsel bir sıçrama olmaz. JavaScript kullanılmıyor, animasyon
 * saf CSS (globals.css içindeki --animate-marquee); bu yüzden sunucu
 * bileşeni olarak kalabiliyor ve hidrasyon maliyeti yok.
 */
export function SponsorMarquee({ sponsors }: { sponsors: Sponsors }) {
  const t = useTranslations("home");
  if (!sponsors || sponsors.length === 0) return null;

  const track = [...sponsors, ...sponsors];

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-muted-foreground text-center font-mono text-xs tracking-[0.2em] uppercase">
          {t("sponsorsEyebrow")}
        </p>
      </div>

      {/* Kenarlarda yumuşak silinme — şerit ekran dışına çıkarken kesilmesin. */}
      <div className="relative mt-8 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <ul className="animate-marquee flex w-max items-center gap-16 hover:[animation-play-state:paused]">
          {track.map((sponsor, index) => {
            const content = (
              <SanityImage
                image={sponsor.logo}
                alt={sponsor.name ?? ""}
                width={240}
                sizes="200px"
                className="h-10 w-auto opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
              />
            );

            return (
              <li key={`${sponsor._id}-${index}`} className="shrink-0">
                {sponsor.website ? (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    // Kopya öğeler ekran okuyucuda iki kez okunmasın.
                    {...(index >= sponsors.length ? { "aria-hidden": true, tabIndex: -1 } : {})}
                  >
                    {content}
                  </a>
                ) : (
                  <span {...(index >= sponsors.length ? { "aria-hidden": true } : {})}>
                    {content}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
