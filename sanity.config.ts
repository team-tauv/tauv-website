import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { internationalizedArray } from "sanity-plugin-internationalized-array";

import { sanityLanguages } from "./lib/locales";
import { TranslateMissingAction } from "./sanity/actions/translate-missing";
import { apiVersion, dataset, projectId, studioUrl } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";
import { singletonTypes, structure } from "./sanity/structure";

export default defineConfig({
  basePath: studioUrl,
  projectId,
  dataset,
  title: "TAUV İçerik Yönetimi",

  schema: {
    types: schemaTypes,
    // Tekil dokümanlar "Yeni oluştur" menüsünde görünmesin.
    templates: (prev) => prev.filter((template) => !singletonTypes.has(template.schemaType)),
  },

  document: {
    actions: (prev, { schemaType }) => {
      const actions = singletonTypes.has(schemaType)
        ? prev.filter(
            ({ action }) => action !== "unpublish" && action !== "delete" && action !== "duplicate",
          )
        : prev;

      // Türkçe yazılan alanları eksik dillere çeviren aksiyon. Her doküman
      // tipinde çalışır; çevrilecek alan yoksa kendini devre dışı bırakıyor.
      return [...actions, TranslateMissingAction];
    },
  },

  plugins: [
    structureTool({ structure }),

    internationalizedArray({
      languages: sanityLanguages,
      // Yeni doküman açıldığında yalnızca Türkçe alan hazır gelsin. Diğer
      // diller "Eksik çevirileri doldur" aksiyonuyla ya da "Add translation"
      // ile eklenir; böylece elle doldurmanın zorunlu olmadığı belli oluyor.
      defaultLanguages: ["tr"],
      fieldTypes: ["string", "text", "blockContent"],
      buttonLocations: ["field", "document"],
      languageDisplay: "titleAndCode",
      languageFilter: {
        documentTypes: ["siteSettings", "vehicle", "member", "sponsor", "competition", "news"],
      },
    }),

    // GROQ sorgularını Studio içinden denemek için. Yalnız geliştirmede.
    ...(process.env.NODE_ENV === "development"
      ? [visionTool({ defaultApiVersion: apiVersion })]
      : []),
  ],
});
