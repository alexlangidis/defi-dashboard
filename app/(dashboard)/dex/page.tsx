import { Suspense } from "react";

import { DashboardHeader } from "@/components/dashboard-header";
import { DexNewPoolsTab } from "@/components/dex-new-pools-tab";
import { DexPoolCard } from "@/components/dex-pool-card";
import { NetworkFilter } from "@/components/network-filter";
import { StaggerContainer, StaggerItem } from "@/components/animations";
import { DexPoolTable } from "@/components/tables/dex-pool-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DEX_NETWORKS } from "@/lib/constants/navigation";
import {
  getNetworks,
  getTrendingDexPools,
  getTrendingDexPoolsByNetwork,
} from "@/lib/api/geckoterminal";

export const revalidate = 300;

export default async function DexPage({
  searchParams,
}: {
  searchParams: Promise<{ network?: string }>;
}) {
  const { network } = await searchParams;
  const useNetwork = network && network !== "all";

  const [trending, networks] = await Promise.all([
    useNetwork
      ? getTrendingDexPoolsByNetwork(network)
      : getTrendingDexPools(),
    getNetworks(),
  ]);

  const networkOptions =
    networks.length > 0
      ? [{ id: "all", label: "All" }, ...networks.map((n) => ({ id: n.id, label: n.name }))]
      : [...DEX_NETWORKS];

  return (
    <>
      <DashboardHeader
        title="DEX Pools"
        description="On-chain liquidity via GeckoTerminal"
      />
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <Suspense fallback={<Skeleton className="h-8 w-full max-w-xl" />}>
          <NetworkFilter networks={networkOptions} />
        </Suspense>

        <Tabs defaultValue="cards">
          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="trending">Trending Table</TabsTrigger>
            <TabsTrigger value="new">New Pools</TabsTrigger>
          </TabsList>
          <TabsContent value="cards" className="mt-6">
            {trending.length === 0 ? (
              <p className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
                Pool data is temporarily unavailable. Try again in a few minutes.
              </p>
            ) : (
              <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {trending.slice(0, 12).map((pool, i) => (
                  <StaggerItem key={pool.id}>
                    <DexPoolCard pool={pool} rank={i + 1} className="h-full" />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </TabsContent>
          <TabsContent value="trending" className="mt-6">
            <DexPoolTable data={trending} />
          </TabsContent>
          <TabsContent value="new" className="mt-6">
            <DexNewPoolsTab />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
