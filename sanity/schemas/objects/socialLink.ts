import { defineField, defineType } from "sanity";
import { SOCIAL_PLATFORMS } from "../../../lib/taxonomy";

export const socialLink = defineType({
  name: "socialLink",
  title: "Sosyal Medya Bağlantısı",
  type: "object",
  fields: [
    defineField({
      name: "platform",
      title: "Platform",
      type: "string",
      options: { list: [...SOCIAL_PLATFORMS], layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Bağlantı",
      type: "url",
      description: 'E-posta seçtiyseniz "mailto:" ile başlatın.',
      validation: (rule) => rule.required().uri({ scheme: ["http", "https", "mailto"] }),
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});
