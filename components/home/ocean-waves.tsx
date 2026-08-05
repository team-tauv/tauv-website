/**
 * Hero arka planı için saf CSS/SVG okyanus katmanı — client JS yok.
 *
 * Dört dalga katmanı farklı hız, yön, genlik ve bulanıklıkta üst üste biner;
 * arkadakiler daha bulanık ve yavaş olduğu için alan derinliği (depth of field)
 * hissi verir. En öndeki katman doğrudan --background rengindedir, böylece hero
 * bir sonraki bölüme dikişsiz bağlanır.
 *
 * Yol 2880 birim genişlikte ve 720'lik periyotla çizildi; katman genişliğinin
 * %25'i tam bir periyoda denk geldiği için -%25 kaydırma döngüyü dikişsiz kapatır.
 *
 * Performans: bulanıklık en içteki (hareketsiz) <svg>'ye uygulanır, iki
 * transform animasyonu ise onu saran div'lerde durur. Böylece blur tek seferde
 * rasterize edilip doku olarak önbelleğe alınır; her karede yeniden
 * hesaplanmaz, animasyon compositor'da kalır.
 */

const PERIOD = 720;
const WIDTH = 2880;
const BASE = 60;
const DEPTH = 140;

/** Kübik eğrilerle sinüse yakın, kendini tekrar eden dalga yolu üretir. */
function wavePath(amplitude: number) {
  const half = PERIOD / 2;
  // Kübik kontrol noktası, sinüsün tepe yüksekliğini yakalamak için ~1.33x.
  const pull = amplitude * 1.33;

  let d = `M0,${BASE}`;
  for (let x = 0; x < WIDTH; x += half) {
    const dir = (x / half) % 2 === 0 ? -1 : 1;
    d += ` C${x + half / 3},${BASE + pull * dir} ${x + (half * 2) / 3},${BASE + pull * dir} ${x + half},${BASE}`;
  }
  return `${d} L${WIDTH},${DEPTH} L0,${DEPTH} Z`;
}

type LayerProps = {
  amplitude: number;
  fill: string;
  opacity?: number;
  /** Yatay tur süresi (sn). Büyük değer = uzaktaki, yavaş dalga. */
  duration: number;
  /** Dikey salınım süresi (sn) — yatayla asal olsun ki desen tekrar etmesin. */
  bob: number;
  /** Gauss bulanıklığı (px). Arka katmanlarda yüksek, ön katmanlarda düşük. */
  blur: number;
  reverse?: boolean;
  /** Katmanın yüksekliği ve hero tabanına olan mesafesi. */
  height: string;
  offset: string;
};

function WaveLayer({
  amplitude,
  fill,
  opacity = 1,
  duration,
  bob,
  blur,
  reverse,
  height,
  offset,
}: LayerProps) {
  return (
    <div
      className="absolute will-change-transform"
      style={{
        // Katman kapsayıcıdan geniş ve sola taşkın: bulanıklığın yumuşattığı
        // yan kenarlar döngünün hiçbir anında görünür alana girmez.
        left: "-75%",
        width: "250%",
        height,
        bottom: offset,
        animation: `${reverse ? "wave-slide-reverse" : "wave-slide"} ${duration}s linear infinite`,
      }}
    >
      <div
        className="size-full will-change-transform"
        style={{ animation: `wave-bob ${bob}s ease-in-out infinite` }}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${DEPTH}`}
          preserveAspectRatio="none"
          className="size-full"
          style={{ filter: `blur(${blur}px)` }}
        >
          <path d={wavePath(amplitude)} fill={fill} opacity={opacity} />
        </svg>
      </div>
    </div>
  );
}

export function OceanWaves() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Derinlikten sızan ışık huzmeleri */}
      <div
        className="animate-drift absolute -inset-x-1/4 top-0 h-2/3 opacity-70 blur-3xl"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 45% 60% at 25% 0%, oklch(0.82 0.16 195 / 0.18), transparent 70%), radial-gradient(ellipse 35% 70% at 70% 0%, oklch(0.68 0.2 250 / 0.16), transparent 70%)",
        }}
      />

      {/* En arkadaki en yavaş, en soluk ve en bulanık */}
      <WaveLayer
        amplitude={22}
        fill="oklch(0.68 0.2 250)"
        opacity={0.12}
        duration={38}
        bob={11}
        blur={14}
        height="14rem"
        offset="3.5rem"
      />
      <WaveLayer
        amplitude={16}
        fill="oklch(0.82 0.16 195)"
        opacity={0.09}
        duration={27}
        bob={8}
        blur={10}
        reverse
        height="12rem"
        offset="1.75rem"
      />
      <WaveLayer
        amplitude={26}
        fill="oklch(0.21 0.09 270)"
        opacity={0.7}
        duration={19}
        bob={7}
        blur={6}
        height="11rem"
        offset="0.5rem"
      />
      {/* En öndeki katman: tam olarak sayfa zemini rengi, saydamlık yok —
          hero'nun bittiği yerde renk farkı ya da kenar oluşmasın. */}
      <WaveLayer
        amplitude={18}
        fill="var(--background)"
        duration={13}
        bob={5}
        blur={4}
        reverse
        height="9rem"
        offset="0"
      />
    </div>
  );
}
