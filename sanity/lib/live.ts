import { defineLive } from "next-sanity/live";
import { client } from "./client";
import { readToken } from "../env";

/**
 * İçerik güncellendiğinde ilgili sayfaların önbelleğini Sanity kendisi
 * geçersiz kılar — elle webhook/tag yönetimi gerekmez.
 *
 * Token yoksa (örn. ilk kurulumda) sanityFetch yine çalışır; yalnızca canlı
 * güncelleme ve taslak önizleme devre dışı kalır, build kırılmaz.
 */
export const { sanityFetch, SanityLive } = defineLive({
  client,
  browserToken: readToken || undefined,
  serverToken: readToken || undefined,
});

/**
 * Her sanityFetch çağrısına geçilecek sabit seçenekler.
 *
 * `stega: false` literal olarak verilmek zorunda: atlanırsa react-server
 * ortamında stega kendiliğinden açılıyor ve dönen her string `StegaString<T>`
 * ile markalanıyor — typegen'in ürettiği düz tiplerle uyuşmuyor.
 * (defineLive'ın kendi seçeneği değil, çağrı başına veriliyor.)
 */
export const FETCH_OPTIONS = { stega: false } as const;
