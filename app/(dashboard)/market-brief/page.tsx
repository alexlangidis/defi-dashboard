import { DashboardHeader } from "@/components/dashboard-header";
import { MarketSummaryCard } from "@/components/market-summary-card";
import { buildMarketSummary } from "@/lib/market-summary";

export default async function MarketBriefPage() {
  const summary = await buildMarketSummary();

  return (
    <>
      <DashboardHeader
        title="Market Brief"
        description="Live summary from CoinGecko and GeckoTerminal"
      />
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl">
          <MarketSummaryCard data={summary} />
        </div>
      </main>
    </>
  );
}
