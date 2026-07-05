"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { DataTable } from "@/components/data-table";
import { DexIcon } from "@/components/dex-icon";
import { NetworkIcon } from "@/components/network-icon";
import { PercentBadge } from "@/components/percent-badge";
import { PoolTokenIcons } from "@/components/pool-token-icons";
import { Badge } from "@/components/ui/badge";
import type { DexPool } from "@/lib/api/geckoterminal";
import { formatUsd } from "@/lib/format";
import { poolDetailPath } from "@/lib/pool-path";

const columns: ColumnDef<DexPool>[] = [
  {
    id: "pool",
    header: "Pool",
    accessorFn: (row) => `${row.name} ${row.dex}`,
    cell: ({ row }) => (
      <div className="flex min-w-[220px] items-center gap-3">
        <PoolTokenIcons
          baseToken={row.original.baseToken}
          quoteToken={row.original.quoteToken}
          network={row.original.network}
          size={28}
        />
        <div className="min-w-0">
          <div className="font-medium">{row.original.name}</div>
          <div className="text-xs capitalize text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <DexIcon
                dexId={row.original.dexId}
                name={row.original.dex}
                imageUrl={row.original.dexImageUrl}
                size={14}
              />
              {row.original.dex}
            </span>
          </div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "network",
    header: "Network",
    cell: ({ row }) => (
      <Badge variant="outline" className="gap-1.5 pr-2.5 font-normal">
        <NetworkIcon
          networkId={row.original.network}
          name={row.original.networkName}
          imageUrl={row.original.networkImageUrl}
          size={14}
        />
        <span className="truncate">
          {row.original.networkName ?? row.original.network}
        </span>
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
    accessorFn: (row) => row.buys24h + row.sells24h,
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.buys24h} buys · {row.original.sells24h} sells
      </span>
    ),
  },
  {
    id: "link",
    header: "",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Link
          href={poolDetailPath(row.original.network, row.original.address)}
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
  return (
    <DataTable
      columns={columns}
      data={data}
      enableFilter
      filterPlaceholder="Filter pools…"
      getFilterText={(row) => `${row.name} ${row.dex} ${row.network}`}
    />
  );
}
