import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { defaultLocale } from "@/lib/locales";
import { DEPARTMENT_VALUES, isDepartment } from "@/lib/taxonomy";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import { MEMBERS_QUERY } from "@/sanity/lib/queries";
import { FadeIn } from "@/components/shared/fade-in";
import { SectionHeading } from "@/components/shared/section-heading";
import { MemberCard } from "@/components/team/member-card";

/** Beş departman × iki dil = on sayfa, tamamı derleme anında üretilir. */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    DEPARTMENT_VALUES.map((department) => ({ locale, department })),
  );
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; department: string }>;
}): Promise<Metadata> {
  const { locale, department } = await props.params;
  if (!isDepartment(department)) return {};

  const t = await getTranslations({ locale, namespace: "departments" });
  const tTeam = await getTranslations({ locale, namespace: "team" });

  return {
    title: t(department),
    description: tTeam("departmentDescription", { department: t(department) }),
  };
}

export default async function DepartmentPage(props: {
  params: Promise<{ locale: string; department: string }>;
}) {
  const { locale, department } = await props.params;
  // URL'ye tanımsız bir departman yazılırsa 404 — sessizce boş liste değil.
  if (!isDepartment(department)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "departments" });
  const tTeam = await getTranslations({ locale, namespace: "team" });

  const { data: allMembers } = await sanityFetch({
    query: MEMBERS_QUERY,
    params: { locale, defaultLocale },
    ...FETCH_OPTIONS,
  });

  const members = allMembers.filter((member) => member.department === department);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <Link
        href="/about"
        className="text-muted-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm transition-colors"
      >
        <ArrowLeft className="size-4" />
        {tTeam("backToTeam")}
      </Link>

      <SectionHeading
        className="mt-8"
        eyebrow={tTeam("eyebrow")}
        title={t(department)}
        description={tTeam("departmentDescription", { department: t(department) })}
      />

      {members.length === 0 ? (
        <p className="border-border text-muted-foreground mt-12 rounded-xl border border-dashed p-16 text-center text-sm">
          {tTeam("departmentEmpty")}
        </p>
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {members.map((member, index) => (
            <FadeIn key={member._id} as="li" index={index}>
              <MemberCard member={member} />
            </FadeIn>
          ))}
        </ul>
      )}

      {/* Diğer departmanlara geçiş: kullanıcı üst menüye dönmek zorunda kalmasın. */}
      <nav aria-label={tTeam("filterLabel")} className="border-border mt-16 border-t pt-8">
        <ul className="flex flex-wrap gap-2">
          {DEPARTMENT_VALUES.filter((value) => value !== department).map((value) => (
            <li key={value}>
              <Link
                href={{ pathname: "/about/[department]", params: { department: value } }}
                className="border-border text-muted-foreground hover:border-primary hover:text-primary rounded-lg border px-4 py-2 text-sm transition-colors"
              >
                {t(value)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
