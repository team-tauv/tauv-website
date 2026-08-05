import { defineField, defineType } from "sanity";
import { pickLocale, type IntlArray } from "../../lib/i18n";
import { DEPARTMENTS } from "../../../lib/taxonomy";

export const member = defineType({
  name: "member",
  title: "Takım Üyesi",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Ad Soyad",
      type: "string",
      description: "Özel isim olduğu için çevrilmez.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "role",
      title: "Görev",
      type: "internationalizedArrayString",
      description: 'Örn. "Otonom Ekip Lideri" / "Autonomy Team Lead".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "department",
      title: "Departman",
      type: "string",
      options: { list: [...DEPARTMENTS], layout: "radio" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Fotoğraf",
      type: "image",
      options: { hotspot: true },
      description: "Kare kırpılır. Odak noktasını yüzün üzerine alın.",
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternatif metin",
          description: 'Boş bırakılırsa "Ad Soyad, Görev" otomatik kullanılır.',
        },
      ],
    }),
    defineField({
      name: "linkedin",
      title: "LinkedIn",
      type: "url",
      validation: (rule) => rule.uri({ scheme: ["https"] }),
    }),
    defineField({
      name: "isLead",
      title: "Ekip lideri",
      type: "boolean",
      description: "İşaretli üyeler departman listesinin başında ve vurgulu gösterilir.",
      initialValue: false,
    }),
    defineField({
      name: "active",
      title: "Aktif üye",
      type: "boolean",
      description: "Kapatılırsa sitede görünmez ama kayıt silinmez (mezun olan üyeler için).",
      initialValue: true,
    }),
    defineField({
      name: "order",
      title: "Sıra",
      type: "number",
      description: "Küçük olan önce gelir. Boş bırakılırsa ada göre sıralanır.",
    }),
  ],
  orderings: [
    {
      title: "Departman, sonra sıra",
      name: "byDepartment",
      by: [
        { field: "department", direction: "asc" },
        { field: "order", direction: "asc" },
        { field: "name", direction: "asc" },
      ],
    },
  ],
  preview: {
    select: { title: "name", role: "role", department: "department", media: "image", active: "active" },
    prepare({ title, role, department, media, active }) {
      const dept = DEPARTMENTS.find((d) => d.value === department)?.title ?? "—";
      const roleText = pickLocale(role as IntlArray) ?? "";
      return {
        title: active ? title : `${title} (pasif)`,
        subtitle: [dept, roleText].filter(Boolean).join(" · "),
        media,
      };
    },
  },
});
