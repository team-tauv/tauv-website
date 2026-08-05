import type { SchemaTypeDefinition } from "sanity";

import { blockContent } from "./objects/blockContent";
import { seo } from "./objects/seo";
import { socialLink } from "./objects/socialLink";
import { specItem } from "./objects/specItem";
import { statItem } from "./objects/statItem";

import { competition } from "./documents/competition";
import { member } from "./documents/member";
import { news } from "./documents/news";
import { siteSettings } from "./documents/siteSettings";
import { sponsor } from "./documents/sponsor";
import { vehicle } from "./documents/vehicle";

export const schemaTypes: SchemaTypeDefinition[] = [
  // Nesneler — dokümanlardan önce kayıt edilmeli, çünkü internationalizedArray
  // eklentisi bunların üzerine türetilmiş tipler üretiyor.
  blockContent,
  seo,
  socialLink,
  specItem,
  statItem,

  // Dokümanlar
  siteSettings,
  vehicle,
  member,
  sponsor,
  competition,
  news,
];

// Departman / katman / araç tipi listeleri artık lib/taxonomy.ts'te —
// hem şemalar hem site bileşenleri oradan okuyor. Buradan tekrar yaymıyoruz
// ki "iki kaynak" izlenimi doğmasın.
export { SOCIAL_PLATFORMS } from "./objects/socialLink";
