import { z } from "zod";

/**
 * Hata mesajları çeviri anahtarıdır, cümle değil — aynı şema hem istemcide
 * (anlık geri bildirim) hem sunucuda (asıl doğrulama) kullanılıyor ve iki
 * tarafta da kullanıcının diline çevrilmesi gerekiyor.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "nameMin").max(80, "nameMax"),
  email: z.email("emailInvalid"),
  subject: z.string().trim().min(3, "subjectMin").max(120, "subjectMax"),
  message: z.string().trim().min(20, "messageMin").max(4000, "messageMax"),

  /**
   * Bal küpü (honeypot): CSS ile gizli, gerçek kullanıcı asla doldurmaz.
   * Formu otomatik dolduran botlar doldurur ve istek sessizce başarılı
   * görünüp atılır. CAPTCHA'sız, kullanıcıya yük bindirmeyen bir filtre.
   */
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { ok: true }
  | { ok: false; error: "validation" | "notConfigured" | "sendFailed" };
