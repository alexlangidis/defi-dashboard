import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink, Globe } from "lucide-react";

import { CoinImage } from "@/components/coin-image";

import { TokenPriceChart } from "@/components/token-price-chart";
import { DashboardHeader } from "@/components/dashboard-header";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/animations";
import { PercentBadge } from "@/components/percent-badge";
import { StatCard } from "@/components/stat-card";
import { WatchlistButton } from "@/components/watchlist-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCoinDetail, getCoinMarketChart } from "@/lib/api/coingecko";
import { DEFAULT_TOKEN_CHART_PERIOD } from "@/lib/chart-periods";
import { formatNumber, formatUsd } from "@/lib/format";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

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
      getCoinMarketChart(id, DEFAULT_TOKEN_CHART_PERIOD.days),
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
                <CoinImage
                  src={coin.image.large}
                  alt={coin.name}
                  size={56}
                  className="ring-2 ring-foreground/10"
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
          <TokenPriceChart coinId={coin.id} initialData={chart} />
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
            <StatCard
              title="ATH Date"
              value={md.ath_date?.usd ? formatDate(md.ath_date.usd) : "—"}
            />
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

        {coin.categories && coin.categories.length > 0 ? (
          <FadeIn delay={0.08}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium tracking-tight">
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {coin.categories.map((cat) => (
                  <span
                    key={cat}
                    className="rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-xs capitalize"
                  >
                    {cat}
                  </span>
                ))}
              </CardContent>
            </Card>
          </FadeIn>
        ) : null}

        {(coin.links.homepage[0] ||
          coin.links.blockchain_site[0] ||
          coin.links.twitter_screen_name) ? (
          <FadeIn delay={0.09}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium tracking-tight">
                  Links
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {coin.links.homepage.filter(Boolean).map((url) => (
                  <Link
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    <Globe className="size-3.5" />
                    Website
                    <ExternalLink className="size-3" />
                  </Link>
                ))}
                {coin.links.blockchain_site.filter(Boolean)[0] ? (
                  <Link
                    href={coin.links.blockchain_site.filter(Boolean)[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    Explorer
                    <ExternalLink className="size-3" />
                  </Link>
                ) : null}
                {coin.links.twitter_screen_name ? (
                  <Link
                    href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                  >
                    Twitter
                    <ExternalLink className="size-3" />
                  </Link>
                ) : null}
              </CardContent>
            </Card>
          </FadeIn>
        ) : null}

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
