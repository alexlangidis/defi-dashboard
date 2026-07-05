"use client";

import { useEffect, useState } from "react";
import { CoinImage } from "@/components/coin-image";
import { useRouter } from "next/navigation";
import { Clock, ExternalLink, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SearchShortcut } from "@/components/search-shortcut";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { formatUsd } from "@/lib/format";
import { poolDetailPath } from "@/lib/pool-path";
import { useSearchHistoryStore } from "@/stores/search-history-store";

type SearchResult = {
  coins: Array<{
    id: string;
    name: string;
    symbol: string;
    thumb: string;
    market_cap_rank: number | null;
  }>;
  pools: Array<{
    id: string;
    name: string;
    network: string;
    address: string;
    volume24h: number;
    geckoTerminalUrl: string;
  }>;
};

export function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({ coins: [], pools: [] });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const history = useSearchHistoryStore((s) => s.items);
  const addHistory = useSearchHistoryStore((s) => s.add);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults({ coins: [], pools: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        if (res.ok) setResults(await res.json());
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function go(path: string, historyItem?: Parameters<typeof addHistory>[0]) {
    if (historyItem) addHistory(historyItem);
    setOpen(false);
    setQuery("");
    router.push(path);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="hidden h-8 w-56 justify-start gap-2 text-muted-foreground md:flex"
        onClick={() => setOpen(true)}
      >
        <Search className="size-3.5" />
        Search tokens & pools…
        <SearchShortcut className="pointer-events-none ml-auto rounded border bg-muted px-1.5 font-mono text-[10px]" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Search"
      >
        <Search className="size-4" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setQuery("");
        }}
        commandProps={{
          shouldFilter: false,
        }}
      >
        <CommandInput
          placeholder="Search tokens or DEX pools…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          <CommandEmpty>
            {loading ? "Searching…" : "No results found."}
          </CommandEmpty>
          {!query.trim() && history.length > 0 ? (
            <CommandGroup heading="Recent">
              {history.map((item) => (
                <CommandItem
                  key={`${item.type}-${item.id}`}
                  value={item.label}
                  onSelect={() => go(item.href, item)}
                >
                  <Clock className="size-3.5 text-muted-foreground" />
                  <span>{item.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {results.coins.length > 0 ? (
            <CommandGroup heading="Tokens">
              {results.coins.map((coin) => (
                <CommandItem
                  key={coin.id}
                  value={`${coin.name} ${coin.symbol}`}
                  onSelect={() =>
                    go(`/tokens/${coin.id}`, {
                      type: "token",
                      id: coin.id,
                      label: coin.name,
                      href: `/tokens/${coin.id}`,
                    })
                  }
                >
                  <CoinImage src={coin.thumb} alt="" size={20} />
                  <span>{coin.name}</span>
                  <span className="text-xs uppercase text-muted-foreground">
                    {coin.symbol}
                  </span>
                  {coin.market_cap_rank ? (
                    <span className="ml-auto text-xs text-muted-foreground">
                      #{coin.market_cap_rank}
                    </span>
                  ) : null}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {results.coins.length > 0 && results.pools.length > 0 ? (
            <CommandSeparator />
          ) : null}
          {results.pools.length > 0 ? (
            <CommandGroup heading="DEX Pools">
              {results.pools.map((pool) => (
                <CommandItem
                  key={pool.id}
                  value={`${pool.name} ${pool.network}`}
                  onSelect={() => {
                    const href = poolDetailPath(pool.network, pool.address);
                    go(href, {
                      type: "pool",
                      id: pool.id,
                      label: pool.name,
                      href,
                    });
                  }}
                >
                  <span className="font-medium">{pool.name}</span>
                  <span className="text-xs uppercase text-muted-foreground">
                    {pool.network}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {formatUsd(pool.volume24h, true)}
                  </span>
                  <ExternalLink className="size-3 text-muted-foreground" />
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      </CommandDialog>
    </>
  );
}
