/**
 * Tek seferlik düzeltme: `sponsorshipPackage.<tier>` id'lerini
 * `sponsorshipPackage-<tier>` biçimine taşır.
 *
 *   npx sanity exec scripts/fix-sponsorship-package-ids.ts --with-user-token
 *
 * Neden: projedeki `public` grubunun okuma izni `_id in path("*")` filtresiyle
 * verilmiş. GROQ'ta `path("*")` yalnızca tek segmentli id'lerle eşleşir, nokta
 * içeren id'lerle eşleşmez. Sonuç: paketler Studio'da (oturum açmış kullanıcı)
 * görünüyor, canlı sitede (anonim istek) `permission` gerekçesiyle atlanıyordu.
 *
 * İçerik olduğu gibi taşınır — Studio'da yapılmış düzenlemeler korunur. Önce
 * yeni doküman yazılır, ardından eskisi silinir; taslak kopyalar da taşınır.
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient();

type Doc = { _id: string; _type: string; [key: string]: unknown };

async function run() {
  const docs: Doc[] = await client
    .withConfig({ perspective: "raw" })
    .fetch(`*[_type == "sponsorshipPackage"]`);

  const stale = docs.filter((doc) => doc._id.includes("."));
  if (stale.length === 0) {
    console.log("Taşınacak doküman yok — id'ler zaten noktasız.");
    return;
  }

  const tx = client.transaction();

  for (const doc of stale) {
    const { _id, _rev, _createdAt, _updatedAt, _system, ...rest } = doc as Record<string, unknown> &
      Doc;
    void _rev;
    void _createdAt;
    void _updatedAt;
    void _system;

    // `drafts.` öneki korunur, gövdedeki nokta tireye çevrilir.
    const isDraft = _id.startsWith("drafts.");
    const base = isDraft ? _id.slice("drafts.".length) : _id;
    const nextId = `${isDraft ? "drafts." : ""}${base.replace(/\./g, "-")}`;

    tx.createOrReplace({ ...rest, _id: nextId } as Doc);
    tx.delete(_id);
    console.log(`${_id} → ${nextId}`);
  }

  await tx.commit();
  console.log(`${stale.length} doküman taşındı.`);
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
