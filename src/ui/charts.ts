import type {
  ChartDatum,
  ChartOptions,
  ChartPadding,
  ChartPoint,
  ChartSeries,
  WaterfallItem,
  WaterfallStep
} from "@/types/chart";

import { escapeHtml } from "./formatters";

const DEFAULT_LINE_CHART_SIZE = {
  height: 240,
  width: 640
} as const;

const DEFAULT_WATERFALL_SIZE = {
  height: 220,
  width: 640
} as const;

function buildSeriesPath(points: ChartPoint[]): string {
  return points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(" ");
}

function buildAreaPath(points: ChartPoint[], baseline: number): string {
  if (!points.length) {
    return "";
  }

  return `${buildSeriesPath(points)} L ${points.at(-1)!.x.toFixed(2)} ${baseline.toFixed(2)} L ${points[0]!.x.toFixed(
    2
  )} ${baseline.toFixed(2)} Z`;
}

function resolveNumericValue(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function normalizePoints<TDatum extends ChartDatum>(
  data: TDatum[],
  key: ChartSeries<TDatum>["key"],
  width: number,
  height: number,
  padding: ChartPadding,
  minValue: number,
  maxValue: number
): ChartPoint[] {
  const drawableWidth = width - padding.left - padding.right;
  const drawableHeight = height - padding.top - padding.bottom;

  return data.map((item, index) => {
    const value = resolveNumericValue(item[key]);
    const x = padding.left + (drawableWidth * index) / Math.max(1, data.length - 1);
    const y =
      padding.top + drawableHeight - ((value - minValue) / Math.max(1, maxValue - minValue || 1)) * drawableHeight;

    return { x, y };
  });
}

function placeholder(title: string, description: string): string {
  return `
    <div class="chart-empty" role="img" aria-label="${escapeHtml(title)}">
      <strong>${escapeHtml(title)}</strong>
      <span>${escapeHtml(description)}</span>
    </div>
  `;
}

export function createMultiSeriesChart<TDatum extends ChartDatum>(
  data: TDatum[],
  series: Array<ChartSeries<TDatum>>,
  options: ChartOptions = {}
): string {
  const width = options.width ?? DEFAULT_LINE_CHART_SIZE.width;
  const height = options.height ?? DEFAULT_LINE_CHART_SIZE.height;
  const padding: ChartPadding = { bottom: 28, left: 18, right: 18, top: 18 };

  if (!data.length) {
    return placeholder(options.title ?? "暂无趋势图", "先推进一个经营周期，趋势线才会开始形成。");
  }

  const values = data.flatMap((item) => series.map((entry) => resolveNumericValue(item[entry.key])));
  const minValue = Math.min(0, ...values);
  const maxValue = Math.max(...values, 1);
  const drawableHeight = height - padding.top - padding.bottom;
  const baseline =
    padding.top + drawableHeight - ((0 - minValue) / Math.max(1, maxValue - minValue || 1)) * drawableHeight;

  const grid = Array.from({ length: 4 }, (_, index) => {
    const y = padding.top + (drawableHeight / 3) * index;
    return `<line x1="${padding.left}" x2="${width - padding.right}" y1="${y}" y2="${y}" class="chart-grid-line" />`;
  }).join("");

  const labels = data
    .map((item, index) => {
      const x = padding.left + ((width - padding.left - padding.right) * index) / Math.max(1, data.length - 1);
      return `<text x="${x}" y="${height - 8}" class="chart-axis-label" text-anchor="middle">${escapeHtml(String(item.label ?? ""))}</text>`;
    })
    .join("");

  const seriesMarkup = series
    .map((entry) => {
      const points = normalizePoints(data, entry.key, width, height, padding, minValue, maxValue);
      const linePath = buildSeriesPath(points);
      const fillPath = entry.fill ? buildAreaPath(points, height - padding.bottom) : "";

      return `
        ${entry.fill ? `<path d="${fillPath}" fill="${entry.fill}" class="chart-fill" />` : ""}
        <path d="${linePath}" fill="none" stroke="${entry.color}" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" />
      `;
    })
    .join("");

  const legend = series
    .map(
      (entry) => `
        <div class="chart-legend-item">
          <span class="chart-legend-dot" style="background:${entry.color}"></span>
          <span>${escapeHtml(entry.label)}</span>
        </div>
      `
    )
    .join("");

  return `
    <div class="chart-shell">
      <div class="chart-head">
        <div>
          <strong>${escapeHtml(options.title ?? "")}</strong>
          <span>${escapeHtml(options.subtitle ?? "")}</span>
        </div>
        <div class="chart-legend">${legend}</div>
      </div>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(options.title ?? "趋势图")}">
        ${grid}
        <line x1="${padding.left}" x2="${width - padding.right}" y1="${baseline}" y2="${baseline}" class="chart-zero-line" />
        ${seriesMarkup}
        ${labels}
      </svg>
    </div>
  `;
}

export function createWaterfallChart(items: WaterfallItem[], options: ChartOptions = {}): string {
  if (!items.length) {
    return placeholder(options.title ?? "暂无现金流桥", "完成首个经营周期后，这里会展示现金流桥。");
  }

  const width = options.width ?? DEFAULT_WATERFALL_SIZE.width;
  const height = options.height ?? DEFAULT_WATERFALL_SIZE.height;
  const padding: ChartPadding = { bottom: 32, left: 18, right: 18, top: 18 };
  const drawableHeight = height - padding.top - padding.bottom;

  const runningValues: WaterfallStep[] = [];
  let running = 0;

  for (const item of items) {
    const start = running;
    running += item.value;
    runningValues.push({ end: running, item, start });
  }

  const values = runningValues.flatMap((entry) => [entry.start, entry.end]);
  const minValue = Math.min(...values, 0);
  const maxValue = Math.max(...values, 1);
  const barWidth = (width - padding.left - padding.right) / items.length - 10;

  const bars = runningValues
    .map((entry, index) => {
      const x = padding.left + index * ((width - padding.left - padding.right) / items.length) + 5;
      const topValue = Math.max(entry.start, entry.end);
      const bottomValue = Math.min(entry.start, entry.end);
      const top = padding.top + drawableHeight - ((topValue - minValue) / Math.max(1, maxValue - minValue)) * drawableHeight;
      const bottom =
        padding.top + drawableHeight - ((bottomValue - minValue) / Math.max(1, maxValue - minValue)) * drawableHeight;
      const color = entry.item.value >= 0 ? "var(--color-success)" : "var(--color-danger)";

      return `
        <rect x="${x}" y="${top}" width="${barWidth}" height="${Math.max(4, bottom - top)}" fill="${color}" rx="8" />
        <text x="${x + barWidth / 2}" y="${height - 10}" class="chart-axis-label" text-anchor="middle">${escapeHtml(entry.item.label)}</text>
      `;
    })
    .join("");

  return `
    <div class="chart-shell">
      <div class="chart-head">
        <div>
          <strong>${escapeHtml(options.title ?? "现金流桥")}</strong>
          <span>${escapeHtml(options.subtitle ?? "展示本回合主要现金流入与流出来源。")}</span>
        </div>
      </div>
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(options.title ?? "现金流桥")}">
        ${bars}
      </svg>
    </div>
  `;
}
