import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { DashboardHeader } from "@/components/dashboard-header";
import { DexPoolCard } from "@/components/dex-pool-card";
import { MarketHero } from "@/components/market-hero";
import { MarketSummaryCard } from "@/components/market-summary-card";
import { MoversSection } from "@/components/movers-section";
import { MarketTable } from "@/components/tables/market-table";
import { TrendingTable } from "@/components/tables/trending-table";
import {
  getGlobalData,
  getMarketCoins,
  getTopGainers,
  getTopLosers,
  getTrendingCoins,
} from "@/lib/api/coingecko";
import { getTrendingDexPools } from "@/lib/api/geckoterminal";
import { buildMarketSummary } from "@/lib/market-summary";

export default async function HomePage() {
  const [
    globalData,
    marketCoins,
    trending,
    dexPools,
    gainers,
    losers,
    summary,
  ] = await Promise.all([
    getGlobalData(),
    getMarketCoins(10),
    getTrendingCoins(),
    getTrendingDexPools(),
    getTopGainers(8),
    getTopLosers(8),
    buildMarketSummary(),
  ]);

  const global = globalData.data;

  return (
    <>
      <DashboardHeader
        title="Dashboard"
        description="Live crypto & on-chain markets"
      />
      <main className="flex-1 space-y-10 p-4 md:p-8">
        <FadeIn>
          <MarketHero
            marketCap={global.total_market_cap.usd}
            marketCapChange={global.market_cap_change_percentage_24h_usd}
            volume={global.total_volume.usd}
            btcDominance={global.market_cap_percentage.btc}
            ethDominance={global.market_cap_percentage.eth}
          />
        </FadeIn>

        <FadeIn delay={0.05}>
          <MoversSection gainers={gainers} losers={losers} />
        </FadeIn>

        <div className="grid gap-6 xl:grid-cols-3">
          <FadeIn delay={0.1} className="space-y-4 xl:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-tight">
                Trending DEX Pools
              </h2>
            </div>
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {dexPools.slice(0, 6).map((pool, i) => (
                <StaggerItem key={pool.id}>
                  <DexPoolCard pool={pool} rank={i + 1} className="h-full" />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </FadeIn>
          <FadeIn delay={0.15}>
            <MarketSummaryCard data={summary} />
          </FadeIn>
        </div>

        <FadeIn delay={0.1} className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">Top Tokens</h2>
          <MarketTable data={marketCoins} />
        </FadeIn>

        <FadeIn delay={0.15} className="space-y-4">
          <h2 className="text-sm font-semibold tracking-tight">
            Trending Search
          </h2>
          <TrendingTable data={trending.slice(0, 7)} />
        </FadeIn>
      </main>
    </>
  );
}
