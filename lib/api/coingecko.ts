const COINGECKO_BASE = "https://api.coingecko.com/api/v3";

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: "application/json" };
  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey) {
    headers["x-cg-demo-api-key"] = apiKey;
  }
  return headers;
}

async function fetchCoinGecko<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${COINGECKO_BASE}${path}`, {
    headers: getHeaders(),
    next: { revalidate },
  });

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
  market_data: {
    current_price: { usd: number };
    market_cap: { usd: number };
    total_volume: { usd: number };
    price_change_percentage_24h: number;
    price_change_percentage_7d: number;
    price_change_percentage_30d: number;
    ath: { usd: number };
    atl: { usd: number };
    circulating_supply: number;
    total_supply: number;
  };
  description: { en: string };
  links: { homepage: string[] };
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

export async function getTrendingCoins() {
  const data = await fetchCoinGecko<{ coins: TrendingCoin[] }>(
    "/search/trending",
    120,
  );
  return data.coins;
}

export async function getMarketCoins(perPage = 20) {
  return fetchCoinGecko<MarketCoin[]>(
    `/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=true&price_change_percentage=7d`,
    60,
  );
}

export async function getCoinDetail(id: string) {
  return fetchCoinGecko<CoinDetail>(
    `/coins/${id}?localization=false&tickers=false&community_data=false&developer_data=false`,
    60,
  );
}

export async function getGlobalData() {
  return fetchCoinGecko<GlobalData>("/global", 120);
}

export async function getCoinsByIds(ids: string[]) {
  if (ids.length === 0) return [];
  return fetchCoinGecko<MarketCoin[]>(
    `/coins/markets?vs_currency=usd&ids=${ids.join(",")}&order=market_cap_desc&sparkline=true&price_change_percentage=7d`,
    30,
  );
}
