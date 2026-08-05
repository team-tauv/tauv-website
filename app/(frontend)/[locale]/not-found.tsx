import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const t = useTranslations("common");

  return (
    <div className="mx-auto flex min-h-[60svh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <p className="text-primary font-mono text-6xl font-bold">404</p>
      <h1 className="mt-6 text-3xl font-bold tracking-tight">{t("notFoundTitle")}</h1>
      <p className="text-muted-foreground mt-4">{t("notFoundBody")}</p>
      <Button asChild className="mt-8">
        <Link href="/">{t("backHome")}</Link>
      </Button>
    </div>
  );
}
