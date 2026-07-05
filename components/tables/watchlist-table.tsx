"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Trash2 } from "lucide-react";

import { CoinImage } from "@/components/coin-image";
import { DataTable } from "@/components/data-table";
import { PercentBadge } from "@/components/percent-badge";
import { Sparkline } from "@/components/sparkline";
import { Button } from "@/components/ui/button";
import type { MarketCoin } from "@/lib/api/coingecko";
import { formatUsd } from "@/lib/format";
import { useWatchlistStore } from "@/stores/watchlist-store";

export function WatchlistTable({ data }: { data: MarketCoin[] }) {
  const remove = useWatchlistStore((s) => s.remove);

  const columns: ColumnDef<MarketCoin>[] = [
    {
      accessorKey: "name",
      header: "Token",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <CoinImage src={row.original.image} alt={row.original.name} size={28} />
          <div>
            <Link
              href={`/tokens/${row.original.id}`}
              className="font-medium hover:underline"
            >
              {row.original.name}
            </Link>
            <div className="text-xs uppercase text-muted-foreground">
              {row.original.symbol}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "sparkline",
      header: "7d",
      cell: ({ row }) => {
        const prices = row.original.sparkline_in_7d?.price;
        if (!prices?.length) return "—";
        return (
          <Sparkline
            data={prices}
            positive={
              (row.original.price_change_percentage_7d_in_currency ?? 0) >= 0
            }
          />
        );
      },
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
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Remove ${row.original.name} from watchlist`}
          onClick={() => remove(row.original.id)}
        >
          <Trash2 className="size-4 text-muted-foreground" />
        </Button>
      ),
    },
  ];

  return <DataTable columns={columns} data={data} />;
}
