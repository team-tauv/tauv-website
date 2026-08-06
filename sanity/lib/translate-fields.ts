/**
 * Bir dokümanın içindeki `internationalizedArray*` alanlarını gezip eksik
 * çevirileri bulur ve çeviri sonuçlarını Sanity patch'lerine dönüştürür.
 *
 * Saf fonksiyonlar: ne ağ çağrısı yapar ne Studio API'sine dokunur. Çeviri
 * motoru `app/api/translate/route.ts` tarafında; buradaki iş yalnızca "hangi
 * metinler gidecek, dönen metinler nereye yazılacak" sorusunu cevaplamak.
 */

import { defaultLocale, type Locale } from "../../lib/locales";

/** `internationalizedArrayStringValue`, `...TextValue`, `...BlockContentValue` */
const ITEM_TYPE_PATTERN = /^internationalizedArray(.+)Value$/;

type Keyed = { _key: string; [key: string]: unknown };

type IntlItem = Keyed & {
  _type: string;
  language?: string;
  value?: unknown;
};

type Span = { _type?: string; text?: string; [key: string]: unknown };
type Block = { _type?: string; children?: Span[]; [key: string]: unknown };

export type TranslationJob = {
  /** Patch yolu, dizinin kendisi: `title` veya `specs[_key=="ab12"].label` */
  path: string;
  /** Yeni öğe eklenirken kullanılacak `_type`. */
  itemType: string;
  /** Değeri boş olan hedef öğe varsa onun `_key`i; yoksa yeni öğe eklenir. */
  targetKey: string | null;
  kind: "text" | "blocks";
  /** Kaynak değer — düz metin ya da Portable Text bloğu dizisi. */
  source: string | Block[];
  /** Çeviriye gönderilecek düz metinler. Blok içerikte her span ayrı bir metin. */
  texts: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isKeyed(value: unknown): value is Keyed {
  return isRecord(value) && typeof value._key === "string";
}

/** Dizi, eklentinin ürettiği çeviri dizisi mi? Öğelerin `_type`ine bakılır. */
function isIntlArray(value: unknown[]): value is IntlItem[] {
  return (
    value.length > 0 &&
    value.every(
      (item) =>
        isRecord(item) && typeof item._type === "string" && ITEM_TYPE_PATTERN.test(item._type),
    )
  );
}

/**
 * Eklentinin v5 veri biçiminde dil ayrı bir `language` alanında tutulur; eski
 * dokümanlarda `_key` dilin kendisi olabiliyor. İkisini de kabul ediyoruz.
 */
function languageOf(item: IntlItem): string | undefined {
  return typeof item.language === "string" ? item.language : item._key;
}

function isEmptyValue(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  return false;
}

/**
 * Portable Text içindeki çevrilebilir metinleri tek bir sırada gezer.
 * `replace` ne döndürürse onunla değiştirilmiş yeni bir kopya üretir — bu
 * sayede aynı fonksiyon hem toplama (metni olduğu gibi döndür) hem yazma
 * (sıradaki çeviriyi döndür) için kullanılabiliyor, iki gezinti birebir aynı
 * sırayı görüyor.
 *
 * `_key` alanları korunur: anahtarlar yalnızca kendi dizileri içinde tekil
 * olmak zorunda, ve `markDefs` bağlantıları bu anahtarlara dayanıyor.
 */
function mapBlockStrings(blocks: Block[], replace: (text: string) => string): Block[] {
  return blocks.map((block) => {
    if (block._type === "block" && Array.isArray(block.children)) {
      return {
        ...block,
        children: block.children.map((child) =>
          typeof child.text === "string" && child.text.trim() !== ""
            ? { ...child, text: replace(child.text) }
            : child,
        ),
      };
    }

    // Görsellerin alternatif metni ve açıklaması da çevrilir.
    if (block._type === "image") {
      const next: Block = { ...block };
      for (const field of ["alt", "caption"] as const) {
        const text = next[field];
        if (typeof text === "string" && text.trim() !== "") next[field] = replace(text);
      }
      return next;
    }

    return block;
  });
}

function collectBlockTexts(blocks: Block[]): string[] {
  const texts: string[] = [];
  mapBlockStrings(blocks, (text) => {
    texts.push(text);
    return text;
  });
  return texts;
}

function fillBlockTexts(blocks: Block[], translations: string[]): Block[] {
  let index = 0;
  return mapBlockStrings(blocks, () => translations[index++] ?? "");
}

function inspectIntlArray(
  items: IntlItem[],
  path: string,
  options: CollectOptions,
): TranslationJob | null {
  const { source, target, overwrite } = options;

  const sourceItem = items.find((item) => languageOf(item) === source);
  if (!sourceItem || isEmptyValue(sourceItem.value)) return null;

  const targetItem = items.find((item) => languageOf(item) === target);
  if (targetItem && !isEmptyValue(targetItem.value) && !overwrite) return null;

  const itemType = sourceItem._type;
  const isBlocks = itemType.endsWith("BlockContentValue");

  if (isBlocks) {
    const blocks = sourceItem.value as Block[];
    const texts = collectBlockTexts(blocks);
    if (texts.length === 0) return null;
    return {
      path,
      itemType,
      targetKey: targetItem?._key ?? null,
      kind: "blocks",
      source: blocks,
      texts,
    };
  }

  const text = sourceItem.value as string;
  return {
    path,
    itemType,
    targetKey: targetItem?._key ?? null,
    kind: "text",
    source: text,
    texts: [text],
  };
}

type CollectOptions = {
  source: string;
  target: string;
  /** Dolu hedef alanların üzerine de yazılsın mı? */
  overwrite: boolean;
};

/**
 * Dokümanı baştan sona gezip çevrilmesi gereken alanları toplar. `seo` gibi
 * iç nesnelerin ve `specs`, `stats` gibi nesne dizilerinin içindekiler de
 * bulunur — bu yüzden şemaya bakmadan, veriye bakarak çalışıyor.
 */
export function collectTranslationJobs(
  doc: Record<string, unknown>,
  options: Partial<CollectOptions> & { target: Locale },
): TranslationJob[] {
  const config: CollectOptions = {
    source: options.source ?? defaultLocale,
    target: options.target,
    overwrite: options.overwrite ?? false,
  };

  const jobs: TranslationJob[] = [];

  const walk = (value: unknown, path: string) => {
    if (Array.isArray(value)) {
      if (isIntlArray(value)) {
        const job = inspectIntlArray(value, path, config);
        if (job) jobs.push(job);
        return;
      }

      value.forEach((item, index) => {
        walk(item, isKeyed(item) ? `${path}[_key=="${item._key}"]` : `${path}[${index}]`);
      });
      return;
    }

    if (isRecord(value)) {
      for (const [key, child] of Object.entries(value)) {
        if (key.startsWith("_")) continue;
        walk(child, path ? `${path}.${key}` : key);
      }
    }
  };

  walk(doc, "");
  return jobs;
}

/** Tüm işlerin metinlerini tek bir istekte gönderebilmek için düzleştirir. */
export function flattenTexts(jobs: TranslationJob[]): string[] {
  return jobs.flatMap((job) => job.texts);
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 14);
}

type Patch = { set: Record<string, unknown> } | { insert: { after: string; items: unknown[] } };

/**
 * Düz çeviri listesini işlere geri dağıtıp Sanity patch'lerine çevirir.
 * Hedef dilde boş bir öğe zaten varsa `set`, hiç yoksa dizinin sonuna `insert`.
 */
export function buildTranslationPatches(
  jobs: TranslationJob[],
  translations: string[],
  target: Locale,
): Patch[] {
  const patches: Patch[] = [];
  let cursor = 0;

  for (const job of jobs) {
    const slice = translations.slice(cursor, cursor + job.texts.length);
    cursor += job.texts.length;

    const value =
      job.kind === "blocks" ? fillBlockTexts(job.source as Block[], slice) : (slice[0] ?? "");

    if (job.targetKey) {
      patches.push({ set: { [`${job.path}[_key=="${job.targetKey}"].value`]: value } });
    } else {
      patches.push({
        insert: {
          after: `${job.path}[-1]`,
          items: [{ _type: job.itemType, _key: randomKey(), language: target, value }],
        },
      });
    }
  }

  return patches;
}
