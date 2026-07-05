import { Newspaper } from "lucide-react";

import { MarketSummaryCard } from "@/components/market-summary-card";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { buildMarketSummary } from "@/lib/market-summary";

export default async function MarketBriefPage() {
  const summary = await buildMarketSummary();

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <div>
          <h1 className="text-sm font-semibold">Market Brief</h1>
          <p className="text-xs text-muted-foreground">
            Live summary built from CoinGecko and DefiLlama data
          </p>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="max-w-3xl">
          <MarketSummaryCard data={summary} />
        </div>
      </main>
    </>
  );
}
