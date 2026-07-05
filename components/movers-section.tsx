import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MoverCard } from "@/components/mover-card";
import { Button } from "@/components/ui/button";
import type { MarketCoin } from "@/lib/api/coingecko";

export function MoversSection({
  gainers,
  losers,
}: {
  gainers: MarketCoin[];
  losers: MarketCoin[];
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-emerald-500">
            Top Gainers
          </h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/movers">
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {gainers.slice(0, 4).map((coin) => (
            <MoverCard key={coin.id} coin={coin} type="gainer" />
          ))}
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-red-500">Top Losers</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/movers">
              View all
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {losers.slice(0, 4).map((coin) => (
            <MoverCard key={coin.id} coin={coin} type="loser" />
          ))}
        </div>
      </div>
    </div>
  );
}
