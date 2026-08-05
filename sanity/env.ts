function assertValue<T>(value: T | undefined, errorMessage: string): T {
  if (value === undefined || value === "") {
    throw new Error(errorMessage);
  }
  return value;
}

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "NEXT_PUBLIC_SANITY_PROJECT_ID tanımlı değil. .env.local dosyasını .env.example'a bakarak doldurun.",
);

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "NEXT_PUBLIC_SANITY_DATASET tanımlı değil.",
);

/**
 * Tarih formatında sabitlenir. Sanity API'si sürümü bu tarihe kilitler, böylece
 * yeni bir API sürümü çıktığında sorgular sessizce davranış değiştirmez.
 */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-08-05";

/** Yalnızca sunucuda okunur. Taslak önizleme ve Live Content API için. */
export const readToken = process.env.SANITY_API_READ_TOKEN ?? "";

export const studioUrl = "/studio";
