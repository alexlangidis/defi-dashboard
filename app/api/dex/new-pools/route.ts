import { NextResponse } from "next/server";

import { enrichDexPools, getNetworkIconLookup } from "@/lib/network-icons";
import { getNewDexPools } from "@/lib/api/geckoterminal";

export async function GET() {
  const [pools, networkIcons] = await Promise.all([
    getNewDexPools(),
    getNetworkIconLookup(),
  ]);
  return NextResponse.json(enrichDexPools(pools, networkIcons));
}
