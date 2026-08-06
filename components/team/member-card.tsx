import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import { SanityImageCropped } from "@/components/shared/sanity-image";
import { SocialIcon } from "@/components/shared/social-icon";
import { isStudyYear } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import type { MEMBERS_QUERY_RESULT } from "@/types/sanity.types";

type Member = MEMBERS_QUERY_RESULT[number];

export function MemberCard({ member }: { member: Member }) {
  const t = useTranslations("member");
  const tYear = useTranslations("studyYears");

  // Bilinmeyen bir değer t()'yi patlatacağı için taxonomy'ye karşı doğrulanıyor.
  const year = isStudyYear(member.studyYear) ? tYear(member.studyYear) : null;
  const study = [member.major, year].filter(Boolean).join(" · ");
  const hasLinks = Boolean(member.linkedin || member.github || member.email);

  return (
    <div
      className={cn(
        "group border-border bg-surface relative flex flex-col overflow-hidden rounded-xl border transition-all duration-300",
        member.isLead ? "ring-primary/30 ring-1" : "hover:border-primary/50",
      )}
    >
      <div className="bg-background relative aspect-square overflow-hidden">
        {member.image?.asset ? (
          <SanityImageCropped
            image={member.image}
            alt={member.image.alt || member.name || ""}
            width={600}
            height={600}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="size-full transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="text-muted-foreground/40 flex size-full items-center justify-center">
            <User className="size-12" aria-hidden />
          </div>
        )}

        {member.isLead ? (
          <span className="bg-primary text-primary-foreground absolute top-3 left-3 rounded-md px-2 py-0.5 font-mono text-[10px] font-bold tracking-wide uppercase">
            {t("lead")}
          </span>
        ) : null}

        {/*
          Bağlantılar fotoğrafın alt kenarına biniyor ve yalnızca hover/klavye
          odağında beliriyor; dokunmatikte hover olmadığı için lg altında sürekli
          görünür kalıyorlar, yoksa erişilemezlerdi.
        */}
        {hasLinks ? (
          <div className="absolute inset-x-0 bottom-0 flex justify-center p-3">
            <div className="bg-background/80 flex items-center gap-0.5 rounded-full p-1 backdrop-blur-sm transition-all duration-300 lg:translate-y-1 lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
              {member.linkedin ? (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("linkedinLabel", { name: member.name ?? "" })}
                  className="text-muted-foreground hover:text-primary hover:bg-accent rounded-full p-1.5 transition-colors"
                >
                  <SocialIcon platform="linkedin" />
                </a>
              ) : null}

              {member.github ? (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t("githubLabel", { name: member.name ?? "" })}
                  className="text-muted-foreground hover:text-primary hover:bg-accent rounded-full p-1.5 transition-colors"
                >
                  <SocialIcon platform="github" />
                </a>
              ) : null}

              {member.email ? (
                <a
                  href={`mailto:${member.email}`}
                  aria-label={t("emailLabel", { name: member.name ?? "" })}
                  className="text-muted-foreground hover:text-primary hover:bg-accent rounded-full p-1.5 transition-colors"
                >
                  <SocialIcon platform="email" />
                </a>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col items-center p-4 text-center">
        <h3 className="w-full truncate text-sm font-bold">{member.name}</h3>
        {member.role ? (
          <p className="text-muted-foreground mt-0.5 text-xs leading-snug">{member.role}</p>
        ) : null}
        {study ? (
          <p className="text-muted-foreground/80 mt-1 text-xs leading-snug">{study}</p>
        ) : null}
      </div>
    </div>
  );
}
