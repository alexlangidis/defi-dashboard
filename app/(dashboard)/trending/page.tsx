import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TrendingTable } from "@/components/tables/trending-table";
import { getTrendingCoins } from "@/lib/api/coingecko";

export default async function TrendingPage() {
  const trending = await getTrendingCoins();

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <div>
          <h1 className="text-sm font-semibold">Trending Tokens</h1>
          <p className="text-xs text-muted-foreground">
            Most searched coins on CoinGecko
          </p>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <TrendingTable data={trending} />
      </main>
    </>
  );
}
