// Alt yol üzerinden: paketin kök girişi Turbopack'in statik analizinde bu
// ikonu dışa aktarmıyor, doğrudan modülü almak derlemeyi çalışır tutuyor.
import { TranslateIcon } from "@sanity/icons/Translate";
import { useToast } from "@sanity/ui";
import { useMemo, useState } from "react";
import { useDocumentOperation, type DocumentActionComponent, type SanityDocument } from "sanity";

import { localeNames, translationTargets, type Locale } from "../../lib/locales";
import {
  buildTranslationPatches,
  collectTranslationJobs,
  flattenTexts,
} from "../lib/translate-fields";

/**
 * "Eksik çevirileri doldur" doküman aksiyonu.
 *
 * Türkçe alanları yazıp bu düğmeye basmak yeterli: dokümandaki tüm
 * `internationalizedArray` alanları taranır, hedef dillerde boş olanlar
 * çevrilip taslağa yazılır. Dolu çeviriler korunur — elle düzeltilmiş bir
 * metnin üzerine yazılmaz. Sonuç taslakta kalır, yayınlamadan önce gözden
 * geçirilebilir.
 */

async function fetchTranslations(texts: string[], target: Locale): Promise<string[]> {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ texts, target }),
  });

  const payload = (await response.json().catch(() => null)) as {
    texts?: string[];
    error?: string;
  } | null;

  if (!response.ok || !payload?.texts) {
    throw new Error(payload?.error ?? `Çeviri isteği başarısız (${response.status}).`);
  }

  return payload.texts;
}

export const TranslateMissingAction: DocumentActionComponent = ({
  id,
  type,
  draft,
  published,
  onComplete,
}) => {
  const { patch } = useDocumentOperation(id, type);
  const toast = useToast();
  const [isTranslating, setIsTranslating] = useState(false);

  const doc = (draft ?? published) as SanityDocument | null;

  // Hangi dillerde ne kadar eksik var — düğmenin açıklamasını buradan yazıyoruz.
  const pending = useMemo(() => {
    if (!doc) return [];
    return translationTargets
      .map((target) => ({ target, jobs: collectTranslationJobs(doc, { target }) }))
      .filter(({ jobs }) => jobs.length > 0);
  }, [doc]);

  const fieldCount = pending.reduce((sum, { jobs }) => sum + jobs.length, 0);

  return {
    label: isTranslating ? "Çevriliyor…" : "Eksik çevirileri doldur",
    icon: TranslateIcon,
    disabled: isTranslating || fieldCount === 0,
    title:
      fieldCount === 0
        ? "Eksik çeviri yok"
        : `${pending.map(({ target }) => localeNames[target]).join(", ")} · ${fieldCount} alan`,
    onHandle: async () => {
      setIsTranslating(true);

      try {
        // Diller sırayla işleniyor: tek seferde iki isteği paralel göndermek
        // hız sınırına takılmayı kolaylaştırır, kazancı ise fark edilmez.
        for (const { target, jobs } of pending) {
          const translations = await fetchTranslations(flattenTexts(jobs), target);
          patch.execute(buildTranslationPatches(jobs, translations, target));
        }

        toast.push({
          status: "success",
          title: "Çeviriler taslağa yazıldı",
          description: `${fieldCount} alan · ${pending.map(({ target }) => localeNames[target]).join(", ")}. Yayınlamadan önce gözden geçirin.`,
        });
      } catch (error) {
        toast.push({
          status: "error",
          title: "Çeviri başarısız",
          description: error instanceof Error ? error.message : "Bilinmeyen hata.",
        });
      } finally {
        setIsTranslating(false);
        onComplete();
      }
    },
  };
};
