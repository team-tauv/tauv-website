import Image from "next/image";
import logoIcon from "@/public/images/logos/logoicon.png";
import logoType from "@/public/images/logos/logotype.png";
import { cn } from "@/lib/utils";

/**
 * Marka kilidi: yuvarlak amblem + kelime işareti.
 *
 * Statik import kullanılıyor (public'ten string yol yerine): Next böylece
 * genişlik/yüksekliği derleme anında okuyup layout shift'i engelliyor ve
 * dosyayı içerik hash'iyle sunuyor.
 *
 * logotype.png beyaz metin/şeffaf zemin — koyu tema için hazır, ek renk
 * işlemi gerekmiyor. Oranı 3.46:1, yükseklik verilip genişlik ondan türetiliyor.
 */

/** logotype.png dosya oranı (1512×437). */
const WORDMARK_RATIO = 1512 / 437;

/**
 * Kelime işaretinin dosya içinde gerçekten mürekkep olan dikey oranı.
 * Ölçüldü: görünür alan 1500×381, üstte 20px altta 36px şeffaf boşluk var.
 * Bu telafi edilmezse verilen yükseklik boşluğu da kapsadığı için metin
 * amblemin yanında olması gerekenden küçük görünüyor.
 */
const WORDMARK_INK_RATIO = 381 / 437;

/** Görünür metin yüksekliğinin amblem kenarına oranı — lockup'ın dengesi. */
const WORDMARK_TO_MARK = 0.62;

type LogoProps = {
  /** Amblem kenarı (px). Kelime işareti buna oranla ölçeklenir. */
  size?: number;
  /** Yalnızca amblem — dar alanlar için. */
  markOnly?: boolean;
  priority?: boolean;
  className?: string;
};

export function Logo({ size = 36, markOnly = false, priority = false, className }: LogoProps) {
  // Önce istenen görünür yükseklik, sonra boşluğu telafi eden gerçek yükseklik.
  const wordmarkHeight = Math.round((size * WORDMARK_TO_MARK) / WORDMARK_INK_RATIO);

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <Image
        src={logoIcon}
        alt=""
        width={size}
        height={size}
        priority={priority}
        // Amblem ve kelime işareti birlikte tek bir adı okutur; ikisini de
        // seslendirmek "TAUV TAUV" ederdi. Bu yüzden amblem dekoratif.
        aria-hidden
        className="shrink-0"
      />
      {markOnly ? (
        <span className="sr-only">TAUV</span>
      ) : (
        <Image
          src={logoType}
          alt="TAUV"
          width={Math.round(wordmarkHeight * WORDMARK_RATIO)}
          height={wordmarkHeight}
          priority={priority}
          className="shrink-0"
        />
      )}
    </span>
  );
}
