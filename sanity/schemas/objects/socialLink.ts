import { defineField, defineType } from "sanity";

export const SOCIAL_PLATFORMS = [
  { title: "Instagram", value: "instagram" },
  { title: "LinkedIn", value: "linkedin" },
  { title: "X (Twitter)", value: "x" },
  { title: "YouTube", value: "youtube" },
  { title: "GitHub", value: "github" },
  { title: "E-posta", value: "email" },
] as const;

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
      validation: (rule) => rule.required().uri({ scheme: ["http", "https", "mailto"] }),
    }),
  ],
  preview: {
    select: { title: "platform", subtitle: "url" },
  },
});
