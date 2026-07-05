import {
  getGlobalData,
  getMarketCoins,
} from "@/lib/api/coingecko";
import { getTrendingDexPools } from "@/lib/api/geckoterminal";
import { buildMarketSummaryFromData } from "@/lib/market-summary";
import { FadeIn } from "@/components/animations";
import { MarketSummaryCard } from "@/components/market-summary-card";

export async function DashboardSummarySection() {
  const [globalData, topCoins, dexPools] = await Promise.all([
    getGlobalData(),
    getMarketCoins(10),
    getTrendingDexPools(),
  ]);

  const summary = buildMarketSummaryFromData({
    globalData,
    topCoins,
    dexPools,
  });

  return (
    <FadeIn delay={0.15} className="min-w-0 2xl:h-full">
      <MarketSummaryCard data={summary} className="2xl:h-full" />
    </FadeIn>
  );
}
