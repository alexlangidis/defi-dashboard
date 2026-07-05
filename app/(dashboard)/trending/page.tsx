import { DashboardHeader } from "@/components/dashboard-header";
import { TrendingTable } from "@/components/tables/trending-table";
import { getTrendingCoins } from "@/lib/api/coingecko";

export default async function TrendingPage() {
  const trending = await getTrendingCoins();

  return (
    <>
      <DashboardHeader
        title="Trending Tokens"
        description="Most searched coins on CoinGecko"
      />
      <main className="flex-1 p-4 md:p-6">
        <TrendingTable data={trending} />
      </main>
    </>
  );
}
