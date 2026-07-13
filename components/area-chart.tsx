"use client";

import { useId, useRef, useState } from "react";

import { formatUsd } from "@/lib/format";
import { cn } from "@/lib/utils";

const VIEW_WIDTH = 400;
const VIEW_X_PADDING = 4;
const DOMAIN_PADDING_RATIO = 0.1;

function toChartDate(x: number) {
  const date = new Date(x > 1e11 ? x : x * 1000);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getPointCoords(
  data: Array<{ x: number; y: number }>,
  index: number,
  height: number,
  min: number,
  range: number,
) {
  const x =
    VIEW_X_PADDING +
    (index / (data.length - 1)) * (VIEW_WIDTH - VIEW_X_PADDING * 2);
  const y = height - ((data[index].y - min) / range) * (height - 12) - 6;
  return { x, y };
}

export function AreaChart({
  data,
  className,
  height = 120,
  formatValue = (value) => formatUsd(value),
  formatLabel = toChartDate,
}: {
  data: Array<{ x: number; y: number }>;
  className?: string;
  height?: number;
  formatValue?: (value: number) => string;
  formatLabel?: (x: number) => string;
}) {
  const gradientId = useId().replace(/:/g, "");
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (data.length < 2) return null;

  const ys = data.map((d) => d.y);
  const dataMin = Math.min(...ys);
  const dataMax = Math.max(...ys);
  const dataRange = dataMax - dataMin;
  const domainPadding = dataRange
    ? dataRange * DOMAIN_PADDING_RATIO
    : Math.max(Math.abs(dataMax) * DOMAIN_PADDING_RATIO, 1);
  const min = dataMin - domainPadding;
  const range = dataRange + domainPadding * 2;
  const isUp = data[data.length - 1].y >= data[0].y;
  const stroke = isUp ? "#34d399" : "#f87171";

  const linePoints = data
    .map((d, i) => {
      const { x, y } = getPointCoords(data, i, height, min, range);
      return `${x},${y}`;
    })
    .join(" ");

  const areaPoints = `${VIEW_X_PADDING},${height} ${linePoints} ${VIEW_WIDTH - VIEW_X_PADDING},${height}`;

  const activePoint =
    activeIndex != null
      ? getPointCoords(data, activeIndex, height, min, range)
      : null;

  const handlePointer = (clientX: number) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const index = Math.round(ratio * (data.length - 1));
    setActiveIndex(index);
  };

  const tooltipLeft =
    activePoint != null
      ? `${(activePoint.x / VIEW_WIDTH) * 100}%`
      : undefined;

  return (
    <div className={cn("relative h-full w-full", className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEW_WIDTH} ${height}`}
        className="h-full w-full cursor-crosshair touch-none"
        preserveAspectRatio="none"
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
        aria-label="Price chart"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            {isUp ? (
              <>
                <stop offset="0%" stopColor="#34d399" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#f87171" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#f87171" stopOpacity="0" />
              </>
            )}
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <polyline
          fill="none"
          stroke={stroke}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={linePoints}
        />
        {activePoint ? (
          <>
            <line
              x1={activePoint.x}
              y1={0}
              x2={activePoint.x}
              y2={height}
              stroke="currentColor"
              strokeOpacity={0.15}
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          </>
        ) : null}
      </svg>

      {activePoint ? (
        <span
          className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background"
          style={{
            left: `${(activePoint.x / VIEW_WIDTH) * 100}%`,
            top: `${(activePoint.y / height) * 100}%`,
            backgroundColor: stroke,
          }}
          aria-hidden="true"
        />
      ) : null}

      {activeIndex != null ? (
        <div
          className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 rounded-md border border-border/60 bg-popover px-2.5 py-1.5 text-xs shadow-md"
          style={{ left: tooltipLeft }}
        >
          <p className="whitespace-nowrap text-muted-foreground">
            {formatLabel(data[activeIndex].x)}
          </p>
          <p className="whitespace-nowrap font-medium tabular-nums">
            {formatValue(data[activeIndex].y)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
