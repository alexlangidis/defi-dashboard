"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

function isApplePlatform() {
  return /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function SearchShortcut({ className }: { className?: string }) {
  const [shortcut, setShortcut] = useState<string | null>(null);

  useEffect(() => {
    setShortcut(isApplePlatform() ? "⌘K" : "Ctrl+K");
  }, []);

  return (
    <kbd
      className={cn(className, !shortcut && "opacity-0")}
      aria-hidden={!shortcut}
    >
      {shortcut ?? "⌘K"}
    </kbd>
  );
}
