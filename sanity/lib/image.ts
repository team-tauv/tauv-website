import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Sanity görselinden URL üretir. Odak noktası (hotspot) ayarlanmış görsellerde
 * kırpma otomatik olarak o noktayı merkeze alır — takım fotoğraflarında yüzün
 * kesilmemesi bununla sağlanır.
 */
export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format").fit("max");
}

/** Kart/afiş gibi sabit oranlı yerler için: hotspot'a göre kırpar. */
export function urlForCrop(source: SanityImageSource, width: number, height: number) {
  return builder.image(source).width(width).height(height).fit("crop").crop("focalpoint").auto("format");
}

/**
 * next/image'ın blur placeholder'ı için küçük, bulanık bir önizleme.
 * Sanity tarafında üretildiği için ek bir derleme adımı gerektirmez.
 */
export function blurDataUrl(source: SanityImageSource) {
  return builder.image(source).width(24).quality(20).blur(50).auto("format").url();
}
