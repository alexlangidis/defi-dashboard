"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

import { DashboardHeader } from "@/components/dashboard-header";
import { WatchlistTable } from "@/components/tables/watchlist-table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWatchlist } from "@/stores/watchlist-store";

export default function WatchlistPage() {
  const { items } = useWatchlist();
  const compareIds = items
    .slice(0, 3)
    .map((w) => w.coinId)
    .join(",");

  const { data: coins = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["watchlist-coins", items.map((w) => w.coinId)],
    queryFn: async () => {
      const ids = items.map((w) => w.coinId).join(",");
      const res = await fetch(`/api/coins/markets?ids=${ids}`);
      if (!res.ok) throw new Error("Failed to load watchlist");
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
      <main className="flex-1 space-y-4 p-4 md:p-6">
        {items.length >= 2 ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`/compare?ids=${compareIds}`}>Compare watchlist</Link>
          </Button>
        ) : null}

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
        ) : isError ? (
          <div className="rounded-lg border border-dashed py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Could not load watchlist prices.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : (
          <WatchlistTable data={coins} />
        )}
      </main>
    </>
  );
}
