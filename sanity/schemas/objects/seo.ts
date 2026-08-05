import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta başlık",
      type: "internationalizedArrayString",
      description: "Boş bırakılırsa sayfa başlığı kullanılır. 60 karakteri geçmemeli.",
    }),
    defineField({
      name: "description",
      title: "Meta açıklama",
      type: "internationalizedArrayText",
      description: "Arama sonuçlarında görünen özet. 150–160 karakter ideal.",
    }),
    defineField({
      name: "ogImage",
      title: "Paylaşım görseli",
      type: "image",
      description: "1200×630 px. Boş bırakılırsa sayfanın kapak görseli kullanılır.",
      options: { hotspot: true },
    }),
    defineField({
      name: "noIndex",
      title: "Arama motorlarından gizle",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
