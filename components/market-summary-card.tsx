import { Newspaper } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MarketSummary } from "@/lib/market-summary";

export function MarketSummaryCard({ data }: { data: MarketSummary }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2">
        <Newspaper className="size-4 text-primary" />
        <CardTitle className="text-base">Market Brief</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {data.summary}
        </p>
        <div className="grid grid-cols-2 gap-2">
          {data.highlights.map((item) => (
            <div key={item.label} className="rounded-md border px-3 py-2">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="text-sm font-medium">{item.value}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Data from CoinGecko & DefiLlama ·{" "}
          {new Date(data.generatedAt).toLocaleString()}
        </p>
      </CardContent>
    </Card>
  );
}
