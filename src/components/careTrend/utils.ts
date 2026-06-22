import { formatLocalDate } from "@dog-care/core/utils";
import type { CareTrendRange } from "./types";

export function findLatestDataIndex(points: { hasData: boolean }[]) {
  for (let index = points.length - 1; index >= 0; index -= 1) {
    if (points[index].hasData) return index;
  }
  return -1;
}

export function getTrendBarHeight(value: number | null, min: number, max: number) {
  if (value === null) return 4;
  if (max === min) return 52;
  return 12 + ((value - min) / (max - min)) * 76;
}

export function formatTrendPercent(value: number) {
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${rounded}%`;
}

export function formatTrendBoundaryDate(timestamp: number, otherTimestamp: number) {
  const includeYear = new Date(timestamp).getFullYear() !== new Date(otherTimestamp).getFullYear();
  return formatLocalDate(timestamp, {
    day: "numeric",
    month: "short",
    year: includeYear ? "numeric" : undefined,
  });
}

export function getTrendAxisIndexes(range: CareTrendRange, pointCount: number) {
  return range === 7
    ? Array.from({ length: pointCount }, (_, index) => index)
    : [0, 7, 14, 21, pointCount - 1];
}
