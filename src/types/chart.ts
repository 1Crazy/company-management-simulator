export interface ChartPoint {
  x: number;
  y: number;
}

export interface ChartPadding {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

export interface ChartOptions {
  height?: number;
  subtitle?: string;
  title?: string;
  width?: number;
}

export interface ChartDatum {
  label: string;
}

export interface ChartSeries<TDatum extends ChartDatum = ChartDatum> {
  color: string;
  fill?: string;
  key: Extract<keyof TDatum, string>;
  label: string;
}

export interface WaterfallItem {
  label: string;
  value: number;
}

export interface WaterfallStep {
  end: number;
  item: WaterfallItem;
  start: number;
}
