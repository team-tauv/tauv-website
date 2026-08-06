import { defineQuery } from "next-sanity";

/* ---------------------------------------------------------------------------
 * Tüm sorgular iki parametre bekler: $locale ve $defaultLocale.
 * sanity/lib/i18n.ts içindeki localeParams(locale) bunları üretir.
 *
 * Çeviri girilmemiş alanlarda coalesce ikinci argümana düşer, yani içerik
 * varsayılan dile (tr) yedeklenir. Hiçbir dilde değer yoksa null döner.
 * ------------------------------------------------------------------------- */

const IMAGE = /* groq */ `
  ...,
  "alt": coalesce(alt, ""),
  asset->{
    _id,
    "lqip": metadata.lqip,
    "dimensions": metadata.dimensions
  }
`;

const SEO = /* groq */ `
  "seo": {
    "title": coalesce(seo.title[language == $locale][0].value, seo.title[language == $defaultLocale][0].value),
    "description": coalesce(seo.description[language == $locale][0].value, seo.description[language == $defaultLocale][0].value),
    "ogImage": seo.ogImage{${IMAGE}},
    "noIndex": coalesce(seo.noIndex, false)
  }
`;

/* --------------------------------- Araç --------------------------------- */

const VEHICLE_CARD = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  year,
  type,
  status,
  "tagline": coalesce(tagline[language == $locale][0].value, tagline[language == $defaultLocale][0].value),
  mainImage{${IMAGE}},
  "highlights": specs[highlight == true][0...3]{
    "label": coalesce(label[language == $locale][0].value, label[language == $defaultLocale][0].value),
    "value": coalesce(value[language == $locale][0].value, value[language == $defaultLocale][0].value)
  }
`;

export const VEHICLES_QUERY = defineQuery(`
  *[_type == "vehicle"] | order(year desc, title asc) {
    ${VEHICLE_CARD}
  }
`);

/**
 * Navbar açılır menüsü için sadeleştirilmiş liste — her sayfada çalıştığı için
 * görsel ve teknik özellik gibi ağır alanlar kasıtlı olarak çekilmiyor.
 */
export const NAV_VEHICLES_QUERY = defineQuery(`
  *[_type == "vehicle" && defined(slug.current)] | order(year desc, title asc) {
    _id,
    title,
    "slug": slug.current,
    year,
    type,
    "tagline": coalesce(tagline[language == $locale][0].value, tagline[language == $defaultLocale][0].value)
  }
`);

export const FEATURED_VEHICLE_QUERY = defineQuery(`
  *[_type == "vehicle" && featured == true] | order(year desc)[0] {
    ${VEHICLE_CARD}
  }
`);

/** generateStaticParams için — dil parametresi gerektirmez. */
export const VEHICLE_SLUGS_QUERY = defineQuery(`
  *[_type == "vehicle" && defined(slug.current)]{ "slug": slug.current }
`);

export const VEHICLE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "vehicle" && slug.current == $slug][0] {
    ${VEHICLE_CARD},
    renderUrl,
    "model3dUrl": model3d.asset->url,
    modelPoster{${IMAGE}},
    "description": coalesce(description[language == $locale][0].value, description[language == $defaultLocale][0].value),
    "specs": specs[]{
      "label": coalesce(label[language == $locale][0].value, label[language == $defaultLocale][0].value),
      "value": coalesce(value[language == $locale][0].value, value[language == $defaultLocale][0].value),
      icon,
      highlight
    },
    "gallery": gallery[]{
      ${IMAGE},
      "caption": coalesce(caption[language == $locale][0].value, caption[language == $defaultLocale][0].value)
    },
    "competitions": *[_type == "competition" && references(^._id)] | order(date desc) {
      _id, name, year, rank,
      "result": coalesce(result[language == $locale][0].value, result[language == $defaultLocale][0].value)
    },
    ${SEO}
  }
`);

/* --------------------------------- Üye ---------------------------------- */

export const MEMBERS_QUERY = defineQuery(`
  *[_type == "member" && active == true]
    | order(isLead desc, order asc, name asc) {
      _id,
      name,
      department,
      isLead,
      "role": coalesce(role[language == $locale][0].value, role[language == $defaultLocale][0].value),
      "major": coalesce(major[language == $locale][0].value, major[language == $defaultLocale][0].value),
      studyYear,
      image{${IMAGE}},
      linkedin,
      github,
      email
    }
`);

/* ------------------------------- Sponsor -------------------------------- */

const SPONSOR_FIELDS = /* groq */ `
  _id,
  name,
  tier,
  website,
  logo{${IMAGE}},
  logoMode
`;

export const SPONSORS_QUERY = defineQuery(`
  *[_type == "sponsor"] | order(order asc, name asc) {
    ${SPONSOR_FIELDS},
    "description": coalesce(description[language == $locale][0].value, description[language == $defaultLocale][0].value)
  }
`);

/** Ana sayfadaki kayan şerit — açıklama ve sıra bilgisine ihtiyaç yok. */
export const SPONSOR_MARQUEE_QUERY = defineQuery(`
  *[_type == "sponsor" && showInMarquee == true] | order(order asc, name asc) {
    ${SPONSOR_FIELDS}
  }
`);

/**
 * Katman sırası GROQ'ta değil, bileşende lib/taxonomy.ts'teki TIER_VALUES ile
 * veriliyor — "main, platinum, gold…" alfabetik de sayısal da değil, tek doğru
 * sıra o listede.
 */
export const SPONSORSHIP_PACKAGES_QUERY = defineQuery(`
  *[_type == "sponsorshipPackage"] {
    _id,
    tier,
    featured,
    "priceLabel": coalesce(priceLabel[language == $locale][0].value, priceLabel[language == $defaultLocale][0].value),
    "benefits": coalesce(benefits[language == $locale][0].value, benefits[language == $defaultLocale][0].value),
    "note": coalesce(note[language == $locale][0].value, note[language == $defaultLocale][0].value)
  }
`);

/* ------------------------------ Yarışma --------------------------------- */

export const COMPETITIONS_QUERY = defineQuery(`
  *[_type == "competition"] | order(date desc) {
    _id,
    name,
    organizer,
    year,
    date,
    rank,
    "location": coalesce(location[language == $locale][0].value, location[language == $defaultLocale][0].value),
    "result": coalesce(result[language == $locale][0].value, result[language == $defaultLocale][0].value),
    "description": coalesce(description[language == $locale][0].value, description[language == $defaultLocale][0].value),
    coverImage{${IMAGE}},
    certificate{${IMAGE}},
    "technicalReport": technicalReport.asset->url,
    "vehiclesUsed": vehiclesUsed[]->{ _id, title, "slug": slug.current }
  }
`);

/**
 * Ana sayfadaki "Sezon Hedeflerimiz" bölümü. Geçmiş zaman çizelgesinden farkı:
 * yalnızca `targeted` işaretli kayıtlar geliyor ve sıra tarihe göre ileriye
 * doğru — hedefte sıradaki yarışma en üstte olmalı.
 */
export const TARGET_COMPETITIONS_QUERY = defineQuery(`
  *[_type == "competition" && targeted == true] | order(date asc) {
    _id,
    name,
    organizer,
    year,
    date,
    "location": coalesce(location[language == $locale][0].value, location[language == $defaultLocale][0].value),
    "goal": coalesce(goal[language == $locale][0].value, goal[language == $defaultLocale][0].value)
  }
`);

/**
 * Sponsorluk sayfasındaki "Başarılarımız" vitrini. Yarışma zaman çizelgesinden
 * farkı: yalnızca derece girilmiş kayıtlar geliyor ve ağır alanlar (görsel,
 * açıklama, rapor) çekilmiyor — burada amaç anlatmak değil, kanıt sıralamak.
 */
export const ACHIEVEMENTS_QUERY = defineQuery(`
  *[_type == "competition" && defined(result[language == $defaultLocale][0].value)]
    | order(date desc)[0...6] {
      _id,
      name,
      year,
      rank,
      "result": coalesce(result[language == $locale][0].value, result[language == $defaultLocale][0].value)
    }
`);

/* -------------------------------- Haber --------------------------------- */

const NEWS_CARD = /* groq */ `
  _id,
  "slug": slug.current,
  publishedAt,
  "title": coalesce(title[language == $locale][0].value, title[language == $defaultLocale][0].value),
  "excerpt": coalesce(excerpt[language == $locale][0].value, excerpt[language == $defaultLocale][0].value),
  coverImage{${IMAGE}}
`;

export const NEWS_QUERY = defineQuery(`
  *[_type == "news"] | order(publishedAt desc) {
    ${NEWS_CARD}
  }
`);

export const LATEST_NEWS_QUERY = defineQuery(`
  *[_type == "news"] | order(publishedAt desc)[0...3] {
    ${NEWS_CARD}
  }
`);

export const NEWS_SLUGS_QUERY = defineQuery(`
  *[_type == "news" && defined(slug.current)]{ "slug": slug.current }
`);

export const NEWS_BY_SLUG_QUERY = defineQuery(`
  *[_type == "news" && slug.current == $slug][0] {
    ${NEWS_CARD},
    "content": coalesce(content[language == $locale][0].value, content[language == $defaultLocale][0].value),
    "relatedVehicle": relatedVehicle->{ ${VEHICLE_CARD} },
    ${SEO}
  }
`);

/* ----------------------------- Site Ayarları ---------------------------- */

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0] {
    "heroTitle": coalesce(heroTitle[language == $locale][0].value, heroTitle[language == $defaultLocale][0].value),
    "heroTagline": coalesce(heroTagline[language == $locale][0].value, heroTagline[language == $defaultLocale][0].value),
    "heroVideo": heroVideo.asset->url,
    heroPoster{${IMAGE}},
    "stats": stats[]{
      value,
      suffix,
      "label": coalesce(label[language == $locale][0].value, label[language == $defaultLocale][0].value)
    },
    "mission": coalesce(mission[language == $locale][0].value, mission[language == $defaultLocale][0].value),
    "vision": coalesce(vision[language == $locale][0].value, vision[language == $defaultLocale][0].value),
    "aboutIntro": coalesce(aboutIntro[language == $locale][0].value, aboutIntro[language == $defaultLocale][0].value),
    teamPhoto{${IMAGE}},
    "sponsorshipPitch": coalesce(sponsorshipPitch[language == $locale][0].value, sponsorshipPitch[language == $defaultLocale][0].value),
    "sponsorshipDeck": sponsorshipDeck.asset->url,
    "sponsorshipStats": sponsorshipStats[]{
      value,
      suffix,
      "label": coalesce(label[language == $locale][0].value, label[language == $defaultLocale][0].value)
    },
    recruitmentOpen,
    "recruitmentNotice": coalesce(recruitmentNotice[language == $locale][0].value, recruitmentNotice[language == $defaultLocale][0].value),
    recruitmentUrl,
    contactEmail,
    "address": coalesce(address[language == $locale][0].value, address[language == $defaultLocale][0].value),
    mapEmbedUrl,
    socials[]{ platform, url },
    "defaultSeo": {
      "title": coalesce(defaultSeo.title[language == $locale][0].value, defaultSeo.title[language == $defaultLocale][0].value),
      "description": coalesce(defaultSeo.description[language == $locale][0].value, defaultSeo.description[language == $defaultLocale][0].value),
      "ogImage": defaultSeo.ogImage{${IMAGE}}
    }
  }
`);
