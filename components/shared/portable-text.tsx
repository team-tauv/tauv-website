import {
  PortableText as PortableTextBase,
  type PortableTextComponents,
} from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { cn } from "@/lib/utils";
import type { BlockContent } from "@/types/sanity.types";

/**
 * Sanity zengin metnini siteye özgü tipografiyle basar.
 *
 * Neden hazır bir prose eklentisi değil: başlık boşlukları, turkuaz bağlantı
 * rengi ve alıntı çizgisi paletle uyumlu olmalı; Tailwind Typography'yi bunlara
 * bastırmak, doğrudan yazmaktan daha uzun sürüyordu.
 */
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-5 leading-relaxed">{children}</p>,
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 text-2xl font-bold tracking-tight sm:text-3xl">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 mb-3 text-xl font-bold tracking-tight sm:text-2xl">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-primary text-muted-foreground my-8 border-l-2 pl-5 italic">
        {children}
      </blockquote>
    ),
  },

  list: {
    bullet: ({ children }) => (
      <ul className="marker:text-primary mb-5 list-disc space-y-2 pl-5">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="marker:text-primary mb-5 list-decimal space-y-2 pl-5">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },

  marks: {
    strong: ({ children }) => <strong className="text-foreground font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-surface text-primary rounded px-1.5 py-0.5 font-mono text-[0.9em]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = String(value?.href ?? "");
      const external = value?.blank || /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className="text-primary underline decoration-current/40 underline-offset-4 transition-colors hover:decoration-current"
        >
          {children}
        </a>
      );
    },
  },

  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <Image
            src={urlFor(value).width(1400).url()}
            alt={value.alt ?? ""}
            width={1400}
            height={933}
            sizes="(max-width: 768px) 100vw, 768px"
            className="border-border w-full rounded-xl border"
          />
          {value.caption ? (
            <figcaption className="text-muted-foreground mt-3 text-center text-sm">
              {value.caption}
            </figcaption>
          ) : null}
        </figure>
      );
    },
  },
};

export function PortableText({
  value,
  className,
}: {
  value: BlockContent | null | undefined;
  className?: string;
}) {
  if (!value || value.length === 0) return null;

  return (
    <div className={cn("text-muted-foreground text-base", className)}>
      <PortableTextBase value={value} components={components} />
    </div>
  );
}
