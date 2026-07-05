import { getGlobalData, getMarketCoins } from "@/lib/api/coingecko";
import { getChainTvls, getProtocols } from "@/lib/api/defillama";
import { formatPercent, formatUsd } from "@/lib/format";

export type MarketSummary = {
  summary: string;
  generatedAt: string;
  highlights: Array<{ label: string; value: string }>;
};

export async function buildMarketSummary(): Promise<MarketSummary> {
  const [globalData, topCoins, protocols, chains] = await Promise.all([
    getGlobalData(),
    getMarketCoins(5),
    getProtocols(),
    getChainTvls(),
  ]);

  const global = globalData.data;
  const totalTvl = protocols.reduce((sum, p) => sum + (p.tvl ?? 0), 0);
  const topChain = [...chains].sort((a, b) => b.tvl - a.tvl)[0];
  const topProtocol = [...protocols].sort((a, b) => b.tvl - a.tvl)[0];
  const bestPerformer = [...topCoins].sort(
    (a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h,
  )[0];
  const worstPerformer = [...topCoins].sort(
    (a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h,
  )[0];

  const capChange = global.market_cap_change_percentage_24h_usd;
  const direction = capChange >= 0 ? "up" : "down";

  const summary = [
    `The global crypto market cap is ${formatUsd(global.total_market_cap.usd, true)}, ${direction} ${formatPercent(Math.abs(capChange))} over the last 24 hours.`,
    `BTC dominance sits at ${global.market_cap_percentage.btc.toFixed(1)}% and ETH at ${global.market_cap_percentage.eth.toFixed(1)}%.`,
    `Total DeFi TVL across tracked protocols is ${formatUsd(totalTvl, true)}, led by ${topProtocol?.name ?? "—"} on ${topChain?.name ?? "—"}.`,
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
        label: "DeFi TVL",
        value: formatUsd(totalTvl, true),
      },
      {
        label: "Top Chain",
        value: topChain?.name ?? "—",
      },
    ],
  };
}
