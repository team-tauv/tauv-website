import createMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

/**
 * Next 16'da `middleware.ts` sözleşmesi yerini `proxy.ts`'e bıraktı; dosya adı
 * dışında davranış aynı. next-intl tarafındaki fabrikanın adı hâlâ
 * createMiddleware olduğu için import değişmedi.
 */
export default createMiddleware(routing);

export const config = {
  /**
   * Sanity Studio (/studio), Next iç dosyaları ve statik varlıklar locale
   * yönlendirmesinin dışında tutulur.
   */
  matcher: ["/((?!api|studio|_next|_vercel|.*\\..*).*)"],
};
