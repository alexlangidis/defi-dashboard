"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

import { DataTable } from "@/components/data-table";
import type { Stablecoin } from "@/lib/api/defillama";
import { formatUsd } from "@/lib/format";

const columns: ColumnDef<Stablecoin>[] = [
  {
    accessorKey: "name",
    header: "Stablecoin",
    cell: ({ row }) => (
      <div>
        <div className="font-medium">{row.original.name}</div>
        <div className="text-xs text-muted-foreground uppercase">
          {row.original.symbol}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "pegType",
    header: "Peg",
  },
  {
    accessorKey: "circulating.peggedUSD",
    header: "Circulating",
    cell: ({ row }) =>
      formatUsd(row.original.circulating.peggedUSD, true),
  },
  {
    id: "chains",
    header: "Top Chains",
    cell: ({ row }) => {
      const chains = Object.entries(row.original.chainCirculating ?? {})
        .sort((a, b) => b[1].current.peggedUSD - a[1].current.peggedUSD)
        .slice(0, 2)
        .map(([chain]) => chain);
      return chains.join(", ");
    },
  },
  {
    id: "token",
    header: "",
    cell: ({ row }) =>
      row.original.gecko_id ? (
        <Link
          href={`/tokens/${row.original.gecko_id}`}
          className="text-sm text-primary hover:underline"
        >
          View
        </Link>
      ) : null,
  },
];

export function StablecoinTable({ data }: { data: Stablecoin[] }) {
  return <DataTable columns={columns} data={data} />;
}
