import { NextResponse } from "next/server";

import { getPoolOhlcv } from "@/lib/api/geckoterminal";
import { getPoolChartPeriod } from "@/lib/chart-periods";
import { normalizePoolAddress } from "@/lib/pool-path";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const network = searchParams.get("network");
  const address = searchParams.get("address");

  if (!network || !address) {
    return NextResponse.json({ error: "Missing network or address" }, { status: 400 });
  }

  const period = getPoolChartPeriod(searchParams.get("period") ?? "7d");
  const normalized = normalizePoolAddress(address);
  const ohlcv = await getPoolOhlcv(
    network,
    normalized,
    period.timeframe,
    period.limit,
  );

  const data = ohlcv.map((candle) => ({
    x: candle.time * 1000,
    y: candle.close,
  }));

  return NextResponse.json({ period: period.id, title: period.title, data });
}
