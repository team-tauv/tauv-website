import type { Metadata, Viewport } from "next";
import Studio from "./studio";

/** Studio tamamen istemci tarafında çalışır; sunucuda render edilecek bir şey yok. */
export const dynamic = "force-static";

/**
 * next-sanity/studio bu ikisini hazır olarak sunuyor ama oradan re-export
 * etmek paketi sunucu grafiğine geri sokuyor (bkz. studio.tsx). Bu yüzden
 * elle tanımlandı.
 */
export const metadata: Metadata = {
  title: "TAUV İçerik Yönetimi",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  interactiveWidget: "resizes-content",
};

export default function StudioPage() {
  return <Studio />;
}
