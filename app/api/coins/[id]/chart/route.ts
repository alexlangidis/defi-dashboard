import { NextResponse } from "next/server";

import { getCoinMarketChart } from "@/lib/api/coingecko";
import { getTokenChartPeriod } from "@/lib/chart-periods";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const period = getTokenChartPeriod(searchParams.get("period") ?? "7d");

  const prices = await getCoinMarketChart(id, period.days);
  const data = prices.map(([ts, price]) => ({ x: ts, y: price }));

  return NextResponse.json({ period: period.id, title: period.title, data });
}
