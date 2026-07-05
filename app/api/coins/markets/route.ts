import { NextResponse } from "next/server";

import { getCoinsByIds } from "@/lib/api/coingecko";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get("ids");

  if (!ids) {
    return NextResponse.json([]);
  }

  const coins = await getCoinsByIds(ids.split(",").filter(Boolean));
  return NextResponse.json(coins);
}
