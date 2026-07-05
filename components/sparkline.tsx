"use client";

import { useId, useRef, useState } from "react";

import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Sparkline({
  data,
  positive,
  className,
  width = 100,
  height = 32,
  formatValue = (value) => formatUsd(value),
}: {
  data: number[];
  positive?: boolean;
  className?: string;
  width?: number;
  height?: number;
  formatValue?: (value: number) => string;
}) {
  const gradId = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!data.length) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const coords = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return { x, y, value };
  });

  const points = coords.map(({ x, y }) => `${x},${y}`).join(" ");
  const isUp = positive ?? data[data.length - 1] >= data[0];
  const stroke = isUp ? "#34d399" : "#f87171";
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  const active = activeIndex != null ? coords[activeIndex] : null;

  const handlePointer = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const index = Math.round(ratio * (data.length - 1));
    setActiveIndex(index);
  };

  return (
    <div className={cn("relative inline-block", className)}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="cursor-crosshair overflow-visible touch-none"
        onMouseMove={(event) => handlePointer(event.clientX)}
        onMouseLeave={() => setActiveIndex(null)}
        onTouchStart={(event) => {
          if (event.touches[0]) handlePointer(event.touches[0].clientX);
        }}
        onTouchMove={(event) => {
          if (event.touches[0]) handlePointer(event.touches[0].clientX);
        }}
        onTouchEnd={() => setActiveIndex(null)}
        role="img"
        aria-label="Sparkline chart"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            {isUp ? (
              <>
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f87171" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
              </>
            )}
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#${gradId})`} />
        <polyline
          fill="none"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
        {active ? (
          <>
            <line
              x1={active.x}
              y1={0}
              x2={active.x}
              y2={height}
              stroke="currentColor"
              strokeOpacity={0.15}
              strokeWidth="1"
            />
            <circle
              cx={active.x}
              cy={active.y}
              r={3}
              fill={stroke}
              stroke="var(--background)"
              strokeWidth={1.5}
            />
          </>
        ) : null}
      </svg>

      {active ? (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded-md border border-border/60 bg-popover px-2 py-1 text-xs font-medium tabular-nums shadow-md">
          {formatValue(active.value)}
        </div>
      ) : null}
    </div>
  );
}
