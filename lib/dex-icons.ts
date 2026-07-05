const DEX_SLUG_ALIASES: Record<string, string> = {
  pancakeswap_v3: "pancakeswap",
  pancakeswap_v2: "pancakeswap",
  quickswap_v3: "quickswap",
  quickswap_v2: "quickswap",
  trader_joe_v2: "trader-joe",
  trader_joe: "trader-joe",
};

export function getDexSlug(dexId: string) {
  return DEX_SLUG_ALIASES[dexId] ?? dexId.replace(/_/g, "-");
}

export function getDexImageUrl(dexId: string) {
  return `https://icons.llamao.fi/icons/protocols/${getDexSlug(dexId)}`;
}

export function formatDexName(dexId: string, dexName?: string) {
  return dexName ?? dexId.replace(/_/g, " ");
}
