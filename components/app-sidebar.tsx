"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Coins,
  Home,
  Landmark,
  LineChart,
  Newspaper,
  Star,
  TrendingUp,
} from "lucide-react";

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
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Trending", href: "/trending", icon: TrendingUp },
  { title: "Protocols", href: "/protocols", icon: Landmark },
  { title: "Yield Pools", href: "/yields", icon: BarChart3 },
  { title: "Stablecoins", href: "/stablecoins", icon: Coins },
  { title: "Watchlist", href: "/watchlist", icon: Star },
  { title: "Market Brief", href: "/market-brief", icon: Newspaper },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <LineChart className="size-5 text-primary" />
          <span>DeFi Dashboard</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    }
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <p className="text-xs text-muted-foreground">
          Free data from CoinGecko & DefiLlama. No API keys required.
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
