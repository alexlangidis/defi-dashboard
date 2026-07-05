import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { MarketSummaryCard } from "@/components/market-summary-card";
import { MarketChart } from "@/components/market-chart";
import { StatCard } from "@/components/stat-card";
import { MarketTable } from "@/components/tables/market-table";
import { TrendingTable } from "@/components/tables/trending-table";
import { getGlobalData, getMarketCoins, getTrendingCoins } from "@/lib/api/coingecko";
import { getHistoricalChainTvl, getProtocols } from "@/lib/api/defillama";
import { buildMarketSummary } from "@/lib/market-summary";
import { formatPercent, formatUsd } from "@/lib/format";

export default async function HomePage() {
  const [globalData, marketCoins, trending, protocols, tvlHistory, summary] =
    await Promise.all([
      getGlobalData(),
      getMarketCoins(10),
      getTrendingCoins(),
      getProtocols(),
      getHistoricalChainTvl(),
      buildMarketSummary(),
    ]);

  const totalTvl = protocols.reduce((sum, p) => sum + (p.tvl ?? 0), 0);
  const recentTvl = tvlHistory.slice(-30);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <div>
          <h1 className="text-sm font-semibold">Dashboard</h1>
          <p className="text-xs text-muted-foreground">
            Market overview and DeFi metrics
          </p>
        </div>
      </header>
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Market Cap"
            value={formatUsd(globalData.data.total_market_cap.usd, true)}
            change={formatPercent(
              globalData.data.market_cap_change_percentage_24h_usd,
            )}
          />
          <StatCard
            title="24h Volume"
            value={formatUsd(globalData.data.total_volume.usd, true)}
          />
          <StatCard
            title="BTC Dominance"
            value={`${globalData.data.market_cap_percentage.btc.toFixed(1)}%`}
          />
          <StatCard
            title="Total DeFi TVL"
            value={formatUsd(totalTvl, true)}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 rounded-lg border p-4">
            <h2 className="mb-4 text-sm font-semibold">DeFi TVL (30d)</h2>
            <MarketChart data={recentTvl.map((p) => ({ date: p.date, value: p.tvl }))} />
          </div>
          <MarketSummaryCard data={summary} />
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Top Tokens</h2>
          <MarketTable data={marketCoins} />
        </div>

        <div className="space-y-4">
          <h2 className="text-sm font-semibold">Trending</h2>
          <TrendingTable data={trending.slice(0, 7)} />
        </div>
      </main>
    </>
  );
}
