"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./language-switcher";
import { Logo } from "./logo";

export function Navbar() {
  const t = useTranslations("nav");
  const tHero = useTranslations("hero");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Sayfa başındayken saydam, kaydırıldığında bulanık zemin.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Rota değişince mobil menü kapansın.
  //
  // Bu iş bilerek effect'te yapılmıyor: effect içinde setState çağırmak fazladan
  // bir render turu doğuruyor ve menü bir kare açık kalıyor. React'in "prop
  // değişince state'i render sırasında düzelt" kalıbı hem tek turda bitiyor hem
  // de geri/ileri tuşlarıyla gelen gezinmeyi de kapsıyor.
  const [lastPathname, setLastPathname] = useState(pathname);
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMenuOpen(false);
  }

  // Menü açıkken arka plan kaymasın.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || menuOpen
          ? "border-border bg-background/80 border-b backdrop-blur-xl"
          : "border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="rounded-lg transition-opacity hover:opacity-80"
          aria-label={t("home")}
        >
          <Logo size={38} priority />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(item.label)}
                  {isActive ? (
                    <motion.span
                      layoutId="nav-active"
                      className="bg-primary absolute inset-x-3 -bottom-px h-0.5 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden lg:inline-flex">
            <Link href="/sponsors">{tHero("ctaSponsor")}</Link>
          </Button>
          <LanguageSwitcher className="hidden sm:flex" />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            className="border-border text-foreground hover:border-primary hover:text-primary flex size-10 items-center justify-center rounded-lg border transition-colors lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="border-border bg-background/95 overflow-hidden border-t backdrop-blur-xl lg:hidden"
          >
            <ul className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block rounded-lg px-3 py-3 text-base font-medium transition-colors",
                        isActive
                          ? "bg-accent text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                      )}
                    >
                      {t(item.label)}
                    </Link>
                  </li>
                );
              })}
              <li className="mt-2 sm:hidden">
                <LanguageSwitcher className="w-fit" />
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
