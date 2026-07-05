"use client";

import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/components/data-table";
import { PercentBadge } from "@/components/percent-badge";
import type { Protocol } from "@/lib/api/defillama";
import { formatUsd } from "@/lib/format";

const columns: ColumnDef<Protocol>[] = [
  {
    accessorKey: "name",
    header: "Protocol",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-xs text-muted-foreground">
          {row.original.category}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "chains",
    header: "Chains",
    cell: ({ row }) => row.original.chains.slice(0, 3).join(", "),
  },
  {
    accessorKey: "tvl",
    header: "TVL",
    cell: ({ row }) => formatUsd(row.original.tvl, true),
  },
  {
    accessorKey: "change_1d",
    header: "1d",
    cell: ({ row }) => <PercentBadge value={row.original.change_1d} />,
  },
  {
    accessorKey: "change_7d",
    header: "7d",
    cell: ({ row }) => <PercentBadge value={row.original.change_7d} />,
  },
];

export function ProtocolTable({ data }: { data: Protocol[] }) {
  return <DataTable columns={columns} data={data} />;
}
