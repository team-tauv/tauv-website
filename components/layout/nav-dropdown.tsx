"use client";

import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/constants";
import { DEPARTMENT_VALUES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import type { NAV_VEHICLES_QUERY_RESULT } from "@/types/sanity.types";

export type NavVehicle = NAV_VEHICLES_QUERY_RESULT[number];

/**
 * Masaüstü üst menüsü.
 *
 * Radix NavigationMenu kullanılıyor çünkü salt CSS hover ile yapılan menüler
 * klavyeyle açılmıyor ve durumunu ekran okuyucuya bildirmiyor. Radix hover
 * niyetini (gecikme), Escape ile kapanmayı, ok tuşlarıyla gezinmeyi ve
 * aria-expanded'ı kendisi yönetiyor.
 *
 * Menünün tamamı tek bir listede: açılır panelli maddeler (Hakkımızda,
 * Araçlarımız) ve düz bağlantılar bir arada. Ayrı bileşenlere bölünseydi
 * ok tuşlarıyla gezinme iki grup arasında kopardı.
 */

const linkClass =
  "flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors outline-none focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2";

/**
 * Panel açılış/kapanış animasyonu CSS ile yapılıyor: Radix, Content'i
 * data-state="closed" iken hemen sökmüyor, süren bir animasyon varsa bitmesini
 * bekliyor. Bu yüzden Framer Motion'a gerek yok.
 *
 * Açılış kapanıştan biraz uzun (200ms / 150ms): menüler arasında gezinirken
 * kapanışın çabuk olması gecikme hissini azaltıyor. Ölçek merkezi sol üst,
 * yani tetikleyicinin dibi — panel oradan büyüyor gibi görünsün diye.
 */
const panelClass =
  "border-border bg-background/95 shadow-glow absolute top-full left-0 mt-2 origin-top-left rounded-xl border p-2 backdrop-blur-xl " +
  "data-[state=open]:animate-in data-[state=open]:duration-200 data-[state=open]:ease-[cubic-bezier(0.16,1,0.3,1)] " +
  "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-top-2 " +
  "data-[state=closed]:animate-out data-[state=closed]:duration-150 data-[state=closed]:ease-in " +
  "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:slide-out-to-top-1";

const itemClass =
  "block rounded-lg px-3 py-2.5 text-sm transition-colors outline-none hover:bg-accent focus-visible:bg-accent";

function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <NavigationMenu.Content className={cn(panelClass, className)}>
      <ul>{children}</ul>
    </NavigationMenu.Content>
  );
}

export function DesktopNav({ vehicles }: { vehicles: NavVehicle[] }) {
  const t = useTranslations("nav");
  const tDept = useTranslations("departments");
  const tTeam = useTranslations("team");
  const tVehicle = useTranslations("vehicle");
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const triggerTone = (href: string) =>
    isActive(href) ? "text-primary" : "text-muted-foreground hover:text-foreground";

  return (
    <NavigationMenu.Root delayDuration={100} skipDelayDuration={300} className="hidden lg:block">
      <NavigationMenu.List className="flex items-center gap-1">
        {NAV_ITEMS.map((item) => {
          const hasPanel = item.href === "/about" || item.href === "/vehicles";

          if (!hasPanel) {
            return (
              <NavigationMenu.Item key={item.href}>
                <NavigationMenu.Link asChild active={isActive(item.href)}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(linkClass, triggerTone(item.href))}
                  >
                    {t(item.label)}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            );
          }

          return (
            <NavigationMenu.Item key={item.href} className="relative">
              {/* Hover ile açılıyor (Radix'in varsayılanı). Klavye kullanıcısı
                  için Enter/Space ile de açılır, Escape kapatır. Panelin ilk
                  maddesi başlığın kendi sayfasına gider. */}
              <NavigationMenu.Trigger className={cn(linkClass, "group", triggerTone(item.href))}>
                {t(item.label)}
                <ChevronDown
                  className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
                  aria-hidden
                />
              </NavigationMenu.Trigger>

              {item.href === "/about" ? (
                <Panel className="w-56">
                  <li>
                    <NavigationMenu.Link asChild>
                      <Link href="/about" className={cn(itemClass, "text-foreground font-medium")}>
                        {tTeam("allDepartments")}
                      </Link>
                    </NavigationMenu.Link>
                  </li>
                  <li aria-hidden className="bg-border my-1.5 h-px" />
                  {DEPARTMENT_VALUES.map((department) => (
                    <li key={department}>
                      <NavigationMenu.Link asChild>
                        <Link
                          href={{ pathname: "/about/[department]", params: { department } }}
                          className={cn(itemClass, "text-muted-foreground hover:text-foreground")}
                        >
                          {tDept(department)}
                        </Link>
                      </NavigationMenu.Link>
                    </li>
                  ))}
                </Panel>
              ) : (
                <Panel className="w-72">
                  <li>
                    <NavigationMenu.Link asChild>
                      <Link
                        href="/vehicles"
                        className={cn(itemClass, "text-foreground font-medium")}
                      >
                        {tVehicle("listTitle")}
                      </Link>
                    </NavigationMenu.Link>
                  </li>

                  {vehicles.length > 0 ? (
                    <li aria-hidden className="bg-border my-1.5 h-px" />
                  ) : null}

                  {vehicles.map((vehicle) =>
                    vehicle.slug ? (
                      <li key={vehicle._id}>
                        <NavigationMenu.Link asChild>
                          <Link
                            href={{ pathname: "/vehicles/[slug]", params: { slug: vehicle.slug } }}
                            className={cn(itemClass, "text-muted-foreground hover:text-foreground")}
                          >
                            <span className="flex items-baseline justify-between gap-3">
                              <span className="font-medium">{vehicle.title}</span>
                              <span className="tabular text-xs opacity-70">
                                {vehicle.type} · {vehicle.year}
                              </span>
                            </span>
                          </Link>
                        </NavigationMenu.Link>
                      </li>
                    ) : null,
                  )}
                </Panel>
              )}
            </NavigationMenu.Item>
          );
        })}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
