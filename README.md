# TAUV — Türk-Alman Üniversitesi İnsansız Su Altı Sistemleri Takımı

Takımın resmî web sitesi. Next.js App Router üzerinde SSG/ISR ağırlıklı çalışır,
içerik Sanity.io headless CMS'ten gelir.

## Teknoloji

| Katman     | Seçim                                              |
| ---------- | -------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React Server Components)    |
| Dil        | TypeScript 5.9 (strict)                             |
| Stil       | Tailwind CSS v4 (CSS-first `@theme`) + shadcn/ui    |
| Animasyon  | Framer Motion                                       |
| CMS        | Sanity v6 (`/studio` altında gömülü Studio)         |
| i18n       | next-intl (TR varsayılan / EN) + Sanity alan bazlı çeviri |
| Form       | React Hook Form + Zod + Resend                      |
| Barındırma | Vercel                                              |

## Başlangıç

```bash
npm install
cp .env.example .env.local   # değerleri doldurun
npm run dev
```

- Site: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio

## Komutlar

| Komut                  | Açıklama                                       |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Turbopack ile geliştirme sunucusu               |
| `npm run build`        | Prodüksiyon derlemesi                           |
| `npm run typecheck`    | `tsc --noEmit` ile tip kontrolü                 |
| `npm run lint`         | ESLint                                          |
| `npm run sanity:typegen` | Şemalardan TypeScript tipleri üret            |

## Rotalar

Dosya sistemindeki segment adları İngilizcedir; kullanıcıya görünen URL
`i18n/routing.ts` içindeki `pathnames` tablosundan üretilir. Varsayılan dil (TR)
ön ek almaz.

| Dosya yolu                    | TR URL             | EN URL                | İçerik |
| ----------------------------- | ------------------ | --------------------- | ------ |
| `[locale]/page`               | `/`                | `/en`                 | Hero, metrikler, öne çıkan araç, sponsorlar, haberler |
| `[locale]/about`              | `/hakkimizda`      | `/en/about`           | Misyon/vizyon + departmana göre ekip |
| `[locale]/vehicles`           | `/araclar`         | `/en/vehicles`        | Araç listesi |
| `[locale]/vehicles/[slug]`    | `/araclar/nemo`    | `/en/vehicles/nemo`   | Teknik tablo, galeri |
| `[locale]/competitions`       | `/yarismalar`      | `/en/competitions`    | Zaman çizelgesi, dereceler |
| `[locale]/sponsors`           | `/sponsorlar`      | `/en/sponsors`        | Katmanlı logo matrisi + PDF |
| `[locale]/news`               | `/haberler`        | `/en/news`            | Duyuru listesi |
| `[locale]/news/[slug]`        | `/haberler/...`    | `/en/news/...`        | Haber detayı |
| `[locale]/contact`            | `/iletisim`        | `/en/contact`         | Form, konum, üye alımı |
| `(studio)/studio`             | `/studio`          | —                     | Sanity Studio (locale dışı) |

### Dil desteği nasıl çalışır

- **Arayüz metinleri** → `messages/tr.json` ve `messages/en.json`. Bileşenlerde
  `useTranslations()` / `getTranslations()` ile okunur.
- **CMS içeriği** → Sanity'de alan bazlı çeviri
  (`sanity-plugin-internationalized-array`). Görsel, sıra, yıl, logo gibi dilden
  bağımsız alanlar tek kopya kalır; yalnızca metin alanları iki dillidir.
- **Eksik çeviri** → EN alanı boşsa TR içerik gösterilir (fallback), sayfa boş kalmaz.
- **Link verirken** `next/link` değil `@/i18n/navigation` içindeki `Link`
  kullanılır; aksi hâlde locale kaybolur.
