import {
  ArrowUpDown,
  GitCompare,
  Home,
  Newspaper,
  Star,
  TrendingUp,
  Waves,
} from "lucide-react";

export const NAV_ITEMS = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Movers", href: "/movers", icon: ArrowUpDown },
  { title: "Trending", href: "/trending", icon: TrendingUp },
  { title: "DEX Pools", href: "/dex", icon: Waves },
  { title: "Compare", href: "/compare", icon: GitCompare },
  { title: "Watchlist", href: "/watchlist", icon: Star },
  { title: "Market Brief", href: "/market-brief", icon: Newspaper },
] as const;

export const DEX_NETWORKS = [
  { id: "all", label: "All" },
  { id: "eth", label: "Ethereum" },
  { id: "solana", label: "Solana" },
  { id: "bsc", label: "BSC" },
  { id: "base", label: "Base" },
  { id: "arbitrum", label: "Arbitrum" },
] as const;
