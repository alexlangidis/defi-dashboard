"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LineChart } from "lucide-react";

import { ThemeToggle } from "@/components/theme-toggle";
import { SearchShortcut } from "@/components/search-shortcut";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NAV_ITEMS } from "@/lib/constants/navigation";

export function AppSidebar() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const closeMobileSidebar = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-5">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          onClick={closeMobileSidebar}
        >
          <div className="relative flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent glow-primary">
            <LineChart className="size-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-semibold tracking-tight">
              DeFi Dashboard
            </span>
            <span className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
              Live markets
            </span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[0.65rem] uppercase tracking-wider">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.href}>
                        <item.icon
                          className={active ? "text-primary" : undefined}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-3 border-t border-sidebar-border p-4">
        <div className="flex items-center justify-between">
          <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            Theme
          </p>
          <ThemeToggle />
        </div>
        <div className="space-y-1">
          <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
            Data
          </p>
          <p className="text-xs text-foreground/60">
            CoinGecko · GeckoTerminal
          </p>
          <p className="text-[0.7rem] text-muted-foreground">
            Press <SearchShortcut className="rounded border border-border bg-muted/60 px-1 py-0.5 font-mono text-[0.6rem]" />{" "}
            to search
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
