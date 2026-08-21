"use client";
import * as React from "react";
import { cn } from "../lib/cn";

/**
 * Grafieken — eigen SVG-implementatie, geen chartbibliotheek.
 * Kleuren komen uit --chart-1 … --chart-6 (afgeleid van het design).
 */

const PALETTE = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)", "var(--chart-6)"];

export interface ChartDatum {
  label: string;
  value: number;
  color?: string;
}

/* ============================ Sparkline ============================ */
export interface SparklineProps extends React.HTMLAttributes<HTMLDivElement> {
  data: number[];
  height?: number;
  color?: string;
  /** Vult het vlak onder de lijn. */
  filled?: boolean;
  strokeWidth?: number;
}

export const Sparkline = React.forwardRef<HTMLDivElement, SparklineProps>(function Sparkline(
  { data, height = 40, color = "var(--chart-1)", filled = true, strokeWidth = 2, className, ...rest },
  ref
) {
  const width = 100;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const points = data.map((value, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * width;
    const y = height - ((value - min) / span) * (height - strokeWidth) - strokeWidth / 2;
    return `${x},${y}`;
  });

  return (
    <div ref={ref} className={cn("pxui-sparkline", className)} style={{ height }} {...rest}>
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" width="100%" height={height}>
        {filled && (
          <polygon points={`0,${height} ${points.join(" ")} ${width},${height}`} fill={color} opacity="0.12" />
        )}
        <polyline
          points={points.join(" ")}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
});

/* ============================ BarChart ============================ */
export interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartDatum[];
  height?: number;
  /** Toont de waarde boven elke staaf. */
  showValues?: boolean;
  formatValue?: (value: number) => string;
  color?: string;
}

export const BarChart = React.forwardRef<HTMLDivElement, BarChartProps>(function BarChart(
  { data, height = 180, showValues, formatValue, color = "var(--chart-1)", className, ...rest },
  ref
) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div ref={ref} className={cn("pxui-barchart", className)} style={{ height }} {...rest}>
      {data.map((item, index) => (
        <div className="pxui-barchart-col" key={`${item.label}-${index}`}>
          {showValues && (
            <span className="pxui-barchart-value">
              {formatValue ? formatValue(item.value) : item.value}
            </span>
          )}
          <div className="pxui-barchart-track">
            <div
              className="pxui-barchart-bar"
              style={{
                height: `${(item.value / max) * 100}%`,
                background: item.color ?? color,
                animationDelay: `${index * 45}ms`,
              }}
              title={`${item.label}: ${item.value}`}
            />
          </div>
          <span className="pxui-barchart-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
});

/* ============================ LineChart ============================ */
export interface LineSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface LineChartProps extends React.HTMLAttributes<HTMLDivElement> {
  series: LineSeries[];
  labels?: string[];
  height?: number;
  /** Vult het vlak onder de lijn. */
  area?: boolean;
  /** Toont horizontale hulplijnen. */
  grid?: boolean;
  legend?: boolean;
}

export const LineChart = React.forwardRef<HTMLDivElement, LineChartProps>(function LineChart(
  { series, labels, height = 200, area, grid = true, legend = true, className, ...rest },
  ref
) {
  const width = 300;
  const padding = 6;
  const all = series.flatMap((entry) => entry.data);
  const max = Math.max(...all, 1);
  const min = Math.min(...all, 0);
  const span = max - min || 1;
  const count = Math.max(...series.map((entry) => entry.data.length), 2);

  const toPoints = (values: number[]) =>
    values.map((value, index) => {
      const x = (index / (count - 1)) * (width - padding * 2) + padding;
      const y = height - padding - ((value - min) / span) * (height - padding * 2);
      return { x, y };
    });

  return (
    <div ref={ref} className={cn("pxui-linechart", className)} {...rest}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} preserveAspectRatio="none">
        {grid &&
          [0, 0.25, 0.5, 0.75, 1].map((fraction) => (
            <line
              key={fraction}
              x1={0}
              x2={width}
              y1={padding + fraction * (height - padding * 2)}
              y2={padding + fraction * (height - padding * 2)}
              className="pxui-linechart-grid"
            />
          ))}
        {series.map((entry, index) => {
          const color = entry.color ?? PALETTE[index % PALETTE.length];
          const points = toPoints(entry.data);
          const path = points.map((point) => `${point.x},${point.y}`).join(" ");
          return (
            <g key={entry.name}>
              {area && (
                <polygon
                  points={`${padding},${height - padding} ${path} ${width - padding},${height - padding}`}
                  fill={color}
                  opacity="0.12"
                />
              )}
              <polyline
                points={path}
                fill="none"
                stroke={color}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </g>
          );
        })}
      </svg>
      {labels && (
        <div className="pxui-linechart-labels">
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}
      {legend && series.length > 0 && (
        <ChartLegend
          items={series.map((entry, index) => ({
            label: entry.name,
            color: entry.color ?? PALETTE[index % PALETTE.length],
          }))}
        />
      )}
    </div>
  );
});

/* ============================ DonutChart ============================ */
export interface DonutChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: ChartDatum[];
  size?: number;
  thickness?: number;
  centerLabel?: React.ReactNode;
  centerValue?: React.ReactNode;
  legend?: boolean;
}

export const DonutChart = React.forwardRef<HTMLDivElement, DonutChartProps>(function DonutChart(
  { data, size = 160, thickness = 22, centerLabel, centerValue, legend = true, className, ...rest },
  ref
) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div ref={ref} className={cn("pxui-donut", className)} {...rest}>
      <div className="pxui-donut-figure" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            strokeWidth={thickness}
            className="pxui-donut-track"
          />
          {data.map((item, index) => {
            const fraction = item.value / total;
            const dash = fraction * circumference;
            const circle = (
              <circle
                key={`${item.label}-${index}`}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color ?? PALETTE[index % PALETTE.length]}
                strokeWidth={thickness}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              >
                <title>{`${item.label}: ${item.value}`}</title>
              </circle>
            );
            offset += dash;
            return circle;
          })}
        </svg>
        {(centerValue || centerLabel) && (
          <div className="pxui-donut-center">
            {centerValue && <span className="pxui-donut-value">{centerValue}</span>}
            {centerLabel && <span className="pxui-donut-label">{centerLabel}</span>}
          </div>
        )}
      </div>
      {legend && (
        <ChartLegend
          items={data.map((item, index) => ({
            label: item.label,
            color: item.color ?? PALETTE[index % PALETTE.length],
            value: item.value,
          }))}
          vertical
        />
      )}
    </div>
  );
});

/* ============================ Legend ============================ */
export interface ChartLegendProps extends React.HTMLAttributes<HTMLDivElement> {
  items: Array<{ label: string; color: string; value?: number | string }>;
  vertical?: boolean;
}

export const ChartLegend = React.forwardRef<HTMLDivElement, ChartLegendProps>(function ChartLegend(
  { items, vertical, className, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("pxui-legend", vertical && "pxui-legend-vertical", className)} {...rest}>
      {items.map((item) => (
        <span className="pxui-legend-item" key={item.label}>
          <span className="pxui-legend-swatch" style={{ background: item.color }} />
          {item.label}
          {item.value !== undefined && <span className="pxui-legend-value">{item.value}</span>}
        </span>
      ))}
    </div>
  );
});

export { PALETTE as CHART_PALETTE };
