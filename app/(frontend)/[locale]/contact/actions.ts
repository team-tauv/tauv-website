"use server";

import { Resend } from "resend";
import { contactSchema, type ContactInput, type ContactResult } from "@/lib/validations/contact";

export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  // İstemci doğrulaması yalnızca kolaylık; asıl kapı burası.
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation" };

  const data = parsed.data;

  // Bot doldurmuş: başarılı gibi dönüyoruz ki hangi alanın tuzak olduğunu
  // deneme yanılmayla bulamasın. Mesaj gönderilmiyor.
  if (data.website) return { ok: true };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Yapılandırma eksikse kullanıcıya "gönderildi" demiyoruz — mesajı
    // kaybettiğimizi bilmesi ve e-postayla ulaşabilmesi gerekiyor.
    console.error("İletişim formu yapılandırılmamış: RESEND_API_KEY / CONTACT_TO_EMAIL eksik.");
    return { ok: false, error: "notConfigured" };
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: data.email,
      subject: `[TAUV] ${data.subject}`,
      text: [
        `Gönderen: ${data.name} <${data.email}>`,
        `Konu: ${data.subject}`,
        "",
        data.message,
      ].join("\n"),
    });

    if (error) {
      console.error("Resend gönderim hatası:", error);
      return { ok: false, error: "sendFailed" };
    }

    return { ok: true };
  } catch (err) {
    console.error("İletişim formu beklenmeyen hata:", err);
    return { ok: false, error: "sendFailed" };
  }
}
