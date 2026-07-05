# DeFi Dashboard

Free, open-source DeFi dashboard built with Next.js 16. Live market data from CoinGecko and DefiLlama — no API keys, auth, or database required.

## Features

- **Home dashboard** — market cap, volume, BTC dominance, DeFi TVL chart, market brief
- **Trending tokens** — CoinGecko trending search
- **Protocol TVL** — sortable DefiLlama protocol table
- **Yield pools** — top pools by TVL with APY
- **Stablecoins** — circulating supply across pegged assets
- **Token detail** — price, market data, and description per coin
- **Market brief** — auto-generated summary from live API data
- **Watchlist** — saved in browser localStorage

## Stack

- Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui
- TanStack Query · TanStack Table · Recharts
- CoinGecko API (free) · DefiLlama API (free)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional: set `COINGECKO_API_KEY` in `.env.local` for higher rate limits on the CoinGecko demo plan.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |

## Data sources

- [CoinGecko API](https://www.coingecko.com/en/api) — prices, market cap, trending
- [DefiLlama API](https://defillama.com/docs/api) — protocol TVL, yields, stablecoins
