import { cache } from "react";

import { formatDexName, getDexImageUrl } from "@/lib/dex-icons";
import { normalizePoolAddress, poolAddressesMatch } from "@/lib/pool-path";

const GECKO_TERMINAL_BASE = "https://api.geckoterminal.com/api/v2";
const API_VERSION = "20230203";
const POOL_INCLUDE = "include=base_token,quote_token,dex";

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

  if (res.status === 429 || res.status === 503 || res.status === 404) {
    if (process.env.NODE_ENV === "development" && res.status !== 404) {
      console.warn(`GeckoTerminal request failed (${res.status}): ${path}`);
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

function withPoolInclude(path: string) {
  return path.includes("?")
    ? `${path}&${POOL_INCLUDE}`
    : `${path}?${POOL_INCLUDE}`;
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
  base_token?: { data?: { id: string } | null };
  quote_token?: { data?: { id: string } | null };
};

type IncludedToken = {
  id: string;
  type: "token";
  attributes: {
    address: string;
    name: string;
    symbol: string;
    image_url: string | null;
  };
};

type IncludedDex = {
  id: string;
  type: "dex";
  attributes: {
    name: string;
  };
};

type PoolsResponse = {
  data: Array<{
    id: string;
    attributes: PoolAttributes;
    relationships?: PoolRelationships;
  }>;
  included?: Array<IncludedToken | IncludedDex>;
};

export type PoolToken = {
  address: string;
  symbol: string;
  name: string;
  imageUrl: string | null;
};

export type DexPool = {
  id: string;
  name: string;
  address: string;
  network: string;
  networkName?: string;
  networkImageUrl?: string | null;
  dexId: string;
  dex: string;
  dexImageUrl?: string | null;
  baseToken: PoolToken;
  quoteToken: PoolToken;
  baseTokenPriceUsd: number | null;
  quoteTokenPriceUsd: number | null;
  reserveUsd: number;
  volume24h: number;
  priceChange24h: number;
  buys24h: number;
  sells24h: number;
  geckoTerminalUrl: string;
};

function buildIncludedMaps(included?: Array<IncludedToken | IncludedDex>) {
  const tokens = new Map<string, IncludedToken>();
  const dexes = new Map<string, IncludedDex>();
  for (const item of included ?? []) {
    if (item.type === "token") {
      tokens.set(item.id, item);
    }
    if (item.type === "dex") {
      dexes.set(item.id, item);
    }
  }
  return { tokens, dexes };
}

function tokenIdToAddress(tokenId: string, network: string): string {
  const prefix = `${network}_`;
  if (tokenId.startsWith(prefix)) return tokenId.slice(prefix.length);
  const separator = tokenId.indexOf("_");
  return separator >= 0 ? tokenId.slice(separator + 1) : tokenId;
}

function parsePoolSymbols(name: string): [string, string] {
  const [base = "", quote = ""] = name.split("/").map((part) => part.trim());
  return [base, quote];
}

function parseOptionalUsd(value: string | null | undefined) {
  if (value == null || value === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function resolveToken(
  relationship: PoolRelationships["base_token"],
  included: Map<string, IncludedToken>,
  network: string,
  fallbackSymbol: string,
): PoolToken {
  const tokenId = relationship?.data?.id;
  if (!tokenId) {
    return {
      address: "",
      symbol: fallbackSymbol,
      name: fallbackSymbol,
      imageUrl: null,
    };
  }

  const includedToken = included.get(tokenId);
  if (includedToken) {
    return {
      address: includedToken.attributes.address,
      symbol: includedToken.attributes.symbol,
      name: includedToken.attributes.name,
      imageUrl: includedToken.attributes.image_url,
    };
  }

  return {
    address: tokenIdToAddress(tokenId, network),
    symbol: fallbackSymbol,
    name: fallbackSymbol,
    imageUrl: null,
  };
}

function resolveDex(
  relationship: PoolRelationships["dex"],
  dexes: Map<string, IncludedDex>,
) {
  const dexId = relationship?.data?.id ?? "unknown";
  const dexName = dexes.get(dexId)?.attributes.name;
  return {
    dexId,
    dex: formatDexName(dexId, dexName),
    dexImageUrl: dexId === "unknown" ? null : getDexImageUrl(dexId),
  };
}

function mapPool(
  pool: PoolsResponse["data"][number],
  included: ReturnType<typeof buildIncludedMaps>,
  fallbackNetwork?: string,
): DexPool | null {
  const network = pool.relationships?.network?.data?.id ?? fallbackNetwork;
  const address = pool.attributes?.address;

  if (!network || !address) return null;

  const { dexId, dex, dexImageUrl } = resolveDex(
    pool.relationships?.dex,
    included.dexes,
  );
  const [baseSymbol, quoteSymbol] = parsePoolSymbols(pool.attributes.name);

  return {
    id: pool.id,
    name: pool.attributes.name,
    address,
    network,
    dexId,
    dex,
    dexImageUrl,
    baseToken: resolveToken(
      pool.relationships?.base_token,
      included.tokens,
      network,
      baseSymbol,
    ),
    quoteToken: resolveToken(
      pool.relationships?.quote_token,
      included.tokens,
      network,
      quoteSymbol,
    ),
    baseTokenPriceUsd: parseOptionalUsd(pool.attributes.base_token_price_usd),
    quoteTokenPriceUsd: parseOptionalUsd(pool.attributes.quote_token_price_usd),
    reserveUsd: Number(pool.attributes.reserve_in_usd) || 0,
    volume24h: Number(pool.attributes.volume_usd?.h24) || 0,
    priceChange24h: Number(pool.attributes.price_change_percentage?.h24) || 0,
    buys24h: pool.attributes.transactions?.h24?.buys ?? 0,
    sells24h: pool.attributes.transactions?.h24?.sells ?? 0,
    geckoTerminalUrl: `https://www.geckoterminal.com/${network}/pools/${address}`,
  };
}

function mapPoolsResponse(
  data: PoolsResponse | null,
  fallbackNetwork?: string,
): DexPool[] {
  if (!data) return [];
  const included = buildIncludedMaps(data.included);
  return data.data
    .map((pool) => mapPool(pool, included, fallbackNetwork))
    .filter((pool): pool is DexPool => pool !== null);
}

export const getTrendingDexPools = cache(async (page = 1): Promise<DexPool[]> => {
  const data = await fetchGeckoTerminal<PoolsResponse>(
    withPoolInclude(`/networks/trending_pools?page=${page}`),
  );
  return mapPoolsResponse(data);
});

export const getTrendingDexPoolsByNetwork = cache(
  async (network: string, page = 1): Promise<DexPool[]> => {
    const allPools = await getTrendingDexPools(page);
    const filtered = allPools.filter((pool) => pool.network === network);
    if (filtered.length > 0) return filtered;

    const data = await fetchGeckoTerminal<PoolsResponse>(
      withPoolInclude(`/networks/${network}/trending_pools?page=${page}`),
    );
    return mapPoolsResponse(data, network);
  },
);

export const getNewDexPools = cache(async (page = 1): Promise<DexPool[]> => {
  const data = await fetchGeckoTerminal<PoolsResponse>(
    withPoolInclude(`/networks/new_pools?page=${page}`),
  );
  return mapPoolsResponse(data);
});

export type Network = {
  id: string;
  name: string;
  coingeckoAssetPlatformId: string | null;
};

export const getNetworks = cache(async () => {
  const data = await fetchGeckoTerminal<{
    data: Array<{
      id: string;
      attributes: {
        name: string;
        coingecko_asset_platform_id?: string | null;
      };
    }>;
  }>("/networks", STATIC_REVALIDATE);
  if (!data) return [];
  return data.data.map((n) => ({
    id: n.id,
    name: n.attributes.name,
    coingeckoAssetPlatformId: n.attributes.coingecko_asset_platform_id ?? null,
  }));
});

export async function getPoolByAddress(network: string, address: string) {
  return getPoolByAddressCached(network, normalizePoolAddress(address));
}

const getPoolByAddressCached = cache(async (network: string, address: string) => {
  const data = await fetchGeckoTerminal<{
    data: PoolsResponse["data"][number];
    included?: Array<IncludedToken | IncludedDex>;
  }>(withPoolInclude(`/networks/${network}/pools/${address}`));

  if (data?.data) {
    const included = buildIncludedMaps(data.included);
    const pool = mapPool(data.data, included, network);
    if (pool) return pool;
  }

  const trending = await getTrendingDexPools();
  const fromTrending = trending.find(
    (pool) =>
      pool.network === network && poolAddressesMatch(pool.address, address),
  );
  if (fromTrending) return fromTrending;

  const newPools = await getNewDexPools();
  return (
    newPools.find(
      (pool) =>
        pool.network === network && poolAddressesMatch(pool.address, address),
    ) ?? null
  );
});

export async function searchPools(query: string) {
  if (!query.trim()) return [];
  const data = await fetchGeckoTerminal<PoolsResponse>(
    withPoolInclude(`/search/pools?query=${encodeURIComponent(query)}&page=1`),
  );
  return mapPoolsResponse(data);
}

export type OhlcvCandle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

export const getPoolOhlcv = cache(async (
  network: string,
  poolAddress: string,
  timeframe = "hour",
  limit = 48,
) => {
  const address = normalizePoolAddress(poolAddress);
  const data = await fetchGeckoTerminal<{
    data: {
      attributes: {
        ohlcv_list: Array<[number, number, number, number, number, number]>;
      };
    };
  }>(
    `/networks/${network}/pools/${address}/ohlcv/${timeframe}?aggregate=1&limit=${limit}`,
  );

  if (!data) return [];

  return data.data.attributes.ohlcv_list.map(([time, open, high, low, close]) => ({
    time,
    open,
    high,
    low,
    close,
  }));
});
