import { defineField, defineType } from "sanity";
import { pickLocale, type IntlArray } from "../../lib/i18n";

export const news = defineType({
  name: "news",
  title: "Haber / Duyuru",
  type: "document",
  groups: [
    { name: "content", title: "İçerik", default: true },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Başlık",
      type: "internationalizedArrayString",
      group: "content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL adresi",
      type: "slug",
      group: "content",
      description: "İki dilde ortak. Türkçe başlıktan üretilir; Türkçe karakterler sadeleştirilir.",
      options: {
        maxLength: 96,
        source: (doc: Record<string, unknown>) =>
          pickLocale(doc.title as IntlArray, "tr") ?? "haber",
        slugify: (input: string) =>
          input
            .toLowerCase()
            .replace(/ğ/g, "g")
            .replace(/ü/g, "u")
            .replace(/ş/g, "s")
            .replace(/ı/g, "i")
            .replace(/ö/g, "o")
            .replace(/ç/g, "c")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "")
            .slice(0, 96),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Yayın tarihi",
      type: "datetime",
      group: "content",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Kapak görseli",
      type: "image",
      group: "content",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alternatif metin" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Özet",
      type: "internationalizedArrayText",
      group: "content",
      description: "Kartlarda ve paylaşımlarda görünür. 2–3 cümle.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "İçerik",
      type: "internationalizedArrayBlockContent",
      group: "content",
    }),
    defineField({
      name: "relatedVehicle",
      title: "İlgili araç",
      type: "reference",
      group: "content",
      to: [{ type: "vehicle" }],
      description: "İsteğe bağlı. Haberin altında araç kartı gösterilir.",
    }),
    defineField({
      name: "featured",
      title: "Öne çıkar",
      type: "boolean",
      group: "content",
      initialValue: false,
    }),
    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    {
      title: "Yayın tarihi (yeniden eskiye)",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", publishedAt: "publishedAt", media: "coverImage" },
    prepare({ title, publishedAt, media }) {
      return {
        title: pickLocale(title as IntlArray) ?? "(başlıksız)",
        subtitle: publishedAt
          ? new Date(publishedAt as string).toLocaleDateString("tr-TR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
          : "Tarih yok",
        media,
      };
    },
  },
});
