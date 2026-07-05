const GECKO_TERMINAL_BASE = "https://api.geckoterminal.com/api/v2";
const API_VERSION = "20230203";

async function fetchGeckoTerminal<T>(
  path: string,
  revalidate = 60,
): Promise<T> {
  const res = await fetch(`${GECKO_TERMINAL_BASE}${path}`, {
    headers: {
      Accept: `application/json;version=${API_VERSION}`,
    },
    next: { revalidate },
  });

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
  network: { data: { id: string } };
  dex: { data: { id: string } };
};

type PoolsResponse = {
  data: Array<{
    id: string;
    attributes: PoolAttributes;
    relationships: PoolRelationships;
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
): DexPool {
  const network = pool.relationships.network.data.id;
  const address = pool.attributes.address;

  return {
    id: pool.id,
    name: pool.attributes.name,
    address,
    network,
    dex: pool.relationships.dex.data.id.replace(/_/g, " "),
    reserveUsd: Number(pool.attributes.reserve_in_usd) || 0,
    volume24h: Number(pool.attributes.volume_usd.h24) || 0,
    priceChange24h: Number(pool.attributes.price_change_percentage.h24) || 0,
    buys24h: pool.attributes.transactions.h24.buys,
    sells24h: pool.attributes.transactions.h24.sells,
    geckoTerminalUrl: `https://www.geckoterminal.com/${network}/pools/${address}`,
  };
}

export async function getTrendingDexPools(page = 1) {
  const data = await fetchGeckoTerminal<PoolsResponse>(
    `/networks/trending_pools?page=${page}`,
    60,
  );
  return data.data.map(mapPool);
}

export async function getTrendingDexPoolsByNetwork(network: string, page = 1) {
  const data = await fetchGeckoTerminal<PoolsResponse>(
    `/networks/${network}/trending_pools?page=${page}`,
    60,
  );
  return data.data.map(mapPool);
}

export async function getNewDexPools(page = 1) {
  const data = await fetchGeckoTerminal<PoolsResponse>(
    `/networks/new_pools?page=${page}`,
    60,
  );
  return data.data.map(mapPool);
}

export type Network = {
  id: string;
  name: string;
};

export async function getNetworks() {
  const data = await fetchGeckoTerminal<{
    data: Array<{ id: string; attributes: { name: string } }>;
  }>("/networks", 3600);
  return data.data.map((n) => ({ id: n.id, name: n.attributes.name }));
}

export async function searchPools(query: string) {
  if (!query.trim()) return [];
  const data = await fetchGeckoTerminal<PoolsResponse>(
    `/search/pools?query=${encodeURIComponent(query)}&page=1`,
    60,
  );
  return data.data.map(mapPool);
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
    60,
  );

  return data.data.attributes.ohlcv_list.map(([time, open, high, low, close]) => ({
    time,
    open,
    high,
    low,
    close,
  }));
}
