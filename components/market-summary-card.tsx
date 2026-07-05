import { Newspaper } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketSummary } from "@/lib/market-summary";

export function MarketSummaryCard({ data }: { data: MarketSummary }) {
  return (
    <Card className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-30" />
      <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-primary/10 blur-3xl" />
      <CardHeader className="relative flex flex-row items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary/15">
          <Newspaper className="size-3.5 text-primary" />
        </div>
        <CardTitle className="text-sm font-medium tracking-tight">
          Market Brief
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {data.summary}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {data.highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2 transition-colors hover:border-border"
            >
              <p className="text-[0.65rem] uppercase tracking-wider text-muted-foreground">
                {item.label}
              </p>
              <p className="text-sm font-medium tabular-nums">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="text-[0.7rem] text-muted-foreground">
          CoinGecko · GeckoTerminal ·{" "}
          {new Date(data.generatedAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
