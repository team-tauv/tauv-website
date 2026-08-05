import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Uygulama genelinde `next/link` ve `next/navigation` yerine bunlar kullanılır.
 * href olarak dosya sistemi yolunu ("/vehicles") verirsiniz, aktif locale'e göre
 * doğru URL ("/araclar" veya "/en/vehicles") üretilir. TypeScript, tanımsız bir
 * rotaya link verilmesini derleme anında engeller.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
