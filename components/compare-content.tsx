"use client";

import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { DashboardHeader } from "@/components/dashboard-header";
import { CoinImage } from "@/components/coin-image";
import { PercentBadge } from "@/components/percent-badge";
import { Sparkline } from "@/components/sparkline";
import { Skeleton } from "@/components/ui/skeleton";
import type { MarketCoin } from "@/lib/api/coingecko";
import { formatUsd } from "@/lib/format";

export function CompareContent() {
  const searchParams = useSearchParams();
  const ids =
    searchParams.get("ids")?.split(",").filter(Boolean).slice(0, 3) ?? [];

  const { data: coins = [], isLoading, isError } = useQuery<MarketCoin[]>({
    queryKey: ["compare", ids],
    queryFn: async () => {
      if (ids.length === 0) return [];
      const res = await fetch(`/api/coins/markets?ids=${ids.join(",")}`);
      if (!res.ok) throw new Error("Failed to load");
      return res.json();
    },
    enabled: ids.length > 0,
  });

  if (ids.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        <p>Add tokens via URL: /compare?ids=bitcoin,ethereum,solana</p>
        <p className="mt-2 text-sm">Or star tokens and open compare from watchlist.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        Failed to load comparison data. Try again later.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-muted-foreground">
            <th className="p-3 font-medium">Metric</th>
            {coins.map((coin) => (
              <th key={coin.id} className="p-3 font-medium">
                <Link
                  href={`/tokens/${coin.id}`}
                  className="flex items-center gap-2 hover:underline"
                >
                  <CoinImage src={coin.image} alt={coin.name} size={24} />
                  {coin.name}
                </Link>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <CompareRow label="Price" values={coins.map((c) => formatUsd(c.current_price))} />
          <CompareRow
            label="24h"
            values={coins.map((c) => (
              <PercentBadge key={c.id} value={c.price_change_percentage_24h} />
            ))}
          />
          <CompareRow
            label="Market Cap"
            values={coins.map((c) => formatUsd(c.market_cap, true))}
          />
          <CompareRow
            label="Volume"
            values={coins.map((c) => formatUsd(c.total_volume, true))}
          />
          <CompareRow
            label="7d"
            values={coins.map((c) => {
              const prices = c.sparkline_in_7d?.price;
              if (!prices?.length) return "—";
              return (
                <Sparkline
                  key={c.id}
                  data={prices}
                  positive={(c.price_change_percentage_7d_in_currency ?? 0) >= 0}
                />
              );
            })}
          />
        </tbody>
      </table>
    </div>
  );
}

function CompareRow({
  label,
  values,
}: {
  label: string;
  values: ReactNode[];
}) {
  return (
    <tr className="border-b last:border-0">
      <td className="p-3 font-medium text-muted-foreground">{label}</td>
      {values.map((value, i) => (
        <td key={i} className="p-3 tabular-nums">
          {value}
        </td>
      ))}
    </tr>
  );
}
