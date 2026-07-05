import type { GlobalData, MarketCoin } from "@/lib/api/coingecko";
import { getGlobalData, getMarketCoins } from "@/lib/api/coingecko";
import type { DexPool } from "@/lib/api/geckoterminal";
import { getTrendingDexPools } from "@/lib/api/geckoterminal";
import { formatPercent, formatUsd } from "@/lib/format";

export type MarketSummary = {
  summary: string;
  generatedAt: string;
  highlights: Array<{ label: string; value: string }>;
};

type BuildMarketSummaryInput = {
  globalData: GlobalData | null;
  topCoins: MarketCoin[];
  dexPools: DexPool[];
};

export function buildMarketSummaryFromData({
  globalData,
  topCoins,
  dexPools,
}: BuildMarketSummaryInput): MarketSummary {
  if (!globalData) {
    return {
      summary:
        "Market data is temporarily unavailable. Please try again in a few minutes.",
      generatedAt: new Date().toISOString(),
      highlights: [
        { label: "Market Cap", value: "—" },
        { label: "24h Volume", value: "—" },
        { label: "Top DEX Pool", value: dexPools[0]?.name ?? "—" },
        { label: "Active Coins", value: "—" },
      ],
    };
  }

  const global = globalData.data;
  const bestPerformer = [...topCoins].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
  )[0];
  const worstPerformer = [...topCoins].sort(
    (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h,
  )[0];
  const topDexPool = dexPools[0];

  const capChange = global.market_cap_change_percentage_24h_usd;
  const direction = capChange >= 0 ? "up" : "down";

  const summary = [
    `The global crypto market cap is ${formatUsd(global.total_market_cap.usd, true)}, ${direction} ${formatPercent(Math.abs(capChange))} over the last 24 hours.`,
    `BTC dominance sits at ${global.market_cap_percentage.btc.toFixed(1)}% and ETH at ${global.market_cap_percentage.eth.toFixed(1)}%.`,
    topDexPool
      ? `On-chain, ${topDexPool.name} on ${topDexPool.network.toUpperCase()} leads DEX activity with ${formatUsd(topDexPool.volume24h, true)} in 24h volume.`
      : "",
    bestPerformer && worstPerformer
      ? `Among top assets, ${bestPerformer.name} leads 24h gains at ${formatPercent(bestPerformer.price_change_percentage_24h)} while ${worstPerformer.name} lags at ${formatPercent(worstPerformer.price_change_percentage_24h)}.`
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    summary,
    generatedAt: new Date().toISOString(),
    highlights: [
      {
        label: "Market Cap",
        value: formatUsd(global.total_market_cap.usd, true),
      },
      {
        label: "24h Volume",
        value: formatUsd(global.total_volume.usd, true),
      },
      {
        label: "Top DEX Pool",
        value: topDexPool?.name ?? "—",
      },
      {
        label: "Active Coins",
        value: global.active_cryptocurrencies.toLocaleString(),
      },
    ],
  };
}

export async function buildMarketSummary(): Promise<MarketSummary> {
  const [globalData, topCoins, dexPools] = await Promise.all([
    getGlobalData(),
    getMarketCoins(10),
    getTrendingDexPools(),
  ]);

  return buildMarketSummaryFromData({
    globalData,
    topCoins,
    dexPools,
  });
}
