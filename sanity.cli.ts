import { defineCliConfig } from "sanity/cli";
import { dataset, projectId } from "./sanity/env";

export default defineCliConfig({
  api: { projectId, dataset },
  /**
   * Studio Next.js içine gömülü olduğu için `sanity build`/`sanity deploy`
   * kullanılmaz; deploy Vercel üzerinden yapılır. CLI burada esas olarak
   * `sanity schema extract` ve `sanity typegen generate` için var.
   */
  autoUpdates: false,
});
