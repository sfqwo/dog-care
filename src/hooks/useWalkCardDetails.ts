import { useMemo } from "react";
import type { Walk } from "@/src/domain/types";
import { formatDateTime } from "@/src/ui/format";

const SHORT = ["#fdf2f8", "#fce7f3", "#ffe4e6"] as const;
const MEDIUM = ["#ecfccb", "#d9f99d", "#bef264"] as const;
const LONG = ["#ede9fe", "#ddd6fe", "#c4b5fd"] as const;

export function useWalkCardDetails(walk: Walk) {
  return useMemo(() => {
    const gradientColors = getGradient(walk.durationMin);
    const durationLabel = getLabel(walk.durationMin);
    const startedAtText = formatDateTime(walk.startedAt);
    return { gradientColors, durationLabel, startedAtText };
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
