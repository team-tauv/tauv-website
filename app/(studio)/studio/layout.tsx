import type { ReactNode } from "react";

export const metadata = {
  title: "TAUV İçerik Yönetimi",
  robots: { index: false, follow: false },
};

/**
 * Studio'nun kendi kök layout'u. Site tarafındaki layout ile kasıtlı olarak
 * ayrı: Sanity kendi stillerini ve tema yönetimini getiriyor, sitenin global
 * CSS'i ve font değişkenleri buraya sızmamalı.
 */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="tr">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
