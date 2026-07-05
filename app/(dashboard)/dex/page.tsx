import { Suspense } from "react";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { DashboardHeader } from "@/components/dashboard-header";
import { DexPoolCard } from "@/components/dex-pool-card";
import { NetworkFilter } from "@/components/network-filter";
import { DexPoolTable } from "@/components/tables/dex-pool-table";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getNewDexPools,
  getTrendingDexPools,
  getTrendingDexPoolsByNetwork,
} from "@/lib/api/geckoterminal";

export default async function DexPage({
  searchParams,
}: {
  searchParams: Promise<{ network?: string }>;
}) {
  const { network } = await searchParams;
  const useNetwork = network && network !== "all";

  const [trending, newPools] = await Promise.all([
    useNetwork
      ? getTrendingDexPoolsByNetwork(network)
      : getTrendingDexPools(),
    getNewDexPools(),
  ]);

  return (
    <>
      <DashboardHeader
        title="DEX Pools"
        description="On-chain liquidity via GeckoTerminal"
      />
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <Suspense fallback={<Skeleton className="h-8 w-full max-w-xl" />}>
          <NetworkFilter />
        </Suspense>

        <Tabs defaultValue="cards">
          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="trending">Trending Table</TabsTrigger>
            <TabsTrigger value="new">New Pools</TabsTrigger>
          </TabsList>
          <TabsContent value="cards" className="mt-6">
            <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {trending.slice(0, 12).map((pool, i) => (
                <StaggerItem key={pool.id}>
                  <DexPoolCard pool={pool} rank={i + 1} className="h-full" />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </TabsContent>
          <TabsContent value="trending" className="mt-6">
            <DexPoolTable data={trending} />
          </TabsContent>
          <TabsContent value="new" className="mt-6">
            <FadeIn>
              <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {newPools.slice(0, 12).map((pool, i) => (
                  <StaggerItem key={pool.id}>
                    <DexPoolCard pool={pool} rank={i + 1} className="h-full" />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </FadeIn>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
