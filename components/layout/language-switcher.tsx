"use client";

import { useParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales } from "@/lib/locales";
import { cn } from "@/lib/utils";

/**
 * Dili değiştirirken bulunulan sayfada kalır.
 *
 * usePathname() burada iç şablonu döndürür ("/vehicles/[slug]"), somut yolu
 * değil. Bu yüzden [slug] gibi dinamik parçaları doldurmak için useParams()
 * ile birlikte verilmesi gerekir — aksi hâlde araç detayından dil
 * değiştirince "[slug]" adlı olmayan bir sayfaya gidilir.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("language");
  const activeLocale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // pathname çalışma anında dinamik bir şablon; router.replace ise sabit rota
  // birleşimi bekliyor. Tip sistemi bunu bilemez, tek noktada daraltıyoruz.
  type RouterHref = Parameters<typeof router.replace>[0];

  function switchTo(locale: string) {
    if (locale === activeLocale) return;
    startTransition(() => {
      router.replace({ pathname, params } as RouterHref, { locale });
    });
  }

  return (
    <div
      className={cn(
        "border-border bg-surface/60 flex items-center gap-0.5 rounded-lg border p-0.5",
        isPending && "opacity-60",
        className,
      )}
      role="group"
      aria-label={t("label")}
    >
      <Languages className="text-muted-foreground mx-1.5 size-4" aria-hidden />
      {locales.map((locale) => {
        const isActive = locale === activeLocale;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => switchTo(locale)}
            disabled={isPending}
            aria-current={isActive ? "true" : undefined}
            className={cn(
              "rounded-md px-2.5 py-1 font-mono text-xs font-bold uppercase transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-accent",
            )}
          >
            {locale}
          </button>
        );
      })}
    </div>
  );
}
