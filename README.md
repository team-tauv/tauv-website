# TAUV — Türk-Alman Üniversitesi İnsansız Su Altı Sistemleri Takımı

Takımın resmî web sitesi. Next.js App Router üzerinde SSG/ISR ağırlıklı çalışır,
içerik Sanity.io headless CMS'ten gelir.

## Teknoloji

| Katman     | Seçim                                                                                     |
| ---------- | ----------------------------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, React Server Components)                                          |
| Dil        | TypeScript 5.9 (strict)                                                                   |
| Stil       | Tailwind CSS v4 (CSS-first `@theme`) + shadcn/ui                                          |
| Animasyon  | Framer Motion                                                                             |
| CMS        | Sanity v6 (`/studio` altında gömülü Studio)                                               |
| 3B         | `@google/model-viewer` (glTF/GLB, WebXR ile mobil AR)                                     |
| i18n       | next-intl (TR varsayılan / EN / DE) + Sanity alan bazlı çeviri, Studio'da otomatik çeviri |
| Form       | React Hook Form + Zod + Resend                                                            |
| Barındırma | Vercel                                                                                    |

## Başlangıç

```bash
npm install
cp .env.example .env.local   # değerleri doldurun
npm run dev
```

- Site: http://localhost:3000
- Sanity Studio: http://localhost:3000/studio

## Komutlar

| Komut                          | Açıklama                                                                                            |
| ------------------------------ | --------------------------------------------------------------------------------------------------- |
| `npm run dev`                  | Turbopack ile geliştirme sunucusu                                                                   |
| `npm run build`                | Prodüksiyon derlemesi                                                                               |
| `npm run typecheck`            | `tsc --noEmit` ile tip kontrolü                                                                     |
| `npm run lint`                 | ESLint                                                                                              |
| `npm run sanity:typegen`       | Şemalardan TypeScript tipleri üret                                                                  |
| `npm run model:optimize`       | GLB'yi web'e uygun boyuta indir (bkz. 3B araç modeli)                                               |
| `npm run model:inspect`        | GLB içeriğini incele (vertex, doku, sıkıştırma)                                                     |
| `npm run sanity:seed:packages` | Sponsorluk paketlerini sponsorluk dosyasındaki tablodan Sanity'ye yaz (var olan kayıtlara dokunmaz) |

## Rotalar

Dosya sistemindeki segment adları İngilizcedir; kullanıcıya görünen URL
`i18n/routing.ts` içindeki `pathnames` tablosundan üretilir. Varsayılan dil (TR)
ön ek almaz.

| Dosya yolu                 | TR URL          | EN URL              | DE URL               | İçerik                                                                         |
| -------------------------- | --------------- | ------------------- | -------------------- | ------------------------------------------------------------------------------ |
| `[locale]/page`            | `/`             | `/en`               | `/de`                | Hero, metrikler, öne çıkan araç, sponsorlar, haberler                          |
| `[locale]/about`           | `/hakkimizda`   | `/en/about`         | `/de/ueber-uns`      | Misyon/vizyon + departmana göre ekip                                           |
| `[locale]/vehicles`        | `/araclar`      | `/en/vehicles`      | `/de/fahrzeuge`      | Araç listesi                                                                   |
| `[locale]/vehicles/[slug]` | `/araclar/nemo` | `/en/vehicles/nemo` | `/de/fahrzeuge/nemo` | Teknik tablo, galeri, 3B model                                                 |
| `[locale]/competitions`    | `/yarismalar`   | `/en/competitions`  | `/de/wettbewerbe`    | Zaman çizelgesi, dereceler                                                     |
| `[locale]/sponsors`        | `/sponsorlar`   | `/en/sponsors`      | `/de/sponsoren`      | Erişim metrikleri, katmanlı logo matrisi, başarılar, sponsorluk paketleri, PDF |
| `[locale]/news`            | `/blog`         | `/en/blog`          | `/de/blog`           | Duyuru listesi                                                                 |
| `[locale]/news/[slug]`     | `/blog/...`     | `/en/blog/...`      | `/de/blog/...`       | Haber detayı                                                                   |
| `[locale]/contact`         | `/iletisim`     | `/en/contact`       | `/de/kontakt`        | Form, konum, üye alımı                                                         |
| `(studio)/studio`          | `/studio`       | —                   | —                    | Sanity Studio (locale dışı)                                                    |

### Dil desteği nasıl çalışır

Diller: **Türkçe (varsayılan), İngilizce, Almanca**. Tek kaynak `lib/locales.ts`;
yeni bir dil eklemek için oradaki listeye kod eklenir, `i18n/routing.ts`
içindeki her rotaya o dilin URL'si yazılır ve `messages/<kod>.json` oluşturulur.
Sanity tarafı listeyi aynı dosyadan okuduğu için ek iş gerektirmez.

- **Arayüz metinleri** → `messages/tr.json`, `messages/en.json`, `messages/de.json`.
  Bileşenlerde `useTranslations()` / `getTranslations()` ile okunur.
- **CMS içeriği** → Sanity'de alan bazlı çeviri
  (`sanity-plugin-internationalized-array`). Görsel, sıra, yıl, logo gibi dilden
  bağımsız alanlar tek kopya kalır; yalnızca metin alanları çok dillidir.
- **Eksik çeviri** → Hedef dildeki alan boşsa TR içerik gösterilir (fallback),
  sayfa boş kalmaz.
- **Link verirken** `next/link` değil `@/i18n/navigation` içindeki `Link`
  kullanılır; aksi hâlde locale kaybolur.

### Otomatik çeviri (Studio)

Türkçe alanları doldurup dokümanın alt köşesindeki `⋯` menüsünden **"Eksik
çevirileri doldur"** denince, boş bırakılmış İngilizce ve Almanca alanlar
otomatik çevrilip **taslağa** yazılır. Dolu çeviriler korunur, yayınlama
yapılmaz — metni gözden geçirip kendin yayınlarsın.

- Anahtar: `.env.local` içindeki `GEMINI_API_KEY`
  ([aistudio.google.com/apikey](https://aistudio.google.com/apikey), ücretsiz,
  kredi kartı istemez). Anahtar yoksa yalnızca bu düğme çalışmaz.
- Zengin metinde blok yapısı, bağlantılar ve görseller korunur; yalnızca metin
  parçaları çevrilir.
- Akış: `sanity/actions/translate-missing.tsx` (hangi alanlar eksik) →
  `sanity/lib/translate-fields.ts` (topla/patch üret) → `app/api/translate`
  (uç nokta) → `lib/translate.ts` (sağlayıcı). Sağlayıcı değişecekse tek
  dokunulacak yer sonuncusu.

## 3B araç modeli

Araç detay sayfasında modelin döndürülüp incelenebildiği bölüm. Sürükle-döndür,
kaydır-yakınlaştır, 3 sn hareketsizlikten sonra otomatik dönüş; mobilde AR
(Android Scene Viewer / iOS Quick Look).

### Nasıl çalışır

| Parça           | Yer                                                                                  |
| --------------- | ------------------------------------------------------------------------------------ |
| Sanity alanları | `sanity/schemas/documents/vehicle.ts` → `model3d`, `modelPoster`, `renderUrl`        |
| Sorgu           | `sanity/lib/queries.ts` → `VEHICLE_BY_SLUG_QUERY` içinde `model3dUrl`, `modelPoster` |
| Bileşen         | `components/vehicles/vehicle-model-viewer.tsx`                                       |
| JSX tipleri     | `types/model-viewer.d.ts` (`<model-viewer>` bir web component, React tanımaz)        |
| Kullanım        | `app/(frontend)/[locale]/vehicles/[slug]/page.tsx`                                   |

Kaynak seçimi sırayla: **`model3d`** (kendi GLB'miz) → **`renderUrl`** (Sketchfab
vb. iframe yedeği) → hiçbiri yoksa bölüm çizilmez.

**Performans.** `@google/model-viewer` three.js taşıdığı için ~1 MB ve import
edildiği anda `window`a dokunur — bu yüzden bileşen `"use client"` ve kütüphaneyi
effect içinde `await import()` ile alır. Import bir `IntersectionObserver`'a
bağlıdır (`rootMargin: 400px`): ziyaretçi 3B bölüme yaklaşmadan ne kütüphane ne
de GLB indirilir. Modeli olmayan araç sayfaları hiçbir maliyet ödemez.

### GLB dosyası nasıl hazırlanır

Studio'da araç → **Görseller** sekmesindeki "3B model dosyası (.glb)" alanına
**CAD dosyası doğrudan yüklenmez.** Ham CAD 200 MB'ı bulur ve mobilde açılmaz.

#### 0. Önce CAD'de temizle

Formattan önce gelen adım budur ve en büyük boyut kazancını burası verir.
SolidWorks'te bir **Display State / Configuration** oluşturup vidaları,
somunları, iç kabloları, kartları — dışarıdan görünmeyen her şeyi gizleyin,
ihracı o konfigürasyondan alın. Blender'da 400 parçalık bir ağaçtan tek tek
ayıklamaktan kat kat hızlı ve geri dönülebilir.

#### 1. CAD'den ihraç: FBX (önerilen)

**Save As → FBX**, Options altında _deviation_ ve _angle tolerance_ değerlerini
kısarak. CAD tessellation'ı üçgeni eğriliğin olduğu yere koyar: düz plakaya iki
üçgen, kubbeye binlerce. Blender'daki Decimate ise kenarları körlemesine
çökertip kubbeleri düzleştirir, silindirleri köşelendirir — yani **poligonu
baştan doğru yoğunlukta çıkarmak, sonradan düşürmekten iyidir.**

Diğer seçenekler:

| Format   | Durum                                                                                                                                                                                                                                                                  |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **FBX**  | Önerilen. Parça hiyerarşisini, isimleri, malzemeleri ve transformları korur. İleride parçaya tıklanabilir hotspot eklemek istenirse bu ağaç gerekir.                                                                                                                   |
| **GLB**  | SolidWorks 2022+ doğrudan `.glb` verebiliyor. Malzemeler ham kalır ama Blender'ı atlayıp modelin sitede nasıl durduğunu hızlıca görmek için ideal.                                                                                                                     |
| **STEP** | B-rep taşır, mesh yoğunluğuna sonradan karar verilir. Ama Blender STEP'i native açamaz (_STEPper_ eklentisi veya FreeCAD üzerinden dolaşmak gerekir) ve import sırasındaki tessellation genelde CAD'inkinden kötüdür. Yalnızca yoğunlukla defalarca oynanacaksa değer. |
| **OBJ**  | Kullanmayın. Hiyerarşi yok (araç tek mesh'e düşer, parça isimleri kaybolur), birim metadata'sı yok, ASCII olduğu için dosya devasa.                                                                                                                                    |

#### 2. Blender'da düzenle

1. **Ölçeği düzelt** — CAD mm, glTF metre ile çalışır; model 1000 kat büyük
   gelir. `S 0.001` sonra Ctrl+A → Scale. Atlanırsa model-viewer'da kamera
   modelin içinde kalır.
2. **Artakalanları sil** — CAD'de gözden kaçan iç parçalar.
3. **Malzeme ata** — CAD'den gelen model gri gelir. Gövde / kubbe / itki motoru
   için birkaç basit Principled BSDF (metallic + roughness) yeter, doku haritası
   şart değil.

Blender'da Decimate ile uğraşmayın; poligon düşürme işini 3. adımdaki betik
meshoptimizer ile hata sınırı içinde yapıyor.

#### 3. Optimize et — Blender export'u doğrudan yüklenmez

**Export → glTF 2.0 (.glb)** (Draco kutusunu işaretlemenize gerek yok, betik
zaten uyguluyor), sonra:

```bash
npm run model:optimize -- indirilen.glb altay-web.glb
npm run model:inspect -- altay-web.glb      # ne çıktığını görmek için
```

`scripts/optimize-model.mjs` iki geçiş yapar ve **sırası önemlidir**:

1. **`prune --keep-attributes false`** — CAD modelinde doku yoktur ama Blender
   yine de her vertex'e `TEXCOORD_0` yazar. İşe yaramayan bu UV'ler vertex
   başına 8 bayt ve boşuna GPU belleği demektir.
2. **`optimize --compress draco`** — dedup → instance → join → weld → simplify →
   Draco. Draco'lu bir dosyaya sonradan `prune` uygulanırsa sıkıştırma çözülür ve
   yeniden kurulmaz, dosya 15 katına çıkar. Sıra bu yüzden sabittir.

Gerçek ölçüm (Altay, Blender glTF export'u):

|              | Ham export          | Betikten sonra |
| ------------ | ------------------- | -------------- |
| Dosya        | 89 MB               | **1,29 MB**    |
| Vertex       | 2.405.252           | 482.975        |
| Draco        | yok                 | var            |
| `TEXCOORD_0` | var (kullanılmıyor) | atıldı         |

**Hedef: 10 MB altı.** Aşarsanız `--error` değerini büyütün (varsayılan `0.001`;
`0.005` gözle görülür bozulma yapmadan epey kırpar) veya 0. adıma dönüp CAD'de
daha çok iç parça gizleyin:

```bash
npm run model:optimize -- indirilen.glb altay-web.glb --error 0.005
```

#### 4. Poster

`modelPoster` alanına modelin varsayılan açısından alınmış bir kare koyun —
model inerken o görsel gösterilir, boş kutu görünmez. Boş bırakılırsa kapak
görseli kullanılır.
