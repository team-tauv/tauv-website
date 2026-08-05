/**
 * "TAUV 25-26 TAC Sonrası Sponsorluk Dosyası" PDF'indeki paket tablosunu
 * Sanity'ye aktarır. Elle altı doküman × iki dil × beş madde girmek yerine
 * bir kez çalıştırılır; sonrasında güncellemeler Studio'dan yapılır.
 *
 *   npx sanity exec scripts/seed-sponsorship-packages.ts --with-user-token
 *
 * `createIfNotExists` kullanılıyor: script ikinci kez çalıştırıldığında
 * Studio'da yapılmış düzenlemeleri EZMEZ, var olan dokümanlara dokunmaz.
 * Tutarları sıfırdan yeniden yüklemek isterseniz önce Studio'dan silin.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

type Package = {
  tier: string;
  price?: { tr: string; en: string };
  benefits: { tr: string[]; en: string[] };
  note?: { tr: string; en: string };
  featured?: boolean;
};

const PACKAGES: Package[] = [
  {
    tier: "main",
    price: { tr: "200.000₺ ve üzeri", en: "₺200,000 and above" },
    featured: true,
    benefits: {
      tr: [
        "Üniversite içi etkinliklerle özel görünürlük sağlanması",
        "Sergi alanında büyük şirket logosu",
        "Sergi alanında isteğe bağlı afiş ve tanıtım ürünü",
        "Takım formasında üst kısımda en büyük şirket logosu",
        "Takım ve proje tanıtım dosyalarında her sayfada şirket logosu",
        "Sosyal medya hesabından düzenli şirket bağlantı linki ve logo paylaşımı",
      ],
      en: [
        "Dedicated visibility at on-campus events",
        "Large company logo in the exhibition area",
        "Optional banner and promotional items in the exhibition area",
        "Largest company logo on the upper section of the team uniform",
        "Company logo on every page of team and project decks",
        "Regular company link and logo posts on our social media accounts",
      ],
    },
  },
  {
    tier: "platinum",
    price: { tr: "100.000₺ – 200.000₺", en: "₺100,000 – ₺200,000" },
    benefits: {
      tr: [
        "Sergi alanında büyük şirket logosu",
        "Sergi alanında isteğe bağlı afiş ve tanıtım ürünü",
        "Takım formasında üst kısımda büyük şirket logosu",
        "Takım ve proje tanıtım dosyalarında şirket logosu",
        "Sosyal medya hesabından düzenli şirket bağlantı linki ve logo paylaşımı",
      ],
      en: [
        "Large company logo in the exhibition area",
        "Optional banner and promotional items in the exhibition area",
        "Large company logo on the upper section of the team uniform",
        "Company logo in team and project decks",
        "Regular company link and logo posts on our social media accounts",
      ],
    },
  },
  {
    tier: "gold",
    price: { tr: "50.000₺ – 100.000₺", en: "₺50,000 – ₺100,000" },
    benefits: {
      tr: [
        "Sergi alanında küçük şirket logosu",
        "Takım formasında orta boy şirket logosu",
        "Takım ve proje tanıtım dosyalarında şirket logosu",
        "Sosyal medya hesabından üç defaya mahsus şirket bağlantı linki ve logo paylaşımı",
      ],
      en: [
        "Small company logo in the exhibition area",
        "Medium company logo on the team uniform",
        "Company logo in team and project decks",
        "Three company link and logo posts on our social media accounts",
      ],
    },
  },
  {
    tier: "silver",
    price: { tr: "25.000₺ – 50.000₺", en: "₺25,000 – ₺50,000" },
    benefits: {
      tr: [
        "Takım formasında orta boy şirket logosu",
        "Takım ve proje tanıtım dosyalarında şirket logosu",
        "Sosyal medya hesabında bir defaya mahsus şirket bağlantı linki ve logo paylaşımı",
      ],
      en: [
        "Medium company logo on the team uniform",
        "Company logo in team and project decks",
        "One company link and logo post on our social media accounts",
      ],
    },
  },
  {
    tier: "bronze",
    price: { tr: "25.000₺ ve altı", en: "Up to ₺25,000" },
    benefits: {
      tr: [
        "Takım formasında küçük şirket logosu",
        "Sosyal medya hesabında bir defaya mahsus logo paylaşımı",
      ],
      en: ["Small company logo on the team uniform", "One logo post on our social media accounts"],
    },
  },
  {
    tier: "supplier",
    benefits: {
      tr: [
        "Malzeme, ekipman veya hizmet desteği",
        "Desteğin piyasa değerine denk gelen katmanın tüm hakları",
      ],
      en: [
        "Support in materials, equipment or services",
        "All benefits of the tier matching the market value of the support",
      ],
    },
    note: {
      tr:
        "Sponsorluğu sağlanan ürünün piyasa değeri doğrultusunda, yukarıda belirtilen " +
        "sponsorluk kategorileri kapsamında değerlendirme yapılacaktır.",
      en:
        "In-kind sponsorships are evaluated within the categories above, based on the " +
        "market value of the product provided.",
    },
  },
];

/** internationalized-array v5'in diskteki biçimi: dil ayrı bir alanda. */
function intl(value: { tr: string; en: string }) {
  return [
    { _key: "tr", _type: "internationalizedArrayStringValue", language: "tr", value: value.tr },
    { _key: "en", _type: "internationalizedArrayStringValue", language: "en", value: value.en },
  ];
}

function intlText(value: { tr: string; en: string }) {
  return [
    { _key: "tr", _type: "internationalizedArrayTextValue", language: "tr", value: value.tr },
    { _key: "en", _type: "internationalizedArrayTextValue", language: "en", value: value.en },
  ];
}

async function run() {
  const tx = client.transaction();

  for (const pkg of PACKAGES) {
    tx.createIfNotExists({
      // Sabit id — script tekrar çalışsa da kopya doküman üretmez.
      _id: `sponsorshipPackage.${pkg.tier}`,
      _type: "sponsorshipPackage",
      tier: pkg.tier,
      featured: pkg.featured ?? false,
      ...(pkg.price ? { priceLabel: intl(pkg.price) } : {}),
      benefits: intlText({ tr: pkg.benefits.tr.join("\n"), en: pkg.benefits.en.join("\n") }),
      ...(pkg.note ? { note: intlText(pkg.note) } : {}),
    });
  }

  await tx.commit();
  console.log(`${PACKAGES.length} sponsorluk paketi yazıldı (var olanlar korundu).`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
