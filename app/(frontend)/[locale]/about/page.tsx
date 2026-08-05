import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { defaultLocale } from "@/lib/locales";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import { MEMBERS_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { SanityImageCropped } from "@/components/shared/sanity-image";
import { SectionHeading } from "@/components/shared/section-heading";
import { PortableText } from "@/components/shared/portable-text";
import { FadeIn } from "@/components/shared/fade-in";
import { DepartmentTabs } from "@/components/team/department-tabs";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("title"), description: t("description") };
}

export default async function AboutPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const tTeam = await getTranslations({ locale, namespace: "team" });
  const params = { locale, defaultLocale };

  const [settings, members] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, params, ...FETCH_OPTIONS }),
    sanityFetch({ query: MEMBERS_QUERY, params, ...FETCH_OPTIONS }),
  ]);

  const data = settings.data;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading eyebrow={t("eyebrow")} title={t("title")} description={t("description")} />

      {data?.aboutIntro ? (
        <FadeIn className="mt-10 max-w-3xl">
          <p className="text-muted-foreground text-lg leading-relaxed">{data.aboutIntro}</p>
        </FadeIn>
      ) : null}

      {data?.teamPhoto?.asset ? (
        <FadeIn className="mt-12">
          <SanityImageCropped
            image={data.teamPhoto}
            alt={data.teamPhoto.alt || t("title")}
            width={1600}
            height={800}
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="border-border w-full rounded-2xl border"
          />
        </FadeIn>
      ) : null}

      {data?.mission || data?.vision ? (
        <div className="mt-20 grid gap-8 md:grid-cols-2">
          {data?.mission ? (
            <FadeIn className="border-border bg-surface rounded-2xl border p-8">
              <h2 className="text-primary font-mono text-xs font-bold tracking-[0.2em] uppercase">
                {t("mission")}
              </h2>
              <PortableText value={data.mission} className="mt-4" />
            </FadeIn>
          ) : null}

          {data?.vision ? (
            <FadeIn index={1} className="border-border bg-surface rounded-2xl border p-8">
              <h2 className="text-primary font-mono text-xs font-bold tracking-[0.2em] uppercase">
                {t("vision")}
              </h2>
              <PortableText value={data.vision} className="mt-4" />
            </FadeIn>
          ) : null}
        </div>
      ) : null}

      <section className="mt-24">
        <SectionHeading
          eyebrow={tTeam("eyebrow")}
          title={tTeam("title")}
          description={tTeam("description")}
        />
        <DepartmentTabs members={members.data} />
      </section>
    </div>
  );
}
