"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { CoinImage } from "@/components/coin-image";

import { DataTable } from "@/components/data-table";
import type { TrendingCoin } from "@/lib/api/coingecko";
import { formatUsd } from "@/lib/format";

const columns: ColumnDef<TrendingCoin>[] = [
  {
    accessorKey: "item.score",
    header: "Rank",
    cell: ({ row }) => row.original.item.score + 1,
  },
  {
    accessorKey: "item.name",
    header: "Token",
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
    cell: ({ row }) =>
      formatUsd(row.original.item.data?.price ?? null),
  },
  {
    id: "change",
    header: "24h",
    cell: ({ row }) => {
      const change =
        row.original.item.data?.price_change_percentage_24h?.usd ?? null;
      if (change == null) return "—";
      return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
    },
  },
  {
    id: "marketCap",
    header: "Market Cap",
    cell: ({ row }) => {
      const cap = row.original.item.data?.market_cap;
      return cap ? formatUsd(Number(cap), true) : "—";
    },
  },
];

export function TrendingTable({ data }: { data: TrendingCoin[] }) {
  return <DataTable columns={columns} data={data} />;
}
