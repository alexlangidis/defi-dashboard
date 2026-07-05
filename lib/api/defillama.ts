const LLAMA_BASE = "https://api.llama.fi";
const YIELDS_BASE = "https://yields.llama.fi";
const STABLECOINS_BASE = "https://stablecoins.llama.fi";

async function fetchLlama<T>(
  url: string,
  options?: { revalidate?: number; noStore?: boolean },
): Promise<T> {
  const res = await fetch(
    url,
    options?.noStore
      ? { cache: "no-store" }
      : { next: { revalidate: options?.revalidate ?? 300 } },
  );
  if (!res.ok) {
    throw new Error(`DefiLlama API error: ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

export type Protocol = {
  id: string;
  name: string;
  symbol: string;
  category: string;
  chains: string[];
  tvl: number;
  change_1d: number | null;
  change_7d: number | null;
  mcap?: number;
  logo?: string;
};

export type YieldPool = {
  pool: string;
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number | null;
  apy: number | null;
  apyBase: number | null;
  apyReward: number | null;
  stablecoin: boolean;
  ilRisk: string;
  exposure: string;
};

export type Stablecoin = {
  id: string;
  name: string;
  symbol: string;
  gecko_id: string | null;
  pegType: string;
  pegMechanism: string;
  circulating: {
    peggedUSD: number;
  };
  chainCirculating: Record<string, { current: { peggedUSD: number } }>;
};

export type ChainTvl = {
  name: string;
  tvl: number;
};

export async function getProtocols() {
  return fetchLlama<Protocol[]>(`${LLAMA_BASE}/protocols`, { noStore: true });
}

export async function getYieldPools() {
  const data = await fetchLlama<{ data: YieldPool[] }>(
    `${YIELDS_BASE}/pools`,
    { noStore: true },
  );
  return data.data;
}

export async function getStablecoins() {
  const data = await fetchLlama<{ peggedAssets: Stablecoin[] }>(
    `${STABLECOINS_BASE}/stablecoins?includePrices=true`,
    { revalidate: 300 },
  );
  return data.peggedAssets;
}

export async function getChainTvls() {
  return fetchLlama<ChainTvl[]>(`${LLAMA_BASE}/v2/chains`, { revalidate: 300 });
}

export async function getHistoricalChainTvl() {
  return fetchLlama<Array<{ date: number; tvl: number }>>(
    `${LLAMA_BASE}/v2/historicalChainTvl`,
    { revalidate: 600 },
  );
}
