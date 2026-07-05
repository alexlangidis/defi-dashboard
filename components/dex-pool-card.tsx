import Link from "next/link";
import { ExternalLink, Flame } from "lucide-react";

import { BuySellBar } from "@/components/buy-sell-bar";
import { DexIcon } from "@/components/dex-icon";
import { NetworkIcon } from "@/components/network-icon";
import { PercentBadge } from "@/components/percent-badge";
import { PoolTokenIcons } from "@/components/pool-token-icons";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { DexPool } from "@/lib/api/geckoterminal";
import { formatUsd } from "@/lib/format";
import { poolDetailPath } from "@/lib/pool-path";
import { cn } from "@/lib/utils";

export function DexPoolCard({
  pool,
  rank,
  className,
}: {
  pool: DexPool;
  rank?: number;
  className?: string;
}) {
  const hot = pool.priceChange24h > 20;
  const positive = pool.priceChange24h >= 0;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:ring-foreground/15 hover:shadow-card",
        hot && "ring-orange-500/20 hover:ring-orange-500/40",
        className,
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -right-12 -top-12 size-32 rounded-full blur-3xl transition-opacity duration-300",
          positive
            ? "bg-emerald-500/10 opacity-60 group-hover:opacity-100"
            : "bg-red-500/10 opacity-60 group-hover:opacity-100",
        )}
      />
      {hot ? (
        <div className="absolute right-3 top-3 z-10">
          <Badge className="gap-1 rounded-full bg-orange-500/15 text-orange-400 hover:bg-orange-500/15">
            <Flame className="size-3" />
            Hot
          </Badge>
        </div>
      ) : null}
      <CardHeader className="pb-2">
        <div className="flex items-start gap-2">
          {rank != null ? (
            <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-muted/60 text-xs font-semibold tabular-nums text-muted-foreground">
              {rank}
            </span>
          ) : null}
          <PoolTokenIcons
            baseToken={pool.baseToken}
            quoteToken={pool.quoteToken}
            network={pool.network}
            size={32}
            className="mt-0.5"
          />
          <div className="min-w-0 flex-1 pr-16">
            <Link
              href={poolDetailPath(pool.network, pool.address)}
              className="truncate font-medium tracking-tight hover:underline"
            >
              {pool.name}
            </Link>
            <p className="flex items-center gap-1.5 truncate text-xs capitalize text-muted-foreground">
              <span className="inline-flex min-w-0 items-center gap-1 truncate">
                <DexIcon
                  dexId={pool.dexId}
                  name={pool.dex}
                  imageUrl={pool.dexImageUrl}
                  size={14}
                />
                <span className="truncate">{pool.dex}</span>
              </span>
              <span aria-hidden>·</span>
              <span className="inline-flex min-w-0 items-center gap-1">
                <NetworkIcon
                  networkId={pool.network}
                  name={pool.networkName}
                  imageUrl={pool.networkImageUrl}
                  size={14}
                />
                <span className="truncate">
                  {pool.networkName ?? pool.network}
                </span>
              </span>
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
              Liquidity
            </p>
            <p className="text-sm font-medium tabular-nums">
              {formatUsd(pool.reserveUsd, true)}
            </p>
          </div>
          <div>
            <p className="text-[0.7rem] uppercase tracking-wider text-muted-foreground">
              24h Volume
            </p>
            <p className="text-sm font-medium tabular-nums">
              {formatUsd(pool.volume24h, true)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">24h change</span>
          <PercentBadge value={pool.priceChange24h} />
        </div>
        <BuySellBar buys={pool.buys24h} sells={pool.sells24h} />
        <div className="flex items-center gap-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <Link
            href={poolDetailPath(pool.network, pool.address)}
            className="text-xs text-primary hover:underline"
          >
            View details
          </Link>
          <Link
            href={pool.geckoTerminalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary"
          >
            GeckoTerminal
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
