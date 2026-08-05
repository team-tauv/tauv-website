import { defineArrayMember, defineType } from "sanity";

export const blockContent = defineType({
  name: "blockContent",
  title: "Zengin Metin",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraf", value: "normal" },
        { title: "Başlık 2", value: "h2" },
        { title: "Başlık 3", value: "h3" },
        { title: "Alıntı", value: "blockquote" },
      ],
      lists: [
        { title: "Madde", value: "bullet" },
        { title: "Numaralı", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Kalın", value: "strong" },
          { title: "İtalik", value: "em" },
          { title: "Kod", value: "code" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Bağlantı",
            fields: [
              {
                name: "href",
                type: "url",
                title: "URL",
                validation: (rule) =>
                  rule.required().uri({ scheme: ["http", "https", "mailto", "tel"] }),
              },
              {
                name: "blank",
                type: "boolean",
                title: "Yeni sekmede aç",
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternatif metin",
          description: "Ekran okuyucular ve görsel yüklenmediğinde gösterilir. Zorunlu.",
          validation: (rule) => rule.required(),
        },
        { name: "caption", type: "string", title: "Açıklama" },
      ],
    }),
  ],
});
