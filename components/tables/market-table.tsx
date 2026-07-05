"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import Link from "next/link";

import { DataTable } from "@/components/data-table";
import { PercentBadge } from "@/components/percent-badge";
import { WatchlistButton } from "@/components/watchlist-button";
import type { MarketCoin } from "@/lib/api/coingecko";
import { formatUsd } from "@/lib/format";

const columns: ColumnDef<MarketCoin>[] = [
  {
    accessorKey: "market_cap_rank",
    header: "#",
    cell: ({ row }) => row.original.market_cap_rank,
  },
  {
    accessorKey: "name",
    header: "Token",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Image
          src={row.original.image}
          alt={row.original.name}
          width={28}
          height={28}
          className="rounded-full"
        />
        <div>
          <Link
            href={`/tokens/${row.original.id}`}
            className="font-medium hover:underline"
          >
            {row.original.name}
          </Link>
          <div className="text-xs text-muted-foreground uppercase">
            {row.original.symbol}
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "current_price",
    header: "Price",
    cell: ({ row }) => formatUsd(row.original.current_price),
  },
  {
    accessorKey: "price_change_percentage_24h",
    header: "24h",
    cell: ({ row }) => (
      <PercentBadge value={row.original.price_change_percentage_24h} />
    ),
  },
  {
    accessorKey: "market_cap",
    header: "Market Cap",
    cell: ({ row }) => formatUsd(row.original.market_cap, true),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <WatchlistButton
        coinId={row.original.id}
        symbol={row.original.symbol}
        name={row.original.name}
        image={row.original.image}
      />
    ),
  },
];

export function MarketTable({ data }: { data: MarketCoin[] }) {
  return <DataTable columns={columns} data={data} />;
}
