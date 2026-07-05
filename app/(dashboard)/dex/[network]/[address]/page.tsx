import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { AreaChart } from "@/components/area-chart";
import { BuySellBar } from "@/components/buy-sell-bar";
import { DashboardHeader } from "@/components/dashboard-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { DexIcon } from "@/components/dex-icon";
import { NetworkIcon } from "@/components/network-icon";
import { PercentBadge } from "@/components/percent-badge";
import { PoolUnavailable } from "@/components/pool-unavailable";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPoolByAddress, getPoolOhlcv } from "@/lib/api/geckoterminal";
import { enrichDexPool, getNetworkIconLookup } from "@/lib/network-icons";
import { normalizePoolAddress } from "@/lib/pool-path";
import { formatUsd } from "@/lib/format";

export const revalidate = 300;

export default async function DexPoolDetailPage({
  params,
}: {
  params: Promise<{ network: string; address: string }>;
}) {
  const { network, address: rawAddress } = await params;
  const address = normalizePoolAddress(rawAddress);

  const poolRaw = await getPoolByAddress(network, address);
  if (!poolRaw) {
    return <PoolUnavailable network={network} address={address} />;
  }

  const [ohlcv, networkIcons] = await Promise.all([
    getPoolOhlcv(network, address, "hour", 48),
    getNetworkIconLookup(),
  ]);

  const pool = enrichDexPool(poolRaw, networkIcons);

  const chart = ohlcv.map((c) => ({ x: c.time * 1000, y: c.close }));
  const positive = pool.priceChange24h >= 0;

  return (
    <>
      <DashboardHeader
        title={pool.name}
        description={
          <span className="inline-flex items-center gap-1.5">
            <DexIcon
              dexId={pool.dexId}
              name={pool.dex}
              imageUrl={pool.dexImageUrl}
              size={16}
            />
            <span className="capitalize">{pool.dex}</span>
            <span>on</span>
            <NetworkIcon
              networkId={pool.network}
              name={pool.networkName}
              imageUrl={pool.networkImageUrl}
              size={16}
            />
            <span>{pool.networkName ?? pool.network}</span>
          </span>
        }
      />
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 shadow-card md:p-8">
            <div
              className={`pointer-events-none absolute -right-20 -top-20 size-56 rounded-full blur-3xl ${
                positive ? "bg-emerald-500/15" : "bg-red-500/15"
              }`}
            />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground capitalize">
                  <DexIcon
                    dexId={pool.dexId}
                    name={pool.dex}
                    imageUrl={pool.dexImageUrl}
                    size={16}
                  />
                  <span>{pool.dex}</span>
                  <span>on</span>
                  <NetworkIcon
                    networkId={pool.network}
                    name={pool.networkName}
                    imageUrl={pool.networkImageUrl}
                    size={16}
                  />
                  <span>{pool.networkName ?? pool.network}</span>
                </p>
                <div className="mt-2 flex items-center gap-3">
                  <PercentBadge value={pool.priceChange24h} />
                  <span className="text-sm text-muted-foreground">24h change</span>
                </div>
              </div>
              <Link
                href={pool.geckoTerminalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
              >
                Open on GeckoTerminal
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          </div>
        </FadeIn>

        {chart.length > 0 ? (
          <FadeIn delay={0.05}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium tracking-tight text-muted-foreground">
                  48h Price (hourly)
                </CardTitle>
              </CardHeader>
              <CardContent className="h-48">
                <AreaChart data={chart} />
              </CardContent>
            </Card>
          </FadeIn>
        ) : null}

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StaggerItem>
            <StatCard title="Liquidity" value={formatUsd(pool.reserveUsd, true)} />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="24h Volume" value={formatUsd(pool.volume24h, true)} />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="24h Buys" value={pool.buys24h.toLocaleString()} />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="24h Sells" value={pool.sells24h.toLocaleString()} />
          </StaggerItem>
        </StaggerContainer>

        <FadeIn delay={0.1}>
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium tracking-tight">
                Buy / Sell pressure (24h)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BuySellBar buys={pool.buys24h} sells={pool.sells24h} />
            </CardContent>
          </Card>
        </FadeIn>
      </main>
    </>
  );
}
