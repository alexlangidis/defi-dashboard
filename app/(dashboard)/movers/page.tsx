import { StaggerContainer, StaggerItem } from "@/components/animations";
import { DashboardHeader } from "@/components/dashboard-header";
import { MoverCard } from "@/components/mover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMarketMovers } from "@/lib/api/coingecko";

export const revalidate = 120;

export default async function MoversPage() {
  const { gainers, losers } = await getMarketMovers(20);

  return (
    <>
      <DashboardHeader
        title="Market Movers"
        description="Biggest 24h gainers and losers"
      />
      <main className="flex-1 p-4 md:p-8">
        <Tabs defaultValue="gainers">
          <TabsList>
            <TabsTrigger value="gainers" className="data-[state=active]:text-emerald-400">
              Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="data-[state=active]:text-red-400">
              Losers
            </TabsTrigger>
          </TabsList>
          <TabsContent value="gainers" className="mt-6">
            <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {gainers.map((coin) => (
                <StaggerItem key={coin.id}>
                  <MoverCard coin={coin} type="gainer" />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </TabsContent>
          <TabsContent value="losers" className="mt-6">
            <StaggerContainer className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {losers.map((coin) => (
                <StaggerItem key={coin.id}>
                  <MoverCard coin={coin} type="loser" />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
