import { useMemo } from "react";
import type { Walk } from "@dog-care/types";
import { formatDateTime } from "@dog-care/core/utils";

const SHORT = ["#fdf2f8", "#fce7f3", "#ffe4e6"] as const;
const MEDIUM = ["#ecfccb", "#d9f99d", "#bef264"] as const;
const LONG = ["#ede9fe", "#ddd6fe", "#c4b5fd"] as const;

export function useWalkCardDetails(walk: Walk) {
  return useMemo(() => {
    const gradientColors = getGradient(walk.durationMin);
    const cardSubtitle = getLabel(walk.durationMin);
    const cardTitle = formatDateTime(walk.startedAt);
    return { gradientColors, cardSubtitle, cardTitle };
  }, [walk.durationMin, walk.startedAt]);
}

function getGradient(minutes: number) {
  if (minutes <= 20) return SHORT;
  if (minutes <= 40) return MEDIUM;
  return LONG;
}

function getLabel(minutes: number) {
  if (minutes <= 20) return "Быстрая прогулка";
  if (minutes <= 40) return "Баланс движения";
  return "Большое приключение";
}
