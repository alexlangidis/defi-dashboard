"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { CoinImage } from "@/components/coin-image";

import { DataTable } from "@/components/data-table";
import { PercentBadge } from "@/components/percent-badge";
import type { TrendingCoin } from "@/lib/api/coingecko";
import { formatUsd, parseTrendingUsd } from "@/lib/format";

function getTrendingMarketCapValue(row: TrendingCoin) {
  const data = row.item.data;
  return (
    parseTrendingUsd(data?.market_cap) ??
    parseTrendingUsd(data?.total_volume) ??
    row.item.market_cap_rank ??
    0
  );
}

const columns: ColumnDef<TrendingCoin>[] = [
  {
    id: "rank",
    header: "Rank",
    accessorFn: (row) => row.item.score + 1,
    meta: { headerClassName: "pl-4 w-14", cellClassName: "pl-4 tabular-nums" },
    cell: ({ row }) => row.original.item.score + 1,
  },
  {
    id: "token",
    header: "Token",
    accessorFn: (row) => `${row.item.name} ${row.item.symbol}`,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <CoinImage
          src={row.original.item.small}
          alt={row.original.item.name}
          size={28}
        />
        <div>
          <Link
            href={`/tokens/${row.original.item.id}`}
            className="font-medium hover:underline"
          >
            {row.original.item.name}
          </Link>
          <div className="text-xs text-muted-foreground uppercase">
            {row.original.item.symbol}
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "price",
    header: "Price",
    accessorFn: (row) => row.item.data?.price ?? 0,
    cell: ({ row }) =>
      formatUsd(row.original.item.data?.price ?? null),
  },
  {
    id: "change",
    header: "24h",
    accessorFn: (row) =>
      row.item.data?.price_change_percentage_24h?.usd ?? 0,
    cell: ({ row }) => {
      const change =
        row.original.item.data?.price_change_percentage_24h?.usd ?? null;
      if (change == null) return "—";
      return <PercentBadge value={change} />;
    },
  },
  {
    id: "marketCap",
    header: "Market Cap",
    accessorFn: (row) => getTrendingMarketCapValue(row),
    meta: { headerClassName: "pr-4", cellClassName: "pr-4" },
    cell: ({ row }) => {
      const data = row.original.item.data;
      const cap = parseTrendingUsd(data?.market_cap);
      if (cap != null) return formatUsd(cap, true);

      const volume = parseTrendingUsd(data?.total_volume);
      if (volume != null) {
        return (
          <span className="text-muted-foreground" title="24h volume">
            <span className="text-[0.65rem] uppercase tracking-wide">Vol </span>
            {formatUsd(volume, true)}
          </span>
        );
      }

      const rank = row.original.item.market_cap_rank;
      if (rank) {
        return <span className="text-muted-foreground">#{rank} mcap rank</span>;
      }

      return "—";
    },
  },
];

export function TrendingTable({ data }: { data: TrendingCoin[] }) {
  return (
    <DataTable
      columns={columns}
      data={data}
      enableFilter
      filterPlaceholder="Filter tokens…"
      getFilterText={(row) => `${row.item.name} ${row.item.symbol}`}
    />
  );
}
