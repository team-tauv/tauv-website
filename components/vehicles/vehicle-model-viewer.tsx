"use client";

import { Box, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type Props = {
  src: string;
  alt: string;
  poster?: string;
};

/**
 * Su altı aracının GLB modelini gösterir.
 *
 * @google/model-viewer three.js taşıdığı için ~1 MB'lık bir paket; import
 * edildiği anda `window`a dokunduğu için SSR'da da patlar. Bu yüzden hem
 * "use client" hem de effect içinde dinamik import kullanılıyor.
 *
 * Import IntersectionObserver'a bağlı: ziyaretçi sayfanın altındaki modele
 * kadar inmezse ne kütüphane ne de GLB indiriliyor. Sayfanın geri kalanı
 * (metin, galeri, teknik tablo) hiçbir şey beklemiyor.
 */
export function VehicleModelViewer({ src, alt, poster }: Props) {
  const t = useTranslations("vehicle");
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLElement>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "error">("idle");

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    let cancelled = false;

    const load = () => {
      setState("loading");
      import("@google/model-viewer")
        .then(() => {
          if (!cancelled) setState("ready");
        })
        .catch(() => {
          if (!cancelled) setState("error");
        });
    };

    // 400px'lik marj, kullanıcı bölüme varmadan yüklemeyi başlatıyor.
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: "400px" },
    );

    observer.observe(node);

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, []);

  // GLB'nin kendisi de indirilemeyebilir; custom element'in error olayını dinliyoruz.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const handleError = () => setState("error");
    viewer.addEventListener("error", handleError);
    return () => viewer.removeEventListener("error", handleError);
  }, [state]);

  const resetCamera = () => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    viewer.setAttribute("camera-orbit", "-25deg 75deg 105%");
    viewer.setAttribute("field-of-view", "auto");
  };

  return (
    <div ref={containerRef}>
      <div className="border-border bg-surface relative aspect-video overflow-hidden rounded-xl border">
        {state === "ready" ? (
          <model-viewer
            ref={viewerRef}
            src={src}
            alt={alt}
            poster={poster}
            camera-controls
            touch-action="pan-y"
            auto-rotate
            auto-rotate-delay="3000"
            rotation-per-second="12deg"
            camera-orbit="-25deg 75deg 105%"
            min-camera-orbit="auto auto 50%"
            max-camera-orbit="auto auto 200%"
            shadow-intensity="0.6"
            exposure="1.1"
            ar
            ar-modes="webxr scene-viewer quick-look"
            className="size-full"
            style={{ backgroundColor: "transparent" }}
          />
        ) : (
          <div className="text-muted-foreground absolute inset-0 flex flex-col items-center justify-center gap-3 text-sm">
            {poster ? (
              /* Poster dekoratif: asıl açıklama hazır olduğunda model-viewer'ın alt'ında. */
              // eslint-disable-next-line @next/next/no-img-element
              <img src={poster} alt="" className="absolute inset-0 size-full object-contain" />
            ) : null}
            <div className="bg-background/70 relative flex items-center gap-2 rounded-lg px-3 py-2 backdrop-blur-sm">
              <Box className={state === "loading" ? "size-4 animate-pulse" : "size-4"} aria-hidden />
              {state === "error" ? t("model3dError") : t("model3dLoading")}
            </div>
          </div>
        )}
      </div>

      <div className="text-muted-foreground mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <p>{t("model3dHint")}</p>
        {state === "ready" ? (
          <button
            type="button"
            onClick={resetCamera}
            className="border-border hover:border-primary hover:text-primary inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 transition-colors"
          >
            <RotateCcw className="size-3.5" aria-hidden />
            {t("model3dReset")}
          </button>
        ) : null}
      </div>
    </div>
  );
}
