# DeFi Dashboard

Modern DeFi dashboard built with Next.js 16. Live market data from CoinGecko and GeckoTerminal — no database required.

## Features

- **Dashboard** — gradient market hero, dominance bar, gainers/losers, DEX pool cards
- **Global search** — `⌘K` to search tokens (CoinGecko) and pools (GeckoTerminal)
- **Market movers** — top 24h gainers and losers with sparklines
- **Trending tokens** — CoinGecko trending search
- **DEX pools** — card grid, network filters, buy/sell pressure bars
- **Token detail** — 7-day price chart, stats, watchlist
- **Market brief** — auto-generated summary from live API data
- **Watchlist** — saved in browser localStorage

## Stack

- Next.js 16 · TypeScript · Tailwind v4 · shadcn/ui
- TanStack Query · TanStack Table
- CoinGecko API · GeckoTerminal DEX API

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional: set a CoinGecko API key in `.env.local` for higher rate limits.

| Variable | Plan | Base URL |
|----------|------|----------|
| `COINGECKO_API_KEY` | Demo (free) | `api.coingecko.com` |
| `COINGECKO_PRO_API_KEY` | Pro (paid) | `pro-api.coingecko.com` |

GeckoTerminal uses the [public DEX API](https://www.geckoterminal.com/dex-api) — no key required.

## Data sources

- [CoinGecko API](https://www.coingecko.com/en/api) — prices, search, gainers/losers, charts
- [GeckoTerminal DEX API](https://www.geckoterminal.com/dex-api) — trending pools, pool search
