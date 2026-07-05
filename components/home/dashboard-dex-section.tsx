import { getTrendingDexPools } from "@/lib/api/geckoterminal";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { DexPoolCard } from "@/components/dex-pool-card";
import { enrichDexPools, getNetworkIconLookup } from "@/lib/network-icons";

export async function DashboardDexSection() {
  const [dexPoolsRaw, networkIcons] = await Promise.all([
    getTrendingDexPools(),
    getNetworkIconLookup(),
  ]);
  const dexPools = enrichDexPools(dexPoolsRaw, networkIcons);

  return (
    <FadeIn delay={0.1} className="min-w-0 space-y-4 2xl:col-span-2">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-tight">
          Trending DEX Pools
        </h2>
      </div>
      {dexPools.length === 0 ? (
        <div className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
          DEX pool data is temporarily unavailable.
        </div>
      ) : (
        <StaggerContainer className="grid gap-4 sm:grid-cols-2">
          {dexPools.slice(0, 6).map((pool, i) => (
            <StaggerItem key={pool.id}>
              <DexPoolCard pool={pool} rank={i + 1} className="h-full" />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}
    </FadeIn>
  );
}
