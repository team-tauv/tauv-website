import { setRequestLocale } from "next-intl/server";
import { defaultLocale } from "@/lib/locales";
import { FETCH_OPTIONS, sanityFetch } from "@/sanity/lib/live";
import {
  FEATURED_VEHICLE_QUERY,
  LATEST_NEWS_QUERY,
  SITE_SETTINGS_QUERY,
  SPONSOR_MARQUEE_QUERY,
  TARGET_COMPETITIONS_QUERY,
} from "@/sanity/lib/queries";

import { Hero } from "@/components/home/hero";
import { StatsBand } from "@/components/home/stats-band";
import { AboutPreview } from "@/components/home/about-preview";
import { SeasonGoals } from "@/components/home/season-goals";
import { FeaturedVehicle } from "@/components/home/featured-vehicle";
import { SponsorMarquee } from "@/components/home/sponsor-marquee";
import { LatestNews } from "@/components/home/latest-news";

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  setRequestLocale(locale);

  const params = { locale, defaultLocale };

  // Sorgular birbirinden bağımsız — sırayla beklemek yerine paralel çalışsın.
  const [settings, featured, sponsors, news, targets] = await Promise.all([
    sanityFetch({ query: SITE_SETTINGS_QUERY, params, ...FETCH_OPTIONS }),
    sanityFetch({ query: FEATURED_VEHICLE_QUERY, params, ...FETCH_OPTIONS }),
    sanityFetch({ query: SPONSOR_MARQUEE_QUERY, params, ...FETCH_OPTIONS }),
    sanityFetch({ query: LATEST_NEWS_QUERY, params, ...FETCH_OPTIONS }),
    sanityFetch({ query: TARGET_COMPETITIONS_QUERY, params, ...FETCH_OPTIONS }),
  ]);

  return (
    <>
      <Hero
        title={settings.data?.heroTitle}
        tagline={settings.data?.heroTagline}
        videoUrl={settings.data?.heroVideo}
        poster={settings.data?.heroPoster}
      />
      <StatsBand stats={settings.data?.stats ?? null} />
      <AboutPreview
        intro={settings.data?.aboutIntro ?? null}
        photo={settings.data?.teamPhoto ?? null}
      />
      <SeasonGoals targets={targets.data} />
      <FeaturedVehicle vehicle={featured.data} />
      <SponsorMarquee sponsors={sponsors.data} />
      <LatestNews items={news.data} />
    </>
  );
}
