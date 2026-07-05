import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { StablecoinTable } from "@/components/tables/stablecoin-table";
import { getStablecoins } from "@/lib/api/defillama";
import { formatUsd } from "@/lib/format";
import { StatCard } from "@/components/stat-card";

export default async function StablecoinsPage() {
  const stablecoins = await getStablecoins();
  const sorted = [...stablecoins]
    .filter((s) => s.circulating.peggedUSD > 0)
    .sort((a, b) => b.circulating.peggedUSD - a.circulating.peggedUSD);

  const totalCirculating = sorted.reduce(
    (sum, s) => sum + s.circulating.peggedUSD,
    0,
  );

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <div>
          <h1 className="text-sm font-semibold">Stablecoins</h1>
          <p className="text-xs text-muted-foreground">
            Circulating supply across pegged assets
          </p>
        </div>
      </header>
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Circulating"
            value={formatUsd(totalCirculating, true)}
          />
          <StatCard title="Tracked Assets" value={sorted.length.toString()} />
          <StatCard
            title="Largest"
            value={sorted[0]?.symbol?.toUpperCase() ?? "—"}
          />
        </div>
        <StablecoinTable data={sorted.slice(0, 100)} />
      </main>
    </>
  );
}
