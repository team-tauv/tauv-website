import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import "@/app/globals.css";
import { fontVariables } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { defaultLocale } from "@/lib/locales";
import { Toaster } from "sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FETCH_OPTIONS, sanityFetch, SanityLive } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

/** Her iki dil de derleme anında üretilir — istek anında locale çözümlenmez. */
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
      locale: locale === "tr" ? "tr_TR" : "en_US",
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

  const { data: settings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
    params: { locale, defaultLocale },
    ...FETCH_OPTIONS,
  });

  return (
    <html lang={locale} className={`${fontVariables} dark`} suppressHydrationWarning>
      <body className="min-h-svh antialiased" id="top">
        <NextIntlClientProvider>
          <Navbar />
          <main className="pt-18">{children}</main>
          <Footer socials={settings?.socials} contactEmail={settings?.contactEmail} />
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
