"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react";
import { type ReactNode, useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type ColumnMeta = {
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  enableFilter?: boolean;
  filterPlaceholder?: string;
  getFilterText?: (row: TData) => string;
};

function SortableHeader({
  column,
  children,
  className,
}: {
  column: {
    getCanSort: () => boolean;
    getIsSorted: () => false | "asc" | "desc";
    getToggleSortingHandler: () => ((e: unknown) => void) | undefined;
  };
  children: ReactNode;
  className?: string;
}) {
  if (!column.getCanSort()) {
    return <span className={className}>{children}</span>;
  }

  const sorted = column.getIsSorted();

  return (
    <button
      type="button"
      className={cn(
        "-ml-1 flex items-center gap-1 rounded-md px-1 py-0.5 transition-colors hover:text-foreground",
        className,
      )}
      onClick={column.getToggleSortingHandler()}
    >
      {children}
      {sorted === "asc" ? (
        <ArrowUp className="size-3.5 shrink-0 opacity-70" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3.5 shrink-0 opacity-70" />
      ) : (
        <ArrowUpDown className="size-3.5 shrink-0 opacity-35" />
      )}
    </button>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  enableFilter = false,
  filterPlaceholder = "Filter…",
  getFilterText,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  // TanStack Table exposes imperative getters that React Compiler cannot memoize safely.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      if (!filterValue) return true;
      const text = getFilterText?.(row.original) ?? "";
      return text.toLowerCase().includes(String(filterValue).toLowerCase());
    },
  });

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card/40 shadow-card backdrop-blur-sm">
      {enableFilter ? (
        <div className="border-b border-border/60 px-3 py-2">
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={filterPlaceholder}
              className="h-8 border-border/60 bg-background/60 pl-8 text-sm"
            />
          </div>
        </div>
      ) : null}
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const meta = header.column.columnDef.meta as
                  | ColumnMeta
                  | undefined;

                return (
                  <TableHead key={header.id} className={meta?.headerClassName}>
                    {header.isPlaceholder ? null : (
                      <SortableHeader column={header.column}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </SortableHeader>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  const meta = cell.column.columnDef.meta as
                    | ColumnMeta
                    | undefined;

                  return (
                    <TableCell key={cell.id} className={meta?.cellClassName}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
