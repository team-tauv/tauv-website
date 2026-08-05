import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { SanityImageCropped } from "@/components/shared/sanity-image";
import type { LATEST_NEWS_QUERY_RESULT } from "@/types/sanity.types";

type NewsItem = LATEST_NEWS_QUERY_RESULT[number];

export function NewsCard({ item }: { item: NewsItem }) {
  const t = useTranslations("common");
  const format = useFormatter();
  if (!item.slug) return null;

  return (
    <article className="group border-border bg-surface hover:border-primary/50 flex flex-col overflow-hidden rounded-xl border transition-all duration-300">
      <Link
        href={{ pathname: "/news/[slug]", params: { slug: item.slug } }}
        className="flex flex-1 flex-col"
      >
        <div className="bg-background relative aspect-16/9 overflow-hidden">
          <SanityImageCropped
            image={item.coverImage}
            alt={item.coverImage?.alt || item.title || ""}
            width={800}
            height={450}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="size-full transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="flex flex-1 flex-col p-5">
          {item.publishedAt ? (
            <time
              dateTime={item.publishedAt}
              className="text-muted-foreground font-mono text-xs tracking-wide uppercase"
            >
              {format.dateTime(new Date(item.publishedAt), {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
          ) : null}

          <h3 className="group-hover:text-primary mt-2 text-lg leading-snug font-bold tracking-tight transition-colors">
            {item.title}
          </h3>

          {item.excerpt ? (
            <p className="text-muted-foreground mt-3 line-clamp-3 text-sm leading-relaxed">
              {item.excerpt}
            </p>
          ) : null}

          <span className="text-primary mt-auto pt-5 text-sm font-medium">{t("readMore")} →</span>
        </div>
      </Link>
    </article>
  );
}
