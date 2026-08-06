import { localeNames, type Locale } from "./locales";

/**
 * Sunucu tarafı çeviri motoru. Yalnızca `app/api/translate/route.ts` çağırır —
 * API anahtarı tarayıcıya sızmasın diye burası hiçbir yerden import edilmemeli.
 *
 * Sağlayıcı Google AI Studio (Gemini): anahtar ücretsiz alınıyor, kredi kartı
 * istemiyor ve bu sitenin hacmi ücretsiz kotanın çok altında kalıyor. Başka bir
 * sağlayıcıya geçmek istenirse değişecek tek yer `requestTranslations`.
 */

/**
 * Sürüm numarası yerine `-latest` takma adı: Google eski sürümleri yeni
 * anahtarlara kapatıyor (gemini-2.5-flash bu yüzden 404 vermeye başladı) ve
 * takma ad her zaman güncel flash modeline işaret ediyor.
 */
const MODEL = process.env.GEMINI_MODEL ?? "gemini-flash-latest";

/** Tek istekte gönderilen metin sayısı. Uzun dokümanlar parçalara bölünür. */
const BATCH_SIZE = 60;

export const MAX_CHARS = 40_000;

export class TranslationError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "TranslationError";
  }
}

/**
 * Modelin dokümanın bağlamını bilmesi çeviri kalitesini belirgin biçimde
 * değiştiriyor: "araç" burada "vehicle", "takım" "team", "kart" bir arayüz
 * öğesi. Terim listesi de bu yüzden var.
 */
function buildPrompt(texts: string[], target: Locale): string {
  const targetName = localeNames[target];

  return [
    `You translate website content for TAUV, the unmanned underwater systems team of the Turkish-German University (Türk-Alman Üniversitesi), from Turkish into ${targetName}.`,
    "",
    "Rules:",
    `- Return exactly ${texts.length} translations, in the same order as the input.`,
    "- Translate each item independently. An item may be a sentence fragment from rich text; keep it a fragment.",
    "- Keep the tone professional, concise and factual, as on an engineering team's website.",
    "- Do not translate proper nouns: TAUV, vehicle names, sponsor names, competition names (TEKNOFEST, TAC Challenge, RoboSub), university department names in their official form.",
    `- "Türk-Alman Üniversitesi" is rendered as ${
      target === "de" ? '"Türkisch-Deutsche Universität"' : '"Turkish-German University"'
    }.`,
    "- Keep numbers, units, punctuation, capitalisation style, and leading/trailing whitespace.",
    "- Never add explanations, notes or quotation marks around the output.",
    "",
    "Input (JSON array of Turkish strings):",
    JSON.stringify(texts),
  ].join("\n");
}

async function requestTranslations(texts: string[], target: Locale): Promise<string[]> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new TranslationError("GEMINI_API_KEY tanımlı değil.", 503);
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: buildPrompt(texts, target) }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: "application/json",
          responseSchema: { type: "ARRAY", items: { type: "STRING" } },
          // Çeviri akıl yürütme gerektirmiyor; en düşük düzey hem hızlı hem
          // kotaya nazik. Gemini 3 sonrasında `thinkingBudget` yerine
          // `thinkingLevel` bekleniyor — eskisi 400 döndürüyor.
          thinkingConfig: { thinkingLevel: "minimal" },
        },
      }),
    },
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new TranslationError(
      `Çeviri servisi ${response.status} döndürdü.${detail ? ` ${detail.slice(0, 300)}` : ""}`,
      response.status === 429 ? 429 : 502,
    );
  }

  const payload = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const raw = payload.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!raw) throw new TranslationError("Çeviri servisi boş yanıt döndürdü.", 502);

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new TranslationError("Çeviri servisi geçersiz JSON döndürdü.", 502);
  }

  if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== "string")) {
    throw new TranslationError("Çeviri servisi beklenen biçimde yanıt vermedi.", 502);
  }

  // Uzunluk tutmazsa hizalama kayar ve çeviriler yanlış alanlara yazılır;
  // eksik çeviriyle devam etmektense hata vermek daha güvenli.
  if (parsed.length !== texts.length) {
    throw new TranslationError(
      `Çeviri sayısı uyuşmadı: ${texts.length} metin gönderildi, ${parsed.length} yanıt geldi.`,
      502,
    );
  }

  return parsed as string[];
}

/** Metinleri sırayı koruyarak hedef dile çevirir. */
export async function translateTexts(texts: string[], target: Locale): Promise<string[]> {
  const results: string[] = [];

  for (let index = 0; index < texts.length; index += BATCH_SIZE) {
    const batch = texts.slice(index, index + BATCH_SIZE);
    results.push(...(await requestTranslations(batch, target)));
  }

  return results;
}
