import { getMarketCoins } from "@/lib/api/coingecko";
import { FadeIn } from "@/components/animations";
import { MarketTable } from "@/components/tables/market-table";

export async function DashboardMarketsSection() {
  const marketCoins = await getMarketCoins(10);

  return (
    <FadeIn delay={0.1} className="space-y-4">
      <h2 className="text-sm font-semibold tracking-tight">Top Tokens</h2>
      {marketCoins.length === 0 ? (
        <div className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
          Token data is temporarily unavailable.
        </div>
      ) : (
        <MarketTable data={marketCoins} />
      )}
    </FadeIn>
  );
}
