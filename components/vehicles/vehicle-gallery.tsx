"use client";

import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { SanityImage } from "@/components/shared/sanity-image";
import { cn } from "@/lib/utils";
import type { VEHICLE_BY_SLUG_QUERY_RESULT } from "@/types/sanity.types";

type Gallery = NonNullable<VEHICLE_BY_SLUG_QUERY_RESULT>["gallery"];

export function VehicleGallery({ images }: { images: Gallery }) {
  const t = useTranslations("vehicle");
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  /**
   * Effect yalnızca abone oluyor, gövdesinde setState çağırmıyor.
   *
   * Nokta sayısını embla'nın scrollSnapList()'inden state'e almak fazladan bir
   * render turu doğuruyordu; basis-full slaytlarda snap sayısı zaten görsel
   * sayısına eşit olduğu için doğrudan images.length kullanılıyor.
   * Başlangıç değeri 0 ve embla da ilk slayttan başlıyor, senkron okumaya
   * gerek yok.
   */
  useEffect(() => {
    if (!emblaApi) return;
    const handleSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", handleSelect).on("reInit", handleSelect);
    return () => {
      emblaApi.off("select", handleSelect).off("reInit", handleSelect);
    };
  }, [emblaApi]);

  if (!images || images.length === 0) return null;

  // Tek görselde kaydırma kontrolleri anlamsız — düz basıp çıkıyoruz.
  const single = images.length === 1;

  return (
    <section aria-label={t("gallery")}>
      <div className="overflow-hidden rounded-xl" ref={single ? undefined : emblaRef}>
        <div className={cn("flex", single && "block")}>
          {images.map((image, index) => (
            <figure
              key={image.asset?._id ?? index}
              className={cn("min-w-0 shrink-0 grow-0 basis-full", !single && "pr-3")}
            >
              <SanityImage
                image={image}
                alt={image.alt || ""}
                width={1400}
                sizes="(max-width: 1024px) 100vw, 800px"
                className="border-border w-full rounded-xl border"
              />
              {image.caption ? (
                <figcaption className="text-muted-foreground mt-3 text-sm">
                  {image.caption}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      </div>

      {single ? null : (
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label={t("prevImage")}
              className="border-border text-muted-foreground hover:border-primary hover:text-primary flex size-9 items-center justify-center rounded-lg border transition active:scale-90 active:duration-75"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label={t("nextImage")}
              className="border-border text-muted-foreground hover:border-primary hover:text-primary flex size-9 items-center justify-center rounded-lg border transition active:scale-90 active:duration-75"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <div className="flex gap-1.5">
            {images.map((image, index) => (
              <button
                key={image.asset?._id ?? index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={t("goToImage", { number: index + 1 })}
                aria-current={index === selected ? "true" : undefined}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-400",
                  index === selected ? "bg-primary w-6" : "bg-border hover:bg-input w-1.5",
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
