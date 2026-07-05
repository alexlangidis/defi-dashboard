import { NextResponse } from "next/server";

import { getPoolOhlcv } from "@/lib/api/geckoterminal";
import { parseNetworkId, parsePoolAddress } from "@/lib/api/params";
import { getPoolChartPeriod } from "@/lib/chart-periods";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const network = parseNetworkId(searchParams.get("network"));
  const address = parsePoolAddress(searchParams.get("address"));

  if (!network || !address) {
    return NextResponse.json(
      { error: "Invalid network or address" },
      { status: 400 },
    );
  }

  const period = getPoolChartPeriod(searchParams.get("period") ?? "7d");
  const ohlcv = await getPoolOhlcv(
    network,
    address,
    period.timeframe,
    period.limit,
  );

  const data = ohlcv.map((candle) => ({
    x: candle.time * 1000,
    y: candle.close,
  }));

  return NextResponse.json({ period: period.id, title: period.title, data });
}
