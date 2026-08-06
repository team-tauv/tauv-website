import { defineField, defineType } from "sanity";
import { LOGO_MODES, SPONSOR_TIERS } from "../../../lib/taxonomy";

export const sponsor = defineType({
  name: "sponsor",
  title: "Sponsor",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Kurum adı",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      description:
        "Tercihen şeffaf arka planlı SVG veya PNG. Renkli ya da beyaz fonlu bir logo da yükleyebilirsiniz — sitede nasıl görüneceğini alttaki 'Logo görünümü' belirler.",
      options: { accept: ".svg,.png,.webp,.jpg,.jpeg" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logoMode",
      title: "Logo görünümü",
      type: "string",
      options: { list: [...LOGO_MODES], layout: "radio" },
      initialValue: "mono",
      description:
        "Logo koyu zeminde beyaza çevrilir. Arka planı zaten şeffafsa ilk seçenek yeterli; beyaz/açık fonlu bir görsel yüklediyseniz ikinciyi seçin, açık zemin silinir. Ana sponsorun kurumsal renkleri şartsa 'Orijinal renkler'.",
    }),
    defineField({
      name: "tier",
      title: "Katman",
      type: "string",
      options: { list: [...SPONSOR_TIERS], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "website",
      title: "Web sitesi",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
    }),
    defineField({
      name: "description",
      title: "Kısa tanıtım",
      type: "internationalizedArrayText",
      description: "Yalnızca ana sponsorlarda gösterilir. İsteğe bağlı.",
    }),
    defineField({
      name: "showInMarquee",
      title: "Ana sayfa şeridinde göster",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Sıra",
      type: "number",
      description: "Aynı katman içinde sıralama. Küçük olan önce gelir.",
    }),
  ],
  orderings: [
    {
      title: "Katman, sonra sıra",
      name: "byTier",
      by: [
        { field: "tier", direction: "asc" },
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", tier: "tier", media: "logo" },
    prepare({ title, tier, media }) {
      return {
        title,
        subtitle: SPONSOR_TIERS.find((t) => t.value === tier)?.title ?? "—",
        media,
      };
    },
  },
});
