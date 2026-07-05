import { getTrendingCoins } from "@/lib/api/coingecko";
import { FadeIn } from "@/components/animations";
import { TrendingTable } from "@/components/tables/trending-table";

export async function DashboardTrendingSection() {
  const trending = await getTrendingCoins();

  return (
    <FadeIn delay={0.15} className="space-y-4">
      <h2 className="text-sm font-semibold tracking-tight">Trending Search</h2>
      {trending.length === 0 ? (
        <div className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
          Trending data is temporarily unavailable.
        </div>
      ) : (
        <TrendingTable data={trending.slice(0, 7)} />
      )}
    </FadeIn>
  );
}
