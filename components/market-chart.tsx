"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatDate, formatUsd } from "@/lib/format";

type ChartPoint = {
  date: number;
  value: number;
};

export function MarketChart({
  data,
  valueFormatter = (v) => formatUsd(v, true),
}: {
  data: ChartPoint[];
  valueFormatter?: (value: number) => string;
}) {
  const chartData = data.map((point) => ({
    label: formatDate(point.date),
    value: point.value,
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => formatUsd(value, true)}
          />
          <Tooltip
            formatter={(value) => valueFormatter(Number(value))}
            labelStyle={{ color: "inherit" }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--color-chart-1)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
