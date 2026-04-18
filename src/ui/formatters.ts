import type { SaveSlotId } from "@/types/save";
import type { ObjectiveMetricKey } from "@/types/simulator";

const currencyFormatter = new Intl.NumberFormat("zh-CN", {
  currency: "CNY",
  maximumFractionDigits: 0,
  style: "currency"
});

const compactCurrencyFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 1,
  notation: "compact"
});

const percentFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 1,
  style: "percent"
});

const signedNumberFormatter = new Intl.NumberFormat("zh-CN", {
  maximumFractionDigits: 1,
  signDisplay: "always"
});

const metricLabelMap: Record<ObjectiveMetricKey, string> = {
  accumulatedProfit: "累计利润",
  cash: "现金",
  debt: "债务",
  marketShare: "市场份额",
  morale: "士气",
  quality: "质量",
  revenue: "营收"
};

const slotLabelMap: Record<SaveSlotId, string> = {
  auto: "自动存档",
  "slot-1": "手动槽位 A",
  "slot-2": "手动槽位 B",
  "slot-3": "手动槽位 C"
};

export function escapeHtml(value: unknown): string {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value || 0);
}

export function formatCompactCurrency(value: number): string {
  return compactCurrencyFormatter.format(value || 0);
}

export function formatPercent(value: number): string {
  return percentFormatter.format(value || 0);
}

export function formatSignedCurrency(value: number): string {
  const prefix = value >= 0 ? "+" : "-";
  return `${prefix}${formatCurrency(Math.abs(value))}`;
}

export function formatSignedNumber(value: number, suffix = ""): string {
  return `${signedNumberFormatter.format(value || 0)}${suffix}`;
}

export function formatDateTime(value?: string): string {
  if (!value) {
    return "未保存";
  }

  try {
    return new Intl.DateTimeFormat("zh-CN", {
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      month: "numeric"
    }).format(new Date(value));
  } catch {
    return "未保存";
  }
}

export function metricLabel(key: ObjectiveMetricKey | string): string {
  return metricLabelMap[key as ObjectiveMetricKey] ?? key;
}

export function formatMetricValue(key: ObjectiveMetricKey | string, value: number): string {
  if (key === "marketShare") {
    return formatPercent(value);
  }

  if (key === "cash" || key === "debt" || key === "accumulatedProfit" || key === "revenue") {
    return formatCurrency(value);
  }

  return `${Math.round(value)}`;
}

export function saveSlotLabel(slotId: SaveSlotId | string): string {
  return slotLabelMap[slotId as SaveSlotId] ?? slotId;
}
