import { defineArrayMember, defineField, defineType } from "sanity";

export const competition = defineType({
  name: "competition",
  title: "Yarışma",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Yarışma adı",
      type: "string",
      description: 'Özel isim, çevrilmez. Örn. "TEKNOFEST 2025", "TAC Challenge 2024".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "organizer",
      title: "Düzenleyen",
      type: "string",
    }),
    defineField({
      name: "year",
      title: "Yıl",
      type: "number",
      validation: (rule) => rule.required().integer().min(2010).max(new Date().getFullYear() + 2),
    }),
    defineField({
      name: "date",
      title: "Tarih",
      type: "date",
      description: "Zaman çizelgesinde sıralama için. Gün bilinmiyorsa ayın ilk günü yeter.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Konum",
      type: "internationalizedArrayString",
      description: 'Örn. "İstanbul, Türkiye" / "Istanbul, Türkiye".',
    }),
    defineField({
      name: "result",
      title: "Sonuç / Derece",
      type: "internationalizedArrayString",
      description: 'Örn. "Türkiye 3.sü" / "3rd in Türkiye". Boş bırakılabilir.',
    }),
    defineField({
      name: "rank",
      title: "Sıralama",
      type: "number",
      description: "Sayısal derece (1, 2, 3…). Rozet göstermek için kullanılır, isteğe bağlı.",
    }),
    defineField({
      name: "description",
      title: "Açıklama",
      type: "internationalizedArrayBlockContent",
    }),
    defineField({
      name: "coverImage",
      title: "Görsel",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alternatif metin" }],
    }),
    defineField({
      name: "vehiclesUsed",
      title: "Katılan araçlar",
      type: "array",
      of: [defineArrayMember({ type: "reference", to: [{ type: "vehicle" }] })],
    }),
    defineField({
      name: "technicalReport",
      title: "Teknik rapor (PDF)",
      type: "file",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "certificate",
      title: "Sertifika / Başarı belgesi",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  orderings: [
    { title: "Tarih (yeniden eskiye)", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
  ],
  preview: {
    select: { title: "name", date: "date", rank: "rank", media: "coverImage" },
    prepare({ title, date, rank, media }) {
      const year = date ? new Date(date as string).getFullYear() : "—";
      return {
        title: rank ? `${title} — ${rank}.` : title,
        subtitle: String(year),
        media,
      };
    },
  },
});
