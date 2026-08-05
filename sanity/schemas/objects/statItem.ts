import { defineField, defineType } from "sanity";
import { pickLocale, type IntlArray } from "../../lib/i18n";

/** Ana sayfadaki sayaç bandı: "42 Üye", "6 Yarışma", "3 Derece", "4 Araç". */
export const statItem = defineType({
  name: "statItem",
  title: "Metrik",
  type: "object",
  fields: [
    defineField({
      name: "value",
      title: "Sayı",
      type: "number",
      validation: (rule) => rule.required().min(0),
    }),
    defineField({
      name: "suffix",
      title: "Son ek",
      type: "string",
      description: 'Örn. "+" veya "%". İsteğe bağlı.',
    }),
    defineField({
      name: "label",
      title: "Etiket",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { value: "value", suffix: "suffix", label: "label" },
    prepare({ value, suffix, label }) {
      return {
        title: `${value ?? "—"}${suffix ?? ""}`,
        subtitle: pickLocale(label as IntlArray) ?? "",
      };
    },
  },
});
