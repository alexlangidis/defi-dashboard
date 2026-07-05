import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { YieldTable } from "@/components/tables/yield-table";
import { getYieldPools } from "@/lib/api/defillama";

export default async function YieldsPage() {
  const pools = await getYieldPools();
  const sorted = [...pools]
    .filter((p) => (p.tvlUsd ?? 0) > 1_000_000 && p.apy != null)
    .sort((a, b) => (b.tvlUsd ?? 0) - (a.tvlUsd ?? 0))
    .slice(0, 100);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <div>
          <h1 className="text-sm font-semibold">Yield Pools</h1>
          <p className="text-xs text-muted-foreground">
            Top liquidity pools by TVL from DefiLlama
          </p>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <YieldTable data={sorted} />
      </main>
    </>
  );
}
