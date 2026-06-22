import { endOfLocalDay, startOfLocalDay } from "./dateTime";

export type TrendPoint = {
  at: number;
  value: number;
};

export type DailyTrendPoint = {
  at: number;
  value: number | null;
  hasData: boolean;
};

export type TrendAggregation = "sum" | "average" | "last";
export type TrendComparison = "halves" | "firstLast";

export function buildDailyTrend(
  points: TrendPoint[],
  days: number,
  aggregation: TrendAggregation,
  now = Date.now()
) {
  const today = startOfLocalDay(now);
  const firstDay = new Date(today);
  firstDay.setDate(firstDay.getDate() - days + 1);

  return Array.from({ length: days }, (_, index): DailyTrendPoint => {
    const day = new Date(firstDay);
    day.setDate(day.getDate() + index);
    const dayStart = day.getTime();
    const dayPoints = points
      .filter((point) => point.at >= dayStart && point.at <= endOfLocalDay(dayStart))
      .sort((first, second) => first.at - second.at);

    return {
      at: dayStart,
      value: aggregateTrendValues(dayPoints, aggregation),
      hasData: dayPoints.length > 0,
    };
  });
}

export function calculateTrendChange(
  points: DailyTrendPoint[],
  comparison: TrendComparison,
  thresholdPercent: number
) {
  if (points.filter((point) => point.hasData).length < 2) return null;
  const values = points.filter((point) => point.value !== null);
  if (values.length < 2) return null;

  const [before, after] = comparison === "firstLast"
    ? [values[0].value as number, values[values.length - 1].value as number]
    : getHalfAverages(points);
  if (before === null || after === null) return null;

  const percent = before === 0
    ? after === 0 ? 0 : 100
    : ((after - before) / Math.abs(before)) * 100;

  return {
    before,
    after,
    percent,
    significant: Math.abs(percent) >= thresholdPercent,
    direction: percent > 0 ? "up" as const : percent < 0 ? "down" as const : "stable" as const,
  };
}

function aggregateTrendValues(points: TrendPoint[], aggregation: TrendAggregation) {
  if (!points.length) return aggregation === "sum" ? 0 : null;
  if (aggregation === "last") return points[points.length - 1].value;
  const sum = points.reduce((total, point) => total + point.value, 0);
  return aggregation === "average" ? sum / points.length : sum;
}

function getHalfAverages(points: DailyTrendPoint[]): [number | null, number | null] {
  const middle = Math.floor(points.length / 2);
  return [average(points.slice(0, middle)), average(points.slice(middle))];
}

function average(points: DailyTrendPoint[]) {
  const values = points.flatMap((point) => point.value === null ? [] : [point.value]);
  if (!values.length) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}
