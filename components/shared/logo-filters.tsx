/**
 * Logo boyama filtrelerinin SVG tanımı. Layout'ta bir kez basılır; CSS
 * tarafında `filter: url("#logo-key-white")` ile çağrılır (globals.css,
 * .logo-mono-key).
 *
 * Matris ne yapıyor: RGB satırları sabit 1 döndürür — renk ne olursa olsun
 * çıktı beyaz. Alfa satırı kanalların ortalamasını negatif katsayıyla toplayıp
 * 1.1 ekler, yani alfa ≈ 1.1 − 1.35·parlaklık: beyaz zemin şeffaflaşır, koyu
 * marka opak beyaz kalır, kenar yumuşamaları arada kalıp tırtıklanmayı önler.
 * Katsayılar kanallara eşit dağıtıldı; ITU luminans ağırlıkları kullanılsaydı
 * saf yeşil bir logo neredeyse tamamen kaybolurdu.
 *
 * Yalnızca opak (şeffaflığı olmayan) görseller için: kaynakta şeffaf bir alan
 * varsa RGB'si 0 kabul edilip beyaza döner. Şeffaf logolarda .logo-mono
 * kullanılıyor, o yüzden pratikte çakışmıyor.
 */
export function LogoFilters() {
  return (
    <svg aria-hidden="true" focusable="false" className="pointer-events-none absolute size-0">
      <filter id="logo-key-white" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1
                  0 0 0 0 1
                  0 0 0 0 1
                  -0.45 -0.45 -0.45 0 1.1"
        />
      </filter>
    </svg>
  );
}
