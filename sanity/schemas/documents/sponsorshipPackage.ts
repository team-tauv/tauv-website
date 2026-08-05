import { defineField, defineType } from "sanity";
import { pickLocale, type IntlArray } from "../../lib/i18n";
import { SPONSOR_TIERS } from "../../../lib/taxonomy";

/**
 * Sponsorluk dosyasındaki "Sponsorluk Paketleri" sayfasının site karşılığı.
 *
 * Her katman için ayrı bir doküman: bütçe aralığı + o aralıkta sunulan haklar.
 * Sponsorların en sık sorduğu "ne kadar verirsem ne alırım" sorusunun cevabı
 * PDF'in içinde kilitli kalmasın diye ayrı doküman tipi — logo listesini tutan
 * `sponsor` ile karıştırılmamalı, o "kim destekledi"yi anlatır.
 */
export const sponsorshipPackage = defineType({
  name: "sponsorshipPackage",
  title: "Sponsorluk Paketi",
  type: "document",
  fields: [
    defineField({
      name: "tier",
      title: "Katman",
      type: "string",
      options: { list: [...SPONSOR_TIERS], layout: "radio" },
      description: "Her katmandan yalnızca bir paket olmalı.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "priceLabel",
      title: "Bütçe aralığı",
      type: "internationalizedArrayString",
      description:
        'Serbest metin — para birimi ve aralık dahil. Örn. "200.000₺ ve üzeri". Ürün bazlı ' +
        "sponsorlukta boş bırakılabilir.",
    }),
    defineField({
      name: "benefits",
      title: "Sunulan haklar",
      type: "internationalizedArrayText",
      description:
        "Her satır bir madde olarak listelenir. Boş satırlar yok sayılır — madde işareti " +
        "koymayın, sitede otomatik ekleniyor.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "note",
      title: "Ek not",
      type: "internationalizedArrayText",
      description:
        "Kartın altında küçük punto ile gösterilir. Örn. ürün sponsorluğunda değerleme " +
        "kuralı.",
    }),
    defineField({
      name: "featured",
      title: "Öne çıkar",
      type: "boolean",
      description: "Kart vurgulu çerçeveyle gösterilir. En fazla birinde açık olmalı.",
      initialValue: false,
    }),
  ],
  orderings: [
    {
      title: "Katman sırası",
      name: "byTier",
      by: [{ field: "tier", direction: "asc" }],
    },
  ],
  preview: {
    select: { tier: "tier", price: "priceLabel", featured: "featured" },
    prepare({ tier, price, featured }) {
      const title = SPONSOR_TIERS.find((t) => t.value === tier)?.title ?? "—";
      return {
        title: featured ? `★ ${title}` : title,
        subtitle: pickLocale(price as IntlArray) ?? "Bütçe aralığı girilmedi",
      };
    },
  },
});
