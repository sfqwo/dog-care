import { useMemo } from "react";
import type { Walk } from "@dog-care/domain";
import { formatDateTime } from "@dog-care/core/utils";
import { getWalkDurationLabel, getWalkGradient } from "./utils";

export function useWalkCardDetails(walk: Walk) {
  return useMemo(() => {
    const gradientColors = getWalkGradient(walk.durationMin);
    const cardSubtitle = getWalkDurationLabel(walk.durationMin);
    const cardTitle = formatDateTime(walk.startedAt);
    return { gradientColors, cardSubtitle, cardTitle };
  }, [walk.durationMin, walk.startedAt]);
}
