import Image from "next/image";
import type { SanityImageSource } from "@sanity/image-url";
import { urlFor, urlForCrop } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { ImageField } from "@/types";

/**
 * GROQ'tan gelen görsel projeksiyonunu next/image'a bağlar.
 *
 * Neden ara bir bileşen: sorgular `asset->{_id, lqip}` döndürüyor, oysa
 * @sanity/image-url referans biçimi (`asset._ref`) bekliyor. Dönüşüm ve
 * blur placeholder tek yerde yapılsın diye burada toplandı.
 */

function toSource(image: ImageField): SanityImageSource | null {
  if (!image?.asset?._id) return null;
  return {
    _type: "image",
    asset: { _type: "reference", _ref: image.asset._id },
    ...(image.hotspot ? { hotspot: image.hotspot } : {}),
    ...(image.crop ? { crop: image.crop } : {}),
    // Sanity'nin ürettiği tiplerde hotspot/crop içindeki sayılar opsiyonel,
    // image-url ise tamamını zorunlu sayıyor. Bu alanlar Studio'da ya hep ya
    // hiç yazıldığı için daraltma tek noktada, burada yapılıyor.
  } as SanityImageSource;
}

type BaseProps = {
  image: ImageField;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

/** Kendi oranını koruyan görsel — galeri, içerik görselleri. */
export function SanityImage({
  image,
  alt,
  className,
  sizes = "100vw",
  priority = false,
  width = 1600,
}: BaseProps & { width?: number }) {
  const source = toSource(image);
  if (!source) return null;

  const dims = image?.asset?.dimensions;
  const height = dims?.aspectRatio ? Math.round(width / dims.aspectRatio) : width;

  return (
    <Image
      src={urlFor(source).width(width).url()}
      alt={alt ?? image?.alt ?? ""}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      {...(image?.asset?.lqip ? { placeholder: "blur" as const, blurDataURL: image.asset.lqip } : {})}
    />
  );
}

/**
 * Sabit orana kırpılan görsel — kartlar, avatarlar.
 * Kırpma odak noktasına (hotspot) göre yapılır; yüzler kesilmez.
 */
export function SanityImageCropped({
  image,
  alt,
  className,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  width,
  height,
}: BaseProps & { width: number; height: number }) {
  const source = toSource(image);
  if (!source) return null;

  return (
    <Image
      src={urlForCrop(source, width, height).url()}
      alt={alt ?? image?.alt ?? ""}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={cn("object-cover", className)}
      {...(image?.asset?.lqip ? { placeholder: "blur" as const, blurDataURL: image.asset.lqip } : {})}
    />
  );
}
