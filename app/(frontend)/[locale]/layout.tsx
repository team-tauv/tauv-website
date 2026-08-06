import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { fontVariables } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { defaultLocale, openGraphLocales, type Locale } from "@/lib/locales";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LogoFilters } from "@/components/shared/logo-filters";
import { FETCH_OPTIONS, sanityFetch, SanityLive } from "@/sanity/lib/live";
import { NAV_VEHICLES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

/** Tüm diller derleme anında üretilir — istek anında locale çözümlenmez. */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
    title: { default: t("defaultTitle"), template: `%s · ${t("siteName")}` },
    description: t("defaultDescription"),
    openGraph: {
      type: "website",
      siteName: t("siteName"),
      locale: openGraphLocales[locale as Locale] ?? openGraphLocales[defaultLocale],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Statik render için zorunlu: bu çağrı olmadan sayfa dinamik moda düşer.
  setRequestLocale(locale);

  const queryParams = { locale, defaultLocale };

  const [settings, navVehicles] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, params: queryParams, ...FETCH_OPTIONS }),
    sanityFetch({ query: NAV_VEHICLES_QUERY, params: queryParams, ...FETCH_OPTIONS }),
  ]);

  return (
    <html lang={locale} className={`${fontVariables} dark`} suppressHydrationWarning>
      <body className="min-h-svh antialiased" id="top">
        <LogoFilters />
        <NextIntlClientProvider>
          <Navbar vehicles={navVehicles.data} />
          <main className="pt-18">{children}</main>
          <Footer socials={settings.data?.socials} contactEmail={settings.data?.contactEmail} />
          <Toaster
            theme="dark"
            position="bottom-right"
            // Sonner'ın kendi renkleri yerine site paletini kullanıyor.
            toastOptions={{
              classNames: {
                toast: "!bg-surface !border-border !text-foreground",
                success: "!text-primary",
                error: "!text-destructive",
              },
            }}
          />
        </NextIntlClientProvider>
        <SanityLive />
      </body>
    </html>
  );
}
