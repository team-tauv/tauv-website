import { defineField, defineType } from "sanity";
import { pickLocale } from "../../lib/i18n";
import type { IntlArray } from "../../lib/i18n";

/**
 * Kart ikonları. Değerler `components/vehicles/spec-icon.tsx` içindeki
 * lucide eşlemesiyle birebir aynı olmalı — yeni bir değer eklenirse orada da
 * karşılığı tanımlanmalı, yoksa varsayılan ikona düşer.
 */
export const SPEC_ICONS = [
  { title: "Genel", value: "default" },
  { title: "Ağırlık", value: "weight" },
  { title: "Boyut", value: "dimensions" },
  { title: "Derinlik", value: "depth" },
  { title: "Hız", value: "speed" },
  { title: "Motor / İtki", value: "thruster" },
  { title: "Batarya", value: "battery" },
  { title: "Güç", value: "power" },
  { title: "Çalışma süresi", value: "runtime" },
  { title: "Kamera", value: "camera" },
  { title: "Sensör", value: "sensor" },
  { title: "Bilgisayar", value: "computer" },
  { title: "Haberleşme", value: "comms" },
  { title: "Malzeme", value: "material" },
  { title: "Basınç", value: "pressure" },
  { title: "Yazılım", value: "software" },
] as const;

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
      name: "icon",
      title: "İkon",
      type: "string",
      description: "Kartta etiketin yanında görünür. Seçilmezse genel bir ikon kullanılır.",
      options: { list: [...SPEC_ICONS] },
      initialValue: "default",
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
