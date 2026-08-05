/**
 * CAD kaynaklı GLB'yi web'e uygun hâle getirir.
 *
 *   npm run model:optimize -- girdi.glb cikti.glb [--error 0.001]
 *
 * İki geçiş var ve sıraları önemli:
 *
 *   1. prune --keep-attributes false
 *      CAD modellerinde doku yoktur ama Blender yine de her vertex'e
 *      TEXCOORD_0 yazar. Hiçbir işe yaramayan bu UV'ler vertex başına 8 bayt
 *      ve GPU belleği demek. Bu adım Draco'dan ÖNCE gelmeli.
 *
 *   2. optimize --compress draco
 *      dedup → instance → join → weld → simplify → draco zinciri.
 *      Draco'lu bir dosyaya sonradan prune uygulanırsa sıkıştırma çözülür ve
 *      yeniden kurulmaz; dosya 15 katına çıkar. Sıra bu yüzden sabit.
 *
 * textureCompress kapalı: doku olmayan modelde gereksiz ve libvips bu
 * dosyalarda "parameter space not set" ile düşüyor.
 */
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * CLI'yi doğrudan node ile çalıştırıyoruz: npx + shell:true kombinasyonunu Node
 * artık uyarıyor (DEP0190) ve boşluklu dosya yollarını bozuyor. Paketin
 * "exports" alanı bin/cli.js'i dışa açmadığı için require.resolve de işe
 * yaramıyor, yolu elle kuruyoruz.
 */
const cli = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "node_modules",
  "@gltf-transform",
  "cli",
  "bin",
  "cli.js",
);

if (!existsSync(cli)) {
  console.error("@gltf-transform/cli bulunamadı. Önce `npm install` çalıştırın.");
  process.exit(1);
}

const args = process.argv.slice(2);
let simplifyError = "0.001";
const positional = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--error") {
    simplifyError = args[++i];
  } else {
    positional.push(args[i]);
  }
}

const [input, output] = positional;

if (!input || !output) {
  console.error("Kullanım: npm run model:optimize -- girdi.glb cikti.glb [--error 0.001]");
  process.exit(1);
}

const mb = (path) => (statSync(path).size / 1024 / 1024).toFixed(2);
const scratch = mkdtempSync(join(tmpdir(), "tauv-glb-"));
const pruned = join(scratch, "pruned.glb");

const run = (label, cliArgs) => {
  const result = spawnSync(process.execPath, [cli, ...cliArgs], {
    stdio: ["ignore", "ignore", "inherit"],
  });
  if (result.status !== 0) {
    throw new Error(`${label} adımı başarısız.`);
  }
};

try {
  const before = mb(input);

  run("prune", ["prune", input, pruned, "--keep-attributes", "false"]);
  run("optimize", [
    "optimize",
    pruned,
    output,
    "--compress",
    "draco",
    "--simplify-error",
    simplifyError,
    "--texture-compress",
    "false",
  ]);

  const after = mb(output);
  console.log(`\n${before} MB → ${after} MB  (simplify-error ${simplifyError})`);
  if (Number(after) > 10) {
    console.log(
      "10 MB üzeri. --error değerini büyütün (örn. 0.005) veya CAD'de daha çok iç parça gizleyin.",
    );
  }
} catch (error) {
  console.error(`\n${error.message}`);
  process.exitCode = 1;
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
