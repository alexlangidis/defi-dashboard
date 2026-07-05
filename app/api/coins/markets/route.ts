import { NextResponse } from "next/server";

import { getCoinsByIds } from "@/lib/api/coingecko";
import { parseCoinIds } from "@/lib/api/params";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = parseCoinIds(searchParams.get("ids"));

  if (ids.length === 0) {
    return NextResponse.json([]);
  }

  const coins = await getCoinsByIds(ids);
  return NextResponse.json(coins);
}
