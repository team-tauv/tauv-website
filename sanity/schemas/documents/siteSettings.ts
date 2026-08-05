import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Tekil (singleton) doküman. Studio'da tek kayıt olarak açılır, çoğaltılamaz.
 *
 * Buradaki metinler "editoryal" olanlardır — yarışma sezonuna göre değişenler.
 * Navigasyon etiketi, buton yazısı, form hata mesajı gibi sabit arayüz metinleri
 * burada DEĞİL, messages/tr.json ve messages/en.json içinde tutulur.
 */
export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Ayarları",
  type: "document",
  groups: [
    { name: "hero", title: "Ana Sayfa", default: true },
    { name: "about", title: "Hakkımızda" },
    { name: "sponsorship", title: "Sponsorluk" },
    { name: "recruitment", title: "Üye Alımı" },
    { name: "contact", title: "İletişim" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({
      name: "heroTitle",
      title: "Hero başlığı",
      type: "internationalizedArrayString",
      group: "hero",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroTagline",
      title: "Hero sloganı",
      type: "internationalizedArrayString",
      group: "hero",
      initialValue: [
        { _key: "tr", language: "tr", value: "Derinlikte gelecek, gelecekte derinlik." },
        { _key: "en", language: "en", value: "Future in the depth, depth in the future." },
      ],
    }),
    defineField({
      name: "heroVideo",
      title: "Hero arka plan videosu",
      type: "file",
      group: "hero",
      description:
        "Sessiz, kısa döngü (8–12 sn), tercihen 3 MB altı MP4. Boş bırakılırsa CSS dalga efekti kullanılır.",
      options: { accept: "video/mp4,video/webm" },
    }),
    defineField({
      name: "heroPoster",
      title: "Video kapak görseli",
      type: "image",
      group: "hero",
      description: "Video yüklenene kadar gösterilir. Video yoksa hero arka planı olur.",
      options: { hotspot: true },
    }),
    defineField({
      name: "stats",
      title: "Metrik bandı",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "statItem" })],
      description: "Üye sayısı, katılınan yarışma, derece, araç sayısı… 3–5 tane ideal.",
      validation: (rule) => rule.max(5),
    }),

    defineField({
      name: "mission",
      title: "Misyon",
      type: "internationalizedArrayBlockContent",
      group: "about",
    }),
    defineField({
      name: "vision",
      title: "Vizyon",
      type: "internationalizedArrayBlockContent",
      group: "about",
    }),
    defineField({
      name: "aboutIntro",
      title: "Hakkımızda giriş metni",
      type: "internationalizedArrayText",
      group: "about",
      description: "Üniversite bağlamı, takımın kuruluşu ve kapsamı.",
    }),
    defineField({
      name: "teamPhoto",
      title: "Takım fotoğrafı",
      type: "image",
      group: "about",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alternatif metin" }],
    }),

    defineField({
      name: "sponsorshipPitch",
      title: "Sponsorluk çağrısı",
      type: "internationalizedArrayBlockContent",
      group: "sponsorship",
    }),
    defineField({
      name: "sponsorshipDeck",
      title: "Sponsorluk dosyası (PDF)",
      type: "file",
      group: "sponsorship",
      options: { accept: ".pdf" },
    }),
    defineField({
      name: "sponsorshipStats",
      title: "Erişim metrikleri",
      type: "array",
      group: "sponsorship",
      of: [defineArrayMember({ type: "statItem" })],
      description:
        "Sponsorluk sayfasının üstündeki kanıt bandı. Ana sayfadakinden ayrı tutuluyor: " +
        "burada sponsora hitap eden sayılar olmalı — kurulduğu yıl, kazanılan ödül, " +
        "sosyal medya erişimi, aktif üye. 3–4 tane ideal.",
      validation: (rule) => rule.max(4),
    }),

    defineField({
      name: "recruitmentOpen",
      title: "Başvurular açık",
      type: "boolean",
      group: "recruitment",
      description: "Kapalıyken iletişim sayfasında başvuru bölümü yerine bilgilendirme gösterilir.",
      initialValue: false,
    }),
    defineField({
      name: "recruitmentNotice",
      title: "Üye alımı metni",
      type: "internationalizedArrayText",
      group: "recruitment",
    }),
    defineField({
      name: "recruitmentUrl",
      title: "Başvuru formu bağlantısı",
      type: "url",
      group: "recruitment",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),

    defineField({
      name: "contactEmail",
      title: "E-posta",
      type: "string",
      group: "contact",
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: "address",
      title: "Adres",
      type: "internationalizedArrayText",
      group: "contact",
      description: "Kulüp odası / laboratuvar adresi.",
    }),
    defineField({
      name: "mapEmbedUrl",
      title: "Harita gömme adresi",
      type: "url",
      group: "contact",
      description: "Google Maps 'Embed a map' iframe src değeri.",
    }),
    defineField({
      name: "socials",
      title: "Sosyal medya",
      type: "array",
      group: "contact",
      of: [defineArrayMember({ type: "socialLink" })],
    }),

    defineField({
      name: "defaultSeo",
      title: "Varsayılan SEO",
      type: "seo",
      group: "seo",
      description: "Kendi SEO'su tanımlanmamış sayfalarda kullanılır.",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Site Ayarları" }),
  },
});
