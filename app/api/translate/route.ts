import { z } from "zod";

import { locales } from "@/lib/locales";
import { MAX_CHARS, TranslationError, translateTexts } from "@/lib/translate";

/**
 * Studio'daki "Eksik çevirileri doldur" aksiyonunun çağırdığı uç nokta.
 * Yalnızca düz metin alır, düz metin döndürür — hangi alanın nereye yazılacağı
 * Studio tarafının işi (`sanity/lib/translate-fields.ts`).
 *
 * Erişim: aynı origin kontrolü + IP başına basit hız sınırı + boyut tavanı.
 * Studio çerezi sanity.io alan adında durduğu için burada gerçek bir kullanıcı
 * doğrulaması yapılamıyor; koruma, anahtarın kotasını tüketecek kaba kullanımı
 * engellemeye yönelik. Kota aşımı ücret doğurmuyor, servis yalnızca 429 veriyor.
 */

export const runtime = "nodejs";

const requestSchema = z.object({
  texts: z.array(z.string()).min(1).max(500),
  target: z.enum(locales),
});

/** IP başına 1 dakikada izin verilen istek sayısı. */
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;

// Sunucu örneği başına tutuluyor; birden fazla örnek çalışırsa sınır örnek
// başına uygulanır. Bu ölçekte yeterli, kalıcı bir depo eklemeye değmez.
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  // Origin başlığı yoksa (tarayıcı dışı istemci) engellemiyoruz; asıl kapı
  // hız sınırı. Varsa isteğin gittiği host ile eşleşmek zorunda.
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json({ error: "Geçersiz origin." }, { status: 403 });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Çok fazla istek. Bir dakika sonra tekrar deneyin." },
      { status: 429 },
    );
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return Response.json({ error: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const { texts, target } = parsed.data;

  const totalChars = texts.reduce((sum, text) => sum + text.length, 0);
  if (totalChars > MAX_CHARS) {
    return Response.json(
      { error: `Metin çok uzun (${totalChars} karakter). Dokümanı bölerek çevirin.` },
      { status: 413 },
    );
  }

  try {
    return Response.json({ texts: await translateTexts(texts, target) });
  } catch (error) {
    if (error instanceof TranslationError) {
      console.error("Çeviri hatası:", error.message);
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error("Beklenmeyen çeviri hatası:", error);
    return Response.json(
      { error: "Çeviri sırasında beklenmeyen bir hata oluştu." },
      { status: 500 },
    );
  }
}
