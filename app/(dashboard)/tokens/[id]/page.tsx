import Image from "next/image";
import { notFound } from "next/navigation";

import { PercentBadge } from "@/components/percent-badge";
import { StatCard } from "@/components/stat-card";
import { WatchlistButton } from "@/components/watchlist-button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { getCoinDetail } from "@/lib/api/coingecko";
import { formatNumber, formatUsd } from "@/lib/format";

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let coin;
  try {
    coin = await getCoinDetail(id);
  } catch {
    notFound();
  }

  const md = coin.market_data;

  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src={coin.image.large}
              alt={coin.name}
              width={32}
              height={32}
              className="rounded-full"
            />
            <div>
              <h1 className="text-sm font-semibold">{coin.name}</h1>
              <p className="text-xs text-muted-foreground uppercase">
                {coin.symbol}
              </p>
            </div>
          </div>
          <WatchlistButton
            coinId={coin.id}
            symbol={coin.symbol}
            name={coin.name}
            image={coin.image.small}
          />
        </div>
      </header>
      <main className="flex-1 space-y-6 p-4 md:p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Price"
            value={formatUsd(md.current_price.usd)}
            change={<PercentBadge value={md.price_change_percentage_24h} />}
          />
          <StatCard
            title="Market Cap"
            value={formatUsd(md.market_cap.usd, true)}
          />
          <StatCard
            title="24h Volume"
            value={formatUsd(md.total_volume.usd, true)}
          />
          <StatCard
            title="Rank"
            value={`#${coin.market_cap_rank}`}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="7d Change"
            value=""
            change={<PercentBadge value={md.price_change_percentage_7d} />}
          />
          <StatCard
            title="30d Change"
            value=""
            change={<PercentBadge value={md.price_change_percentage_30d} />}
          />
          <StatCard title="ATH" value={formatUsd(md.ath.usd)} />
          <StatCard title="ATL" value={formatUsd(md.atl.usd)} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <StatCard
            title="Circulating Supply"
            value={formatNumber(md.circulating_supply)}
          />
          <StatCard
            title="Total Supply"
            value={formatNumber(md.total_supply)}
          />
        </div>

        {coin.description.en ? (
          <div className="rounded-lg border p-4">
            <h2 className="mb-2 text-sm font-semibold">About</h2>
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground [&>p]:mb-2"
              dangerouslySetInnerHTML={{
                __html: coin.description.en.split("</p>")[0] + "</p>",
              }}
            />
          </div>
        ) : null}
      </main>
    </>
  );
}
