import { defineField, defineType } from "sanity";
import { pickLocale } from "../../lib/i18n";
import type { IntlArray } from "../../lib/i18n";

/**
 * Araç teknik özelliği: "Ağırlık / 32 kg", "Sızdırmazlık Derinliği / 30 m".
 * Etiket ve değer ayrı ayrı çevrilir — değerlerin çoğu dilden bağımsız olsa da
 * "Paslanmaz çelik" gibi malzeme adları çeviri ister.
 */
export const specItem = defineType({
  name: "specItem",
  title: "Teknik Özellik",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Etiket",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "value",
      title: "Değer",
      type: "internationalizedArrayString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "highlight",
      title: "Öne çıkar",
      type: "boolean",
      description: "İşaretlenirse araç kartında özet olarak gösterilir (en fazla 3 tane seçin).",
      initialValue: false,
    }),
  ],
  preview: {
    select: { label: "label", value: "value", highlight: "highlight" },
    prepare({ label, value, highlight }) {
      return {
        title: pickLocale(label as IntlArray) ?? "(etiket yok)",
        subtitle: `${pickLocale(value as IntlArray) ?? "—"}${highlight ? "  ★" : ""}`,
      };
    },
  },
});
