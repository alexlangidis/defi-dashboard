"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

import { AreaChart } from "@/components/area-chart";
import { ChartPeriodSelector } from "@/components/chart-period-selector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DEFAULT_POOL_CHART_PERIOD,
  POOL_CHART_PERIODS,
  getPoolChartPeriod,
} from "@/lib/chart-periods";
import { cn } from "@/lib/utils";

type ChartPayload = {
  period: string;
  title: string;
  data: Array<{ x: number; y: number }>;
};

export function PoolPriceChart({
  network,
  address,
  initialData,
  initialPeriod = DEFAULT_POOL_CHART_PERIOD.id,
  chartHeight = "h-48",
  className,
}: {
  network: string;
  address: string;
  initialData: Array<{ x: number; y: number }>;
  initialPeriod?: string;
  chartHeight?: string;
  className?: string;
}) {
  const [period, setPeriod] = useState(initialPeriod);
  const activePeriod = getPoolChartPeriod(period);

  const { data, isLoading, isFetching } = useQuery<ChartPayload>({
    queryKey: ["pool-chart", network, address, period],
    queryFn: async () => {
      const params = new URLSearchParams({
        network,
        address,
        period,
      });
      const res = await fetch(`/api/dex/pool-chart?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load chart");
      return res.json();
    },
    initialData:
      period === initialPeriod
        ? {
            period: initialPeriod,
            title: getPoolChartPeriod(initialPeriod).title,
            data: initialData,
          }
        : undefined,
    staleTime: 120_000,
  });

  const chartData = useMemo(() => data?.data ?? [], [data]);
  const showSkeleton = isLoading || (isFetching && chartData.length === 0);

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle className="text-sm font-medium tracking-tight text-muted-foreground">
          {data?.title ?? activePeriod.title}
        </CardTitle>
        <ChartPeriodSelector
          periods={POOL_CHART_PERIODS}
          value={period}
          onChange={setPeriod}
        />
      </CardHeader>
      <CardContent className={cn(chartHeight)}>
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
