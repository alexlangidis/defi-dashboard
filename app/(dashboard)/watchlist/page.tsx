"use client";

import { useQuery } from "@tanstack/react-query";

import { DashboardHeader } from "@/components/dashboard-header";
import { MarketTable } from "@/components/tables/market-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlist } from "@/stores/watchlist-store";

export default function WatchlistPage() {
  const { items } = useWatchlist();

  const { data: coins = [], isLoading } = useQuery({
    queryKey: ["watchlist-coins", items.map((w) => w.coinId)],
    queryFn: async () => {
      const ids = items.map((w) => w.coinId).join(",");
      const res = await fetch(`/api/coins/markets?ids=${ids}`);
      if (!res.ok) return [];
      return res.json();
    },
    enabled: items.length > 0,
  });

  return (
    <>
      <DashboardHeader
        title="Watchlist"
        description="Saved locally in your browser"
      />
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
