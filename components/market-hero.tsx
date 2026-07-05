import { AreaChart } from "@/components/area-chart";
import { formatPercent, formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function MarketHero({
  marketCap,
  marketCapChange,
  volume,
  btcDominance,
  ethDominance,
  capChart = [],
}: {
  marketCap: number;
  marketCapChange: number;
  volume: number;
  btcDominance: number;
  ethDominance: number;
  capChart?: Array<{ x: number; y: number }>;
}) {
  const positive = marketCapChange >= 0;
  const rest = Math.max(0, 100 - btcDominance - ethDominance);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card/40 p-6 shadow-card md:p-8">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 size-64 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
            Global Crypto Market
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <h2 className="text-4xl font-semibold tracking-tight tabular-nums md:text-5xl">
              {formatUsd(marketCap, true)}
            </h2>
            <span
              className={cn(
                "mb-1.5 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-medium tabular-nums transition-colors",
                positive
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-red-500/15 text-red-400",
              )}
            >
              <span
                className={cn(
                  "size-1.5 rounded-full",
                  positive ? "bg-emerald-400" : "bg-red-400",
                )}
              />
              {formatPercent(marketCapChange)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            24h volume{" "}
            <span className="font-medium text-foreground/80 tabular-nums">
              {formatUsd(volume, true)}
            </span>
          </p>
          {capChart.length > 0 ? (
            <div className="h-16 w-full max-w-md pt-2">
              <AreaChart data={capChart} />
            </div>
          ) : null}
        </div>

        <div className="w-full max-w-sm space-y-3">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Dominance
          </p>
          <div className="flex h-2 overflow-hidden rounded-full bg-muted/60">
            <div
              className="bg-gradient-to-r from-orange-400 to-orange-500 transition-all"
              style={{ width: `${btcDominance}%` }}
            />
            <div
              className="bg-gradient-to-r from-indigo-400 to-indigo-500 transition-all"
              style={{ width: `${ethDominance}%` }}
            />
            <div
              className="bg-muted-foreground/25 transition-all"
              style={{ width: `${rest}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-orange-500" />
              BTC{" "}
              <span className="font-medium text-foreground/70 tabular-nums">
                {btcDominance.toFixed(1)}%
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-indigo-500" />
              ETH{" "}
              <span className="font-medium text-foreground/70 tabular-nums">
                {ethDominance.toFixed(1)}%
              </span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-muted-foreground/30" />
              Other{" "}
              <span className="font-medium text-foreground/70 tabular-nums">
                {rest.toFixed(1)}%
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
