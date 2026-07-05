import { getMarketMovers } from "@/lib/api/coingecko";
import { FadeIn } from "@/components/animations";
import { MoversSection } from "@/components/movers-section";

export async function DashboardMoversSection() {
  const { gainers, losers } = await getMarketMovers(20);

  if (gainers.length === 0 && losers.length === 0) {
    return (
      <FadeIn delay={0.05}>
        <div className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
          Mover data is temporarily unavailable.
        </div>
      </FadeIn>
    );
  }

  return (
    <FadeIn delay={0.05}>
      <MoversSection gainers={gainers} losers={losers} />
    </FadeIn>
  );
}
