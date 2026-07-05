import { cache } from "react";

const GECKO_TERMINAL_BASE = "https://api.geckoterminal.com/api/v2";
const API_VERSION = "20230203";

const POOL_REVALIDATE = 300;
const STATIC_REVALIDATE = 3600;

async function fetchGeckoTerminal<T>(
  path: string,
  revalidate = POOL_REVALIDATE,
): Promise<T | null> {
  const res = await fetch(`${GECKO_TERMINAL_BASE}${path}`, {
    headers: {
      Accept: `application/json;version=${API_VERSION}`,
    },
    next: { revalidate },
  });

  if (res.status === 429 || res.status === 503) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`GeckoTerminal rate limited (${res.status}): ${path}`);
    }
    return null;
  }

  if (!res.ok) {
    throw new Error(
      `GeckoTerminal API error: ${res.status} ${res.statusText}`,
    );
  }

  return res.json() as Promise<T>;
}

type PoolAttributes = {
  name: string;
  address: string;
  pool_created_at: string;
  base_token_price_usd: string;
  quote_token_price_usd: string;
  fdv_usd: string | null;
  market_cap_usd: string | null;
  reserve_in_usd: string;
  price_change_percentage: {
    h1: string;
    h6: string;
    h24: string;
  };
  volume_usd: {
    h24: string;
  };
  transactions: {
    h24: {
      buys: number;
      sells: number;
    };
  };
};

type PoolRelationships = {
  network?: { data?: { id: string } | null };
  dex?: { data?: { id: string } | null };
};

type PoolsResponse = {
  data: Array<{
    id: string;
    attributes: PoolAttributes;
    relationships?: PoolRelationships;
  }>;
};

export type DexPool = {
  id: string;
  name: string;
  address: string;
  network: string;
  dex: string;
  reserveUsd: number;
  volume24h: number;
  priceChange24h: number;
  buys24h: number;
  sells24h: number;
  geckoTerminalUrl: string;
};

function mapPool(
  pool: PoolsResponse["data"][number],
  fallbackNetwork?: string,
): DexPool | null {
  const network = pool.relationships?.network?.data?.id ?? fallbackNetwork;
  const address = pool.attributes?.address;

  if (!network || !address) return null;

  const dexId = pool.relationships?.dex?.data?.id;

  return {
    id: pool.id,
    name: pool.attributes.name,
    address,
    network,
    dex: dexId ? dexId.replace(/_/g, " ") : "Unknown",
    reserveUsd: Number(pool.attributes.reserve_in_usd) || 0,
    volume24h: Number(pool.attributes.volume_usd?.h24) || 0,
    priceChange24h: Number(pool.attributes.price_change_percentage?.h24) || 0,
    buys24h: pool.attributes.transactions?.h24?.buys ?? 0,
    sells24h: pool.attributes.transactions?.h24?.sells ?? 0,
    geckoTerminalUrl: `https://www.geckoterminal.com/${network}/pools/${address}`,
  };
}

function mapPools(
  pools: PoolsResponse["data"],
  fallbackNetwork?: string,
): DexPool[] {
  return pools
    .map((pool) => mapPool(pool, fallbackNetwork))
    .filter((pool): pool is DexPool => pool !== null);
}

export const getTrendingDexPools = cache(async (page = 1): Promise<DexPool[]> => {
  const data = await fetchGeckoTerminal<PoolsResponse>(
    `/networks/trending_pools?page=${page}`,
  );
  if (!data) return [];
  return mapPools(data.data);
});

export const getTrendingDexPoolsByNetwork = cache(
  async (network: string, page = 1): Promise<DexPool[]> => {
    const allPools = await getTrendingDexPools(page);
    const filtered = allPools.filter((pool) => pool.network === network);
    if (filtered.length > 0) return filtered;

    const data = await fetchGeckoTerminal<PoolsResponse>(
      `/networks/${network}/trending_pools?page=${page}`,
    );
    if (!data) return [];
    return mapPools(data.data, network);
  },
);

export const getNewDexPools = cache(async (page = 1): Promise<DexPool[]> => {
  const data = await fetchGeckoTerminal<PoolsResponse>(
    `/networks/new_pools?page=${page}`,
  );
  if (!data) return [];
  return mapPools(data.data);
});

export type Network = {
  id: string;
  name: string;
};

export const getNetworks = cache(async () => {
  const data = await fetchGeckoTerminal<{
    data: Array<{ id: string; attributes: { name: string } }>;
  }>("/networks", STATIC_REVALIDATE);
  if (!data) return [];
  return data.data.map((n) => ({ id: n.id, name: n.attributes.name }));
});

export async function getPoolByAddress(network: string, address: string) {
  const data = await fetchGeckoTerminal<{
    data: PoolsResponse["data"][number];
  }>(`/networks/${network}/pools/${address}`);
  if (!data) return null;
  return mapPool(data.data, network);
}

export async function searchPools(query: string) {
  if (!query.trim()) return [];
  const data = await fetchGeckoTerminal<PoolsResponse>(
    `/search/pools?query=${encodeURIComponent(query)}&page=1`,
  );
  if (!data) return [];
  return mapPools(data.data);
}

export type OhlcvCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export async function getPoolOhlcv(
  network: string,
  poolAddress: string,
  timeframe = "hour",
  limit = 48,
) {
  const data = await fetchGeckoTerminal<{
    data: {
      attributes: {
        ohlcv_list: Array<[number, number, number, number, number, number]>;
      };
    };
  }>(
    `/networks/${network}/pools/${poolAddress}/ohlcv/${timeframe}?aggregate=1&limit=${limit}`,
  );

  if (!data) return [];

  return data.data.attributes.ohlcv_list.map(([time, open, high, low, close]) => ({
    time,
    open,
    high,
    low,
    close,
  }));
}
