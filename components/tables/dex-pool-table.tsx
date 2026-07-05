"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { PercentBadge } from "@/components/percent-badge";
import { Badge } from "@/components/ui/badge";
import type { DexPool } from "@/lib/api/geckoterminal";
import { formatUsd } from "@/lib/format";

const columns: ColumnDef<DexPool>[] = [
  {
    accessorKey: "name",
    header: "Pool",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-xs text-muted-foreground capitalize">
          {row.original.dex}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "network",
    header: "Network",
    cell: ({ row }) => (
      <Badge variant="outline" className="uppercase">
        {row.original.network}
      </Badge>
    ),
  },
  {
    accessorKey: "reserveUsd",
    header: "Liquidity",
    cell: ({ row }) => formatUsd(row.original.reserveUsd, true),
  },
  {
    accessorKey: "volume24h",
    header: "24h Volume",
    cell: ({ row }) => formatUsd(row.original.volume24h, true),
  },
  {
    accessorKey: "priceChange24h",
    header: "24h",
    cell: ({ row }) => <PercentBadge value={row.original.priceChange24h} />,
  },
  {
    id: "trades",
    header: "24h Trades",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.buys24h} buys · {row.original.sells24h} sells
      </span>
    ),
  },
  {
    id: "link",
    header: "",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={`/dex/${row.original.network}/${row.original.address}`}
          className="text-sm text-primary hover:underline"
        >
          Details
        </Link>
        <Link
          href={row.original.geckoTerminalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
        >
          <ExternalLink className="size-3" />
        </Link>
      </div>
    ),
  },
];

export function DexPoolTable({ data }: { data: DexPool[] }) {
  return <DataTable columns={columns} data={data} />;
}
