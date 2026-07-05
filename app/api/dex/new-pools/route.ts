import { NextResponse } from "next/server";

import { getNewDexPools } from "@/lib/api/geckoterminal";

export async function GET() {
  const pools = await getNewDexPools();
  return NextResponse.json(pools);
}
