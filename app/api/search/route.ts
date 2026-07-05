import { NextResponse } from "next/server";

import { searchCoins } from "@/lib/api/coingecko";
import { searchPools } from "@/lib/api/geckoterminal";
import { parseSearchQuery } from "@/lib/api/params";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = parseSearchQuery(searchParams.get("q"));

  if (!q) {
    return NextResponse.json({ coins: [], pools: [] });
  }

  const [coins, pools] = await Promise.all([
    searchCoins(q).catch(() => []),
    searchPools(q).catch(() => []),
  ]);

  return NextResponse.json({
    coins: coins.map((c) => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      thumb: c.thumb,
      market_cap_rank: c.market_cap_rank,
    })),
    pools: pools.slice(0, 5).map((p) => ({
      id: p.id,
      name: p.name,
      network: p.network,
      address: p.address,
      volume24h: p.volume24h,
      geckoTerminalUrl: p.geckoTerminalUrl,
    })),
  });
}
