"use client";

import { useSyncExternalStore } from "react";

import { cn } from "@/lib/utils";

function subscribe() {
  return () => {};
}

function isApplePlatform() {
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function SearchShortcut({ className }: { className?: string }) {
  const shortcut = useSyncExternalStore(
    subscribe,
    () => (isApplePlatform() ? "⌘K" : "Ctrl+K"),
    () => null,
  );

  return (
    <kbd
      className={cn(className, !shortcut && "opacity-0")}
      aria-hidden={!shortcut}
    >
      {shortcut ?? "⌘K"}
    </kbd>
  );
}
