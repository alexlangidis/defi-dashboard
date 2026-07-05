"use client";

import { GlobalSearch } from "@/components/global-search";
import { RefreshButton } from "@/components/refresh-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-4" />
      <div className="min-w-0 flex-1">
        <h1 className="text-sm font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="truncate text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="flex items-center gap-1">
        <RefreshButton />
        <ThemeToggle />
        <GlobalSearch />
      </div>
    </header>
  );
}
