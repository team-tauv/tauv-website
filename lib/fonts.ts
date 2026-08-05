import { Ubuntu, Ubuntu_Mono } from "next/font/google";

/**
 * Gövde ve başlık fontu. latin-ext alt kümesi Türkçe karakterler (ğ ş ı İ ç ö ü)
 * için zorunlu — yalnız "latin" seçilirse bu harfler yedek fonta düşer ve
 * satır içinde göze çarpan bir karışıklık oluşur.
 */
export const ubuntu = Ubuntu({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
  display: "swap",
  preload: true,
});

/**
 * Teknik metrikler için: ağırlık, derinlik, motor sayısı, sensör listeleri.
 * Tabular hizalama sağladığı için spec tablolarında rakamlar alt alta oturur.
 */
export const ubuntuMono = Ubuntu_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "700"],
  variable: "--font-ubuntu-mono",
  display: "swap",
  preload: false,
});

export const fontVariables = `${ubuntu.variable} ${ubuntuMono.variable}`;
