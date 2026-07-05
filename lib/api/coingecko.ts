import { cache } from "react";

type CoinGeckoConfig = {
  baseUrl: string;
  apiKey: string | null;
  headerName: string | null;
};

function getCoinGeckoConfig(): CoinGeckoConfig {
  const proKey = process.env.COINGECKO_PRO_API_KEY;
  const demoKey = process.env.COINGECKO_API_KEY;

  if (proKey) {
    return {
      baseUrl: "https://pro-api.coingecko.com/api/v3",
      apiKey: proKey,
      headerName: "x-cg-pro-api-key",
    };
  }

  if (demoKey) {
    return {
      baseUrl: "https://api.coingecko.com/api/v3",
      apiKey: demoKey,
      headerName: "x-cg-demo-api-key",
    };
  }

  return {
    baseUrl: "https://api.coingecko.com/api/v3",
    apiKey: null,
    headerName: null,
  };
}

function getHeaders(): HeadersInit {
  const { apiKey, headerName } = getCoinGeckoConfig();
  const headers: HeadersInit = { Accept: "application/json" };
  if (apiKey && headerName) {
    headers[headerName] = apiKey;
  }
  return headers;
}

async function fetchCoinGecko<T>(
  path: string,
  revalidate = 60,
): Promise<T | null> {
  const { baseUrl } = getCoinGeckoConfig();
  const res = await fetch(`${baseUrl}${path}`, {
    headers: getHeaders(),
    next: { revalidate },
  });

  if (res.status === 429 || res.status === 503 || res.status === 401) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`CoinGecko request failed (${res.status}): ${path}`);
    }
    return null;
  }

  if (!res.ok) {
    throw new Error(`CoinGecko API error: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

export type TrendingCoin = {
  item: {
    id: string;
    coin_id: number;
    name: string;
    symbol: string;
    market_cap_rank: number;
    thumb: string;
    small: string;
    large: string;
    slug: string;
    price_btc: number;
    score: number;
    data?: {
      price: number;
      price_change_percentage_24h: Record<string, number>;
      market_cap: string;
      total_volume: string;
    };
  };
};

export type MarketCoin = {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  total_volume: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  sparkline_in_7d?: { price: number[] };
};

export type CoinDetail = {
  id: string;
  symbol: string;
  name: string;
  image: { large: string; small: string; thumb: string };
  market_cap_rank: number;
  categories?: string[];
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    ath: { usd: number };
    ath_date: { usd: string };
    atl: { usd: number };
    circulating_supply: number;
    total_supply: number;
  };
  description: { en: string };
  links: {
    homepage: string[];
    blockchain_site: string[];
    twitter_screen_name?: string;
    subreddit_url?: string;
  };
};

export type GlobalData = {
  data: {
    total_market_cap: { usd: number };
    total_volume: { usd: number };
    market_cap_percentage: { btc: number; eth: number };
    market_cap_change_percentage_24h_usd: number;
    active_cryptocurrencies: number;
    updated_at: number;
  };
};

export const getTrendingCoins = cache(async () => {
  const data = await fetchCoinGecko<{ coins: TrendingCoin[] }>(
    "/search/trending",
    120,
  );
  return data?.coins ?? [];
});

export const getMarketCoins = cache(async (perPage = 20) => {
  const data = await fetchCoinGecko<MarketCoin[]>(
    `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=7d`,
    60,
  );
  return data ?? [];
});

export async function getCoinDetail(id: string) {
  const data = await fetchCoinGecko<CoinDetail>(
    `/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
    60,
  );
  if (!data) {
    throw new Error("CoinGecko API unavailable");
  }
  return data;
}

export const getGlobalData = cache(async () => {
  return fetchCoinGecko<GlobalData>("/global", 120);
});

export const getCoinsByIds = cache(async (ids: string[]) => {
  if (ids.length === 0) return [];
  const data = await fetchCoinGecko<MarketCoin[]>(
    `/coins/markets?vs_currency=usd&ids=${ids.join(",")}&order=market_cap_desc&sparkline=true&price_change_percentage=7d`,
    30,
  );
  return data ?? [];
});

export type SearchCoin = {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number | null;
  thumb: string;
};

export async function searchCoins(query: string) {
  if (!query.trim()) return [];
  const data = await fetchCoinGecko<{ coins: SearchCoin[] }>(
    `/search?query=${encodeURIComponent(query)}`,
    300,
  );
  return data?.coins?.slice(0, 8) ?? [];
}

export const getTopGainers = cache(async (perPage = 20) => {
  const data = await fetchCoinGecko<MarketCoin[]>(
    `/coins/markets?vs_currency=usd&order=price_change_percentage_24h_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=7d`,
    60,
  );
  return data ?? [];
});

export const getTopLosers = cache(async (perPage = 20) => {
  const data = await fetchCoinGecko<MarketCoin[]>(
    `/coins/markets?vs_currency=usd&order=price_change_percentage_24h_asc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=7d`,
    60,
  );
  return data ?? [];
});

export type MarketChartPoint = [number, number];

export async function getCoinMarketChart(id: string, days = 7) {
  const data = await fetchCoinGecko<{ prices: MarketChartPoint[] }>(
    `/coins/${id}/market_chart?vs_currency=usd&days=${days}`,
    120,
  );
  return data?.prices ?? [];
}

export const getGlobalMarketCapChart = cache(async (days = 7) => {
  const data = await fetchCoinGecko<{
    market_cap_chart: { market_cap: MarketChartPoint[] };
  }>(`/global/market_cap_chart?days=${days}`, 120);
  return data?.market_cap_chart.market_cap ?? [];
});

export type AssetPlatform = {
  id: string;
  name: string;
  image: {
    thumb: string;
    small: string;
    large: string;
  };
};

export const getAssetPlatforms = cache(async () => {
  const data = await fetchCoinGecko<AssetPlatform[]>("/asset_platforms", 3600);
  return data ?? [];
});
