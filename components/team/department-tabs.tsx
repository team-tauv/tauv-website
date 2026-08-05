"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useTranslations } from "next-intl";
import { DEPARTMENT_VALUES } from "@/lib/taxonomy";
import { cn } from "@/lib/utils";
import { MemberCard } from "./member-card";
import type { MEMBERS_QUERY_RESULT } from "@/types/sanity.types";

type Members = MEMBERS_QUERY_RESULT;

export function DepartmentTabs({ members }: { members: Members }) {
  const t = useTranslations("departments");
  const tTeam = useTranslations("team");

  // Boş departmanın sekmesi gösterilmez — tıklayınca boş liste çıkması
  // kullanıcıya "bir şey bozuk" hissi veriyor.
  const present = DEPARTMENT_VALUES.filter((value) =>
    members.some((member) => member.department === value),
  );

  if (members.length === 0) {
    return (
      <p className="border-border text-muted-foreground mt-12 rounded-xl border border-dashed p-16 text-center text-sm">
        {tTeam("empty")}
      </p>
    );
  }

  const tabClass =
    "rounded-lg px-4 py-2 text-sm font-medium transition-colors data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:text-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground";

  return (
    <Tabs.Root defaultValue="all" className="mt-12">
      <Tabs.List
        className="border-border bg-surface/50 flex flex-wrap gap-1 rounded-xl border p-1"
        aria-label={tTeam("filterLabel")}
      >
        <Tabs.Trigger value="all" className={tabClass}>
          {tTeam("all")}
        </Tabs.Trigger>
        {present.map((value) => (
          <Tabs.Trigger key={value} value={value} className={tabClass}>
            {t(value)}
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {["all", ...present].map((value) => {
        const shown = value === "all" ? members : members.filter((m) => m.department === value);
        return (
          <Tabs.Content key={value} value={value} className="mt-8 outline-none">
            <ul
              className={cn(
                "grid gap-5",
                "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
              )}
            >
              {shown.map((member) => (
                <li key={member._id}>
                  <MemberCard member={member} />
                </li>
              ))}
            </ul>
          </Tabs.Content>
        );
      })}
    </Tabs.Root>
  );
}
