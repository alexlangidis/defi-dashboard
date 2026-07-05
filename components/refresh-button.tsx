"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export function RefreshButton() {
  const router = useRouter();
  const [cooldown, setCooldown] = useState(false);

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="Refresh data"
      disabled={cooldown}
      onClick={() => {
        if (cooldown) return;
        setCooldown(true);
        router.refresh();
        toast.success("Data refreshed");
        setTimeout(() => setCooldown(false), 5000);
      }}
    >
      <RefreshCw className={`size-4 ${cooldown ? "animate-spin" : ""}`} />
    </Button>
  );
}
