import { defineArrayMember, defineField, defineType } from "sanity";

export const VEHICLE_TYPES = [
  { title: "AUV — Otonom Su Altı Aracı", value: "AUV" },
  { title: "ROV — Uzaktan Kumandalı Araç", value: "ROV" },
] as const;

export const vehicle = defineType({
  name: "vehicle",
  title: "Araç",
  type: "document",
  groups: [
    { name: "general", title: "Genel", default: true },
    { name: "media", title: "Görseller" },
    { name: "specs", title: "Teknik" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Araç adı",
      type: "string",
      group: "general",
      description: 'Özel isim, çevrilmez. Örn. "NEMO", "Poseidon II".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "URL adresi",
      type: "slug",
      group: "general",
      description: "Her iki dilde de aynı kullanılır.",
      options: { source: "title", maxLength: 64 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Kısa tanım",
      type: "internationalizedArrayString",
      group: "general",
      description: "Kartlarda başlığın altında görünen tek satır.",
    }),
    defineField({
      name: "year",
      title: "Yıl",
      type: "number",
      group: "general",
      validation: (rule) => rule.required().integer().min(2010).max(new Date().getFullYear() + 2),
    }),
    defineField({
      name: "type",
      title: "Tip",
      type: "string",
      group: "general",
      options: { list: [...VEHICLE_TYPES], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Durum",
      type: "string",
      group: "general",
      options: {
        list: [
          { title: "Aktif", value: "active" },
          { title: "Geliştiriliyor", value: "development" },
          { title: "Emekli", value: "retired" },
        ],
        layout: "radio",
      },
      initialValue: "active",
    }),
    defineField({
      name: "featured",
      title: "Ana sayfada öne çıkar",
      type: "boolean",
      group: "general",
      description: "Yalnızca bir araç işaretlenmeli. Birden fazlaysa en yenisi kullanılır.",
      initialValue: false,
    }),

    defineField({
      name: "mainImage",
      title: "Kapak görseli",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alternatif metin" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Galeri",
      type: "array",
      group: "media",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            { name: "alt", type: "string", title: "Alternatif metin" },
            { name: "caption", type: "internationalizedArrayString", title: "Açıklama" },
          ],
        }),
      ],
      options: { layout: "grid" },
    }),
    defineField({
      name: "renderUrl",
      title: "3D render bağlantısı",
      type: "url",
      group: "media",
      description: "Sketchfab vb. gömülebilir model adresi. İsteğe bağlı.",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),

    defineField({
      name: "specs",
      title: "Teknik özellikler",
      type: "array",
      group: "specs",
      of: [defineArrayMember({ type: "specItem" })],
      description: "Ağırlık, boyut, sızdırmazlık derinliği, motor sayısı, sensörler…",
    }),
    defineField({
      name: "description",
      title: "Açıklama",
      type: "internationalizedArrayBlockContent",
      group: "specs",
    }),

    defineField({ name: "seo", title: "SEO", type: "seo", group: "seo" }),
  ],
  orderings: [
    { title: "Yıl (yeniden eskiye)", name: "yearDesc", by: [{ field: "year", direction: "desc" }] },
  ],
  preview: {
    select: { title: "title", year: "year", type: "type", media: "mainImage", featured: "featured" },
    prepare({ title, year, type, media, featured }) {
      return {
        title: featured ? `★ ${title}` : title,
        subtitle: [type, year].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
