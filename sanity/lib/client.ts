import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  /**
   * stega kapalı.
   *
   * Açıkken Sanity metinlere görünmez kaynak bilgisi gömer (Presentation
   * aracıyla sayfadan tıklayıp düzenleme için). Bunun bedeli: sanityFetch
   * dönüş tipindeki her string `StegaString<T>` ile markalanır ve typegen'in
   * ürettiği düz tiplerle uyuşmaz — enum'lar dahil ("AUV" yerine
   * StegaString<"AUV">).
   *
   * Görsel düzenleme istendiğinde burayı `stega: { studioUrl }` yapıp
   * bileşenlerdeki tipleri stega'lı sürüme geçirmek gerekir.
   */
  stega: false,
});
