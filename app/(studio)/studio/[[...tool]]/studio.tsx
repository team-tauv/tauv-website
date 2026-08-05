"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * Studio istemci sınırının bu tarafında durur.
 *
 * Neden ayrı dosya: page.tsx sunucu bileşeni, ve sanity.config oradan
 * import edilirse tüm Studio bundle'ı RSC grafiğine giriyor. O grafikte
 * paketler `react-server` koşuluyla çözülüyor; swr'ın react-server sürümünde
 * default export olmadığı için derleme "Export default doesn't exist" ile
 * kırılıyor. Bu sarmalayıcı zinciri istemci tarafında kesiyor.
 */
export default function Studio() {
  return <NextStudio config={config} />;
}
