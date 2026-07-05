import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { BuySellBar } from "@/components/buy-sell-bar";
import { CoinImage } from "@/components/coin-image";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { DexIcon } from "@/components/dex-icon";
import { NetworkIcon } from "@/components/network-icon";
import { PercentBadge } from "@/components/percent-badge";
import { PoolPriceChart } from "@/components/pool-price-chart";
import { PoolTokenIcons } from "@/components/pool-token-icons";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DexPool } from "@/lib/api/geckoterminal";
import { formatUsd } from "@/lib/format";
import { shortenAddress } from "@/lib/pool-path";
import { cn } from "@/lib/utils";

function PoolTokenCard({
  label,
  token,
  priceUsd,
}: {
  label: string;
  token: DexPool["baseToken"];
  priceUsd: number | null;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          {token.imageUrl ? (
            <CoinImage
              src={token.imageUrl}
              alt={token.symbol}
              size={36}
              className="ring-2 ring-background"
            />
          ) : (
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold uppercase text-muted-foreground ring-2 ring-background">
              {token.symbol.slice(0, 2)}
            </span>
          )}
          <div className="min-w-0">
            <p className="font-medium">{token.name}</p>
            <p className="text-xs uppercase text-muted-foreground">
              {token.symbol}
            </p>
          </div>
        </div>
        {priceUsd != null ? (
          <p className="text-lg font-semibold tabular-nums">
            {formatUsd(priceUsd)}
          </p>
        ) : null}
        {token.address ? (
          <p className="truncate font-mono text-xs text-muted-foreground">
            {shortenAddress(token.address, 8, 6)}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function PoolDetailView({
  pool,
  network,
  address,
  chart,
}: {
  pool: DexPool;
  network: string;
  address: string;
  chart: Array<{ x: number; y: number }>;
}) {
  const positive = pool.priceChange24h >= 0;
  const totalTrades = pool.buys24h + pool.sells24h;
  const buyRatio = totalTrades > 0 ? (pool.buys24h / totalTrades) * 100 : 50;

  return (
    <main className="flex-1 space-y-6 p-4 md:p-8">
      <FadeIn>
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
          <Link href="/dex">
            <ArrowLeft className="size-3.5" />
            Back to pools
          </Link>
        </Button>

        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 shadow-card md:p-8">
          <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
          <div
            className={cn(
              "pointer-events-none absolute -right-24 -top-24 size-72 rounded-full blur-3xl",
              positive ? "bg-emerald-500/15" : "bg-red-500/15",
            )}
          />

          <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-start">
              <PoolTokenIcons
                baseToken={pool.baseToken}
                quoteToken={pool.quoteToken}
                network={pool.network}
                size={52}
                className="shrink-0"
              />
              <div className="min-w-0 space-y-3">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                    {pool.name}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Badge
                      variant="outline"
                      className="gap-1.5 rounded-full px-2.5 py-1 font-normal capitalize"
                    >
                      <DexIcon
                        dexId={pool.dexId}
                        name={pool.dex}
                        imageUrl={pool.dexImageUrl}
                        size={14}
                      />
                      {pool.dex}
                    </Badge>
                    <Badge
                      variant="outline"
                      className="gap-1.5 rounded-full px-2.5 py-1 font-normal"
                    >
                      <NetworkIcon
                        networkId={pool.network}
                        name={pool.networkName}
                        imageUrl={pool.networkImageUrl}
                        size={14}
                      />
                      {pool.networkName ?? pool.network}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-border/50 bg-background/40 px-3 py-2.5">
                    <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      {pool.baseToken.symbol}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums">
                      {pool.baseTokenPriceUsd != null
                        ? formatUsd(pool.baseTokenPriceUsd)
                        : "—"}
                    </p>
                  </div>
                  <div className="rounded-xl border border-border/50 bg-background/40 px-3 py-2.5">
                    <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                      {pool.quoteToken.symbol}
                    </p>
                    <p className="mt-0.5 text-lg font-semibold tabular-nums">
                      {pool.quoteTokenPriceUsd != null
                        ? formatUsd(pool.quoteTokenPriceUsd)
                        : "—"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 flex-col gap-3 xl:items-end">
              <div className="flex items-center gap-2">
                <PercentBadge
                  value={pool.priceChange24h}
                  className="px-3 py-1 text-sm"
                />
                <span className="text-sm text-muted-foreground">24h</span>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {shortenAddress(pool.address, 8, 6)}
              </p>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link
                  href={pool.geckoTerminalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GeckoTerminal
                  <ExternalLink className="size-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>

      <div className="grid gap-6 xl:grid-cols-3">
        <FadeIn delay={0.05} className="xl:col-span-2">
          <PoolPriceChart
            network={network}
            address={address}
            initialData={chart}
            chartHeight="h-64 md:h-72"
          />
        </FadeIn>

        <FadeIn delay={0.08}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-sm font-medium tracking-tight">
                24h Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                    Buy ratio
                  </p>
                  <p className="text-3xl font-semibold tabular-nums text-emerald-400">
                    {buyRatio.toFixed(0)}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                    Trades
                  </p>
                  <p className="text-3xl font-semibold tabular-nums">
                    {totalTrades.toLocaleString()}
                  </p>
                </div>
              </div>
              <BuySellBar buys={pool.buys24h} sells={pool.sells24h} />
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Buys</p>
                  <p className="font-medium tabular-nums text-emerald-400">
                    {pool.buys24h.toLocaleString()}
                  </p>
                </div>
                <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2">
                  <p className="text-xs text-muted-foreground">Sells</p>
                  <p className="font-medium tabular-nums text-red-400">
                    {pool.sells24h.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StaggerItem>
          <StatCard
            title="Liquidity"
            value={formatUsd(pool.reserveUsd, true)}
            accent="primary"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="24h Volume"
            value={formatUsd(pool.volume24h, true)}
            accent="violet"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="24h Buys"
            value={pool.buys24h.toLocaleString()}
            accent="emerald"
          />
        </StaggerItem>
        <StaggerItem>
          <StatCard
            title="24h Sells"
            value={pool.sells24h.toLocaleString()}
          />
        </StaggerItem>
      </StaggerContainer>

      <FadeIn delay={0.1}>
        <div className="grid gap-4 md:grid-cols-2">
          <PoolTokenCard
            label="Base token"
            token={pool.baseToken}
            priceUsd={pool.baseTokenPriceUsd}
          />
          <PoolTokenCard
            label="Quote token"
            token={pool.quoteToken}
            priceUsd={pool.quoteTokenPriceUsd}
          />
        </div>
      </FadeIn>
    </main>
  );
}
