"use client";

import { useQuery } from "@tanstack/react-query";

import { MarketTable } from "@/components/tables/market-table";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlist } from "@/hooks/use-watchlist";

export default function WatchlistPage() {
  const { items } = useWatchlist();

  const { data: coins = [], isLoading } = useQuery({
    queryKey: ["watchlist-coins", items.map((w) => w.coinId)],
    queryFn: async () => {
      const ids = items.map((w) => w.coinId).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&order=market_cap_desc&sparkline=true&price_change_percentage=7d`,
      );
      if (!res.ok) return [];
      return res.json();
    },
    enabled: items.length > 0,
  });

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <div>
          <h1 className="text-sm font-semibold">Watchlist</h1>
          <p className="text-xs text-muted-foreground">
            Saved locally in your browser
          </p>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-lg border py-16 text-center text-muted-foreground">
            No tokens in your watchlist yet. Star any token from the tables.
          </div>
        ) : (
          <MarketTable data={coins} />
        )}
      </main>
    </>
  );
}
