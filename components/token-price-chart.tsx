"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { AreaChart } from "@/components/area-chart";
import { ChartPeriodSelector } from "@/components/chart-period-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DEFAULT_TOKEN_CHART_PERIOD,
  TOKEN_CHART_PERIODS,
  getTokenChartPeriod,
} from "@/lib/chart-periods";

type ChartPayload = {
  period: string;
  title: string;
  data: Array<{ x: number; y: number }>;
};

export function TokenPriceChart({
  coinId,
  initialData,
  initialPeriod = DEFAULT_TOKEN_CHART_PERIOD.id,
}: {
  coinId: string;
  initialData: Array<{ x: number; y: number }>;
  initialPeriod?: string;
}) {
  const [period, setPeriod] = useState(initialPeriod);
  const activePeriod = getTokenChartPeriod(period);

  const { data, isLoading, isFetching } = useQuery<ChartPayload>({
    queryKey: ["coin-chart", coinId, period],
    queryFn: async () => {
      const res = await fetch(
        `/api/coins/${coinId}/chart?period=${encodeURIComponent(period)}`,
      );
      if (!res.ok) throw new Error("Failed to load chart");
      return res.json();
    },
    initialData:
      period === initialPeriod
        ? {
            period: initialPeriod,
            title: getTokenChartPeriod(initialPeriod).title,
            data: initialData,
          }
        : undefined,
    staleTime: 120_000,
  });

  const chartData = useMemo(() => data?.data ?? [], [data]);
  const showSkeleton = isLoading || (isFetching && chartData.length === 0);

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-sm font-medium tracking-tight text-muted-foreground">
          {data?.title ?? activePeriod.title}
        </CardTitle>
        <ChartPeriodSelector
          periods={TOKEN_CHART_PERIODS}
          value={period}
          onChange={setPeriod}
        />
      </CardHeader>
      <CardContent className="h-40">
        {showSkeleton ? (
          <Skeleton className="h-full w-full rounded-lg" />
        ) : chartData.length > 1 ? (
          <AreaChart data={chartData} />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Chart data unavailable
          </div>
        )}
      </CardContent>
    </Card>
  );
}
