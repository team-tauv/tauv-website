import {
  siGithub,
  siInstagram,
  siLinktree,
  siTiktok,
  siX,
  siYoutube,
  type SimpleIcon,
} from "simple-icons";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Marka ikonları.
 *
 * lucide-react v1 marka ikonlarını ticari marka gerekçesiyle tamamen kaldırdı,
 * bu yüzden path verisi simple-icons'tan (CC0) geliyor.
 *
 * LinkedIn istisna: simple-icons kataloğundan da kaldırıldı, hiçbir pakette
 * resmî path yok. Path'i ezberden yazmak yanlış bir glif üretme riski taşıdığı
 * için tipografik "in" işareti kullanılıyor. Resmî SVG'yi brand.linkedin.com'dan
 * indirip public/ altına koyarsanız burada onunla değiştirilebilir.
 */
const BRAND_ICONS: Record<string, SimpleIcon> = {
  instagram: siInstagram,
  tiktok: siTiktok,
  linktree: siLinktree,
  youtube: siYoutube,
  github: siGithub,
  x: siX,
};

export function SocialIcon({ platform, className }: { platform: string; className?: string }) {
  if (platform === "linkedin") {
    return (
      <span
        aria-hidden
        className={cn(
          "flex size-4 items-center justify-center rounded-[3px] border border-current font-mono text-[9px] leading-none font-bold",
          className,
        )}
      >
        in
      </span>
    );
  }

  const icon = BRAND_ICONS[platform];

  if (!icon) {
    return <Mail className={cn("size-4", className)} aria-hidden />;
  }

  return (
    <svg role="img" aria-hidden viewBox="0 0 24 24" className={cn("size-4 fill-current", className)}>
      <path d={icon.path} />
    </svg>
  );
}
