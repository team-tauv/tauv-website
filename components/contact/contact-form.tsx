"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { sendContactMessage } from "@/app/(frontend)/[locale]/contact/actions";
import { contactSchema, type ContactInput } from "@/lib/validations/contact";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const t = useTranslations("contact.form");
  const tErrors = useTranslations("contact.errors");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  async function onSubmit(values: ContactInput) {
    const result = await sendContactMessage(values);
    if (result.ok) {
      toast.success(t("success"));
      reset();
    } else {
      toast.error(tErrors(result.error));
    }
  }

  const fieldClass =
    "w-full rounded-lg border border-input bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary";

  /** Zod mesajları çeviri anahtarı olarak geliyor; burada cümleye dönüyor. */
  const messageFor = (key?: string) => (key ? tErrors(key) : undefined);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {/* Bal küpü — ekranda ve ekran okuyucuda yok, yalnızca botlar doldurur. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            {t("name")}
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={cn(fieldClass, errors.name && "border-destructive")}
            {...register("name")}
          />
          {errors.name ? (
            <p id="name-error" className="text-destructive mt-1.5 text-xs">
              {messageFor(errors.name.message)}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium">
            {t("email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={cn(fieldClass, errors.email && "border-destructive")}
            {...register("email")}
          />
          {errors.email ? (
            <p id="email-error" className="text-destructive mt-1.5 text-xs">
              {messageFor(errors.email.message)}
            </p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="mb-2 block text-sm font-medium">
          {t("subject")}
        </label>
        <input
          id="subject"
          type="text"
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          className={cn(fieldClass, errors.subject && "border-destructive")}
          {...register("subject")}
        />
        {errors.subject ? (
          <p id="subject-error" className="text-destructive mt-1.5 text-xs">
            {messageFor(errors.subject.message)}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="message" className="mb-2 block text-sm font-medium">
          {t("message")}
        </label>
        <textarea
          id="message"
          rows={6}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          className={cn(fieldClass, "resize-y", errors.message && "border-destructive")}
          {...register("message")}
        />
        {errors.message ? (
          <p id="message-error" className="text-destructive mt-1.5 text-xs">
            {messageFor(errors.message.message)}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg">
        <Send />
        {isSubmitting ? t("sending") : t("submit")}
      </Button>
    </form>
  );
}
