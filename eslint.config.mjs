import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/**
 * eslint-config-next 16 düz config dizisini doğrudan dışa veriyor.
 * @eslint/eslintrc + FlatCompat köprüsü hem gereksiz hem de bu sürümde
 * "Converting circular structure to JSON" ile patlıyor.
 */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "next-env.d.ts",
      "sanity/extract.json",
      // Sanity typegen üretimi — elle düzenlenmiyor, kurallara tabi tutmanın anlamı yok.
      "types/sanity.types.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default config;
