import type {
  SanityImageCrop,
  SanityImageDimensions,
  SanityImageHotspot,
} from "./sanity.types";

/**
 * GROQ projeksiyonlarımızın döndürdüğü görsel biçimi.
 *
 * `asset._id` ile referans yeniden kurulur; `lqip` next/image'ın blur
 * placeholder'ı olarak doğrudan kullanılır (ek istek yok).
 *
 * `dimensions` alanı Sanity'nin ürettiği tipten alınır — orada width/height
 * opsiyoneldir, çünkü metadata çıkarılamayan varlıklar (örn. bozuk yükleme)
 * olabilir. Kendi elimizle zorunlu yazsaydık atama uyuşmazlığı çıkardı.
 */
export type ImageField =
  | {
      asset: {
        _id: string;
        lqip: string | null;
        dimensions: SanityImageDimensions | null;
      } | null;
      hotspot?: SanityImageHotspot;
      crop?: SanityImageCrop;
      alt?: string | null;
      _type?: "image";
    }
  | null
  | undefined;

export type { Locale } from "../lib/locales";
