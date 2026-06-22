import type { ReactNode } from "react";
import type {
  TrendAggregation,
  TrendComparison,
  TrendPoint,
} from "@dog-care/core/utils";

export type CareTrendRange = 7 | 30;

export type CareTrendProps = {
  title: string;
  children: ReactNode;
};

export type CareTrendSeriesProps = {
  points: TrendPoint[];
  aggregation: TrendAggregation;
  comparison?: TrendComparison;
  thresholdPercent?: number;
  formatValue: (value: number) => string;
  emptyText?: string;
};

export type CareTrendContextValue = {
  range: CareTrendRange;
};
