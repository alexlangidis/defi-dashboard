import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ProtocolTable } from "@/components/tables/protocol-table";
import { getProtocols } from "@/lib/api/defillama";

export default async function ProtocolsPage() {
  const protocols = await getProtocols();
  const sorted = [...protocols]
    .filter((p) => p.tvl > 0)
    .sort((a, b) => b.tvl - a.tvl)
    .slice(0, 100);

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <div>
          <h1 className="text-sm font-semibold">Protocol TVL</h1>
          <p className="text-xs text-muted-foreground">
            Top DeFi protocols by total value locked
          </p>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <ProtocolTable data={sorted} />
      </main>
    </>
  );
}
