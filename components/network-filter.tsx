"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NetworkIcon } from "@/components/network-icon";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { DEX_NETWORKS } from "@/lib/constants/navigation";
import { usePreferencesStore } from "@/stores/preferences-store";
import { cn } from "@/lib/utils";

type NetworkOption = { id: string; label: string };

const POPULAR_IDS = new Set<string>(DEX_NETWORKS.map((n) => n.id));

function chipClassName(active: boolean) {
  return cn(
    "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors sm:px-4 sm:py-2",
    active
      ? "bg-primary text-primary-foreground"
      : "bg-muted hover:bg-muted/80"
  );
}

function NetworkChipIcon({
  networkId,
  label,
  imageUrl,
  active,
}: {
  networkId: string;
  label: string;
  imageUrl?: string | null;
  active: boolean;
}) {
  if (networkId === "all") {
    return <Globe className="size-3.5 shrink-0 opacity-80" aria-hidden />;
  }

  return (
    <NetworkIcon
      networkId={networkId}
      name={label}
      imageUrl={imageUrl}
      size={14}
      className={
        active && !imageUrl
          ? "bg-primary-foreground/15 text-primary-foreground"
          : undefined
      }
    />
  );
}

export function NetworkFilter({
  allNetworks,
  networkImageById = {},
}: {
  allNetworks: NetworkOption[];
  networkImageById?: Record<string, string>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setDexNetwork = usePreferencesStore((s) => s.setDexNetwork);
  const [moreOpen, setMoreOpen] = useState(false);
  const [search, setSearch] = useState("");

  const active = searchParams.get("network") ?? "all";

  const labelById = useMemo(() => {
    const map = new Map<string, string>();
    for (const n of DEX_NETWORKS) map.set(n.id, n.label);
    for (const n of allNetworks) map.set(n.id, n.label);
    return map;
  }, [allNetworks]);

  const extraNetworks = useMemo(
    () =>
      [...allNetworks]
        .filter((n) => !POPULAR_IDS.has(n.id))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [allNetworks]
  );

  const filteredExtra = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return extraNetworks;
    return extraNetworks.filter(
      (n) =>
        n.label.toLowerCase().includes(q) || n.id.toLowerCase().includes(q)
    );
  }, [extraNetworks, search]);

  const isPopularActive = POPULAR_IDS.has(active);
  const isExtraActive = active !== "all" && !isPopularActive;
  const activeLabel = labelById.get(active) ?? active;
  const activeImageUrl =
    active !== "all" ? networkImageById[active] : undefined;

  const selectNetwork = useCallback(
    (networkId: string) => {
      setDexNetwork(networkId);
      const params = new URLSearchParams(searchParams.toString());
      if (networkId === "all") {
        params.delete("network");
      } else {
        params.set("network", networkId);
      }
      const query = params.toString();
      router.push(query ? `/dex?${query}` : "/dex");
    },
    [router, searchParams, setDexNetwork]
  );

  const handleMoreSelect = (networkId: string) => {
    selectNetwork(networkId);
    setMoreOpen(false);
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="shrink-0 text-sm text-muted-foreground">Network</span>
      <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DEX_NETWORKS.map((network) => (
          <button
            key={network.id}
            type="button"
            onClick={() => selectNetwork(network.id)}
            className={chipClassName(active === network.id)}
          >
            <NetworkChipIcon
              networkId={network.id}
              label={network.label}
              imageUrl={networkImageById[network.id]}
              active={active === network.id}
            />
            {network.label}
          </button>
        ))}

        {extraNetworks.length > 0 ? (
          <>
            <Button
              type="button"
              variant={isExtraActive ? "default" : "outline"}
              size="sm"
              className={cn(
                "h-auto shrink-0 gap-1.5 rounded-full px-3 py-1.5 text-sm sm:px-4 sm:py-2",
                isExtraActive && "bg-primary text-primary-foreground hover:bg-primary/80"
              )}
              onClick={() => setMoreOpen(true)}
            >
              {isExtraActive ? (
                <>
                  <NetworkChipIcon
                    networkId={active}
                    label={activeLabel}
                    imageUrl={activeImageUrl}
                    active
                  />
                  {activeLabel}
                </>
              ) : (
                "More networks"
              )}
              <ChevronsUpDown className="size-3.5 opacity-60" />
            </Button>

            <CommandDialog
              open={moreOpen}
              onOpenChange={(open) => {
                setMoreOpen(open);
                if (!open) setSearch("");
              }}
              title="Select network"
              description="Search and select a DEX network"
            >
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search networks..."
                  value={search}
                  onValueChange={setSearch}
                />
                <CommandList>
                  <CommandEmpty>No network found.</CommandEmpty>
                  <CommandGroup heading="Networks">
                    {filteredExtra.map((network) => (
                      <CommandItem
                        key={network.id}
                        value={network.id}
                        onSelect={() => handleMoreSelect(network.id)}
                      >
                        <NetworkIcon
                          networkId={network.id}
                          name={network.label}
                          imageUrl={networkImageById[network.id]}
                          size={18}
                        />
                        <span className="flex-1">{network.label}</span>
                        {active === network.id ? (
                          <Check className="size-4 text-primary" />
                        ) : null}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </CommandDialog>
          </>
        ) : null}
      </div>
    </div>
  );
}
