"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import type { YieldPool } from "@/lib/api/defillama";
import { formatUsd } from "@/lib/format";

const columns: ColumnDef<YieldPool>[] = [
  {
    accessorKey: "project",
    header: "Project",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.project}</div>
        <div className="text-xs text-muted-foreground">{row.original.symbol}</div>
      </div>
    ),
  },
  {
    accessorKey: "chain",
    header: "Chain",
  },
  {
    accessorKey: "tvlUsd",
    header: "TVL",
    cell: ({ row }) => formatUsd(row.original.tvlUsd, true),
  },
  {
    accessorKey: "apy",
    header: "APY",
    cell: ({ row }) =>
      row.original.apy != null ? `${row.original.apy.toFixed(2)}%` : "—",
  },
  {
    accessorKey: "stablecoin",
    header: "Type",
    cell: ({ row }) => (
      <Badge variant="outline">
        {row.original.stablecoin ? "Stable" : "Volatile"}
      </Badge>
    ),
  },
];

export function YieldTable({ data }: { data: YieldPool[] }) {
  return <DataTable columns={columns} data={data} />;
}
