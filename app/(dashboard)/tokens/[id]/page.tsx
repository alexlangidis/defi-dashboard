import Image from "next/image";
import { notFound } from "next/navigation";

import { AreaChart } from "@/components/area-chart";
import { DashboardHeader } from "@/components/dashboard-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { PercentBadge } from "@/components/percent-badge";
import { StatCard } from "@/components/stat-card";
import { WatchlistButton } from "@/components/watchlist-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCoinDetail, getCoinMarketChart } from "@/lib/api/coingecko";
import { formatNumber, formatUsd } from "@/lib/format";

export default async function TokenDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let coin;
  let chart: Array<{ x: number; y: number }> = [];

  try {
    const [detail, prices] = await Promise.all([
      getCoinDetail(id),
      getCoinMarketChart(id, 7),
    ]);
    coin = detail;
    chart = prices.map(([ts, price]) => ({ x: ts, y: price }));
  } catch {
    notFound();
  }

  const md = coin.market_data;
  const athDistance =
    ((md.current_price.usd - md.ath.usd) / md.ath.usd) * 100;
  const positive = md.price_change_percentage_24h >= 0;

  return (
    <>
      <DashboardHeader title={coin.name} description={coin.symbol.toUpperCase()} />
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <FadeIn>
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 shadow-card md:p-8">
            <div
              className={`pointer-events-none absolute -right-20 -top-20 size-56 rounded-full blur-3xl ${
                positive ? "bg-emerald-500/15" : "bg-red-500/15"
              }`}
            />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Image
                  src={coin.image.large}
                  alt={coin.name}
                  width={56}
                  height={56}
                  className="rounded-full ring-2 ring-foreground/10"
                />
                <div>
                  <p className="text-3xl font-semibold tracking-tight tabular-nums md:text-4xl">
                    {formatUsd(md.current_price.usd)}
                  </p>
                  <div className="mt-1.5 flex items-center gap-2.5">
                    <PercentBadge value={md.price_change_percentage_24h} />
                    <span className="text-sm text-muted-foreground">
                      Rank #{coin.market_cap_rank}
                    </span>
                  </div>
                </div>
              </div>
              <WatchlistButton
                coinId={coin.id}
                symbol={coin.symbol}
                name={coin.name}
                image={coin.image.small}
              />
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <Card className="relative overflow-hidden">
            <CardHeader>
              <CardTitle className="text-sm font-medium tracking-tight text-muted-foreground">
                7-Day Price
              </CardTitle>
            </CardHeader>
            <CardContent className="h-40">
              <AreaChart data={chart} />
            </CardContent>
          </Card>
        </FadeIn>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StaggerItem>
            <StatCard
              title="Market Cap"
              value={formatUsd(md.market_cap.usd, true)}
              accent="primary"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              title="24h Volume"
              value={formatUsd(md.total_volume.usd, true)}
              accent="violet"
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              title="7d Change"
              change={<PercentBadge value={md.price_change_percentage_7d} />}
              value=""
              accent={md.price_change_percentage_7d >= 0 ? "emerald" : "primary"}
            />
          </StaggerItem>
          <StaggerItem>
            <StatCard
              title="30d Change"
              change={<PercentBadge value={md.price_change_percentage_30d} />}
              value=""
              accent={md.price_change_percentage_30d >= 0 ? "emerald" : "primary"}
            />
          </StaggerItem>
        </StaggerContainer>

        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" gap={0.04}>
          <StaggerItem>
            <StatCard title="ATH" value={formatUsd(md.ath.usd)} />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="From ATH" value={`${athDistance.toFixed(1)}%`} />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="Circulating" value={formatNumber(md.circulating_supply)} />
          </StaggerItem>
          <StaggerItem>
            <StatCard title="Total Supply" value={formatNumber(md.total_supply)} />
          </StaggerItem>
        </StaggerContainer>

        {coin.description.en ? (
          <FadeIn delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium tracking-tight">
                  About {coin.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground [&>p]:mb-2"
                  dangerouslySetInnerHTML={{
                    __html: coin.description.en.split("</p>")[0] + "</p>",
                  }}
                />
              </CardContent>
            </Card>
          </FadeIn>
        ) : null}
      </main>
    </>
  );
}
