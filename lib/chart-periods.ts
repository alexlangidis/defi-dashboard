export type TokenChartPeriod = {
  id: string;
  label: string;
  days: number;
  title: string;
};

export type PoolChartPeriod = {
  id: string;
  label: string;
  timeframe: "hour" | "day";
  limit: number;
  title: string;
};

export const TOKEN_CHART_PERIODS: TokenChartPeriod[] = [
  { id: "1d", label: "1D", days: 1, title: "24h Price" },
  { id: "7d", label: "7D", days: 7, title: "7-Day Price" },
  { id: "30d", label: "30D", days: 30, title: "30-Day Price" },
  { id: "90d", label: "90D", days: 90, title: "90-Day Price" },
  { id: "1y", label: "1Y", days: 365, title: "1-Year Price" },
];

export const POOL_CHART_PERIODS: PoolChartPeriod[] = [
  { id: "24h", label: "24H", timeframe: "hour", limit: 24, title: "24h Price" },
  { id: "7d", label: "7D", timeframe: "hour", limit: 168, title: "7-Day Price" },
  { id: "30d", label: "30D", timeframe: "day", limit: 30, title: "30-Day Price" },
  { id: "90d", label: "90D", timeframe: "day", limit: 90, title: "90-Day Price" },
];

export const DEFAULT_TOKEN_CHART_PERIOD = TOKEN_CHART_PERIODS[1];
export const DEFAULT_POOL_CHART_PERIOD = POOL_CHART_PERIODS[1];

export function getTokenChartPeriod(id: string) {
  return TOKEN_CHART_PERIODS.find((period) => period.id === id) ?? DEFAULT_TOKEN_CHART_PERIOD;
}

export function getPoolChartPeriod(id: string) {
  return POOL_CHART_PERIODS.find((period) => period.id === id) ?? DEFAULT_POOL_CHART_PERIOD;
}
