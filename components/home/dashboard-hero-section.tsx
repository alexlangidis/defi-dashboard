import { getGlobalData, getGlobalMarketCapChart } from "@/lib/api/coingecko";
import { FadeIn } from "@/components/animations";
import { MarketHero } from "@/components/market-hero";

export async function DashboardHeroSection() {
  const [globalData, capChart] = await Promise.all([
    getGlobalData(),
    getGlobalMarketCapChart(7),
  ]);

  if (!globalData) {
    return (
      <FadeIn>
        <div className="rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">
          Global market data is temporarily unavailable.
        </div>
      </FadeIn>
    );
  }

  const global = globalData.data;
  const chart = capChart.map(([ts, cap]) => ({ x: ts, y: cap }));

  return (
    <FadeIn>
      <MarketHero
        marketCap={global.total_market_cap.usd}
        marketCapChange={global.market_cap_change_percentage_24h_usd}
        volume={global.total_volume.usd}
        btcDominance={global.market_cap_percentage.btc}
        ethDominance={global.market_cap_percentage.eth}
        capChart={chart}
      />
    </FadeIn>
  );
}
