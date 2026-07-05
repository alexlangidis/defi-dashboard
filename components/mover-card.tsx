import Image from "next/image";
import Link from "next/link";

import { PercentBadge } from "@/components/percent-badge";
import { Sparkline } from "@/components/sparkline";
import { Card, CardContent } from "@/components/ui/card";
import type { MarketCoin } from "@/lib/api/coingecko";
import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function MoverCard({
  coin,
  type,
}: {
  coin: MarketCoin;
  type: "gainer" | "loser";
}) {
  const spark = coin.sparkline_in_7d?.price ?? [];
  const positive = type === "gainer";

  return (
    <Link href={`/tokens/${coin.id}`} className="group">
      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-300 hover:ring-foreground/15 hover:shadow-card",
          positive
            ? "hover:ring-emerald-500/30"
            : "hover:ring-red-500/30",
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute -right-10 -top-10 size-24 rounded-full blur-3xl opacity-50 transition-opacity duration-300 group-hover:opacity-100",
            positive ? "bg-emerald-500/15" : "bg-red-500/15",
          )}
        />
        <CardContent className="flex items-center gap-3 p-4">
          <Image
            src={coin.image}
            alt={coin.name}
            width={36}
            height={36}
            className="rounded-full ring-1 ring-foreground/10"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium tracking-tight">{coin.name}</p>
            <p className="text-sm tabular-nums text-muted-foreground">
              {formatUsd(coin.current_price)}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <PercentBadge value={coin.price_change_percentage_24h} />
            {spark.length > 0 ? (
              <Sparkline
                data={spark}
                positive={positive}
                width={72}
                height={24}
              />
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
