import { useMemo } from "react";
import type { Walk } from "@/src/domain/types";

export function useWalkStats(walks: Walk[]) {
  return useMemo(() => {
    if (!walks.length) {
      return { totalMinutes: 0, avgDuration: 0, longest: 0 };
    }

    const totalMinutes = walks.reduce((sum, walk) => sum + walk.durationMin, 0);
    const avgDuration = Math.max(1, Math.round(totalMinutes / walks.length));
    const longest = walks.reduce((max, walk) => Math.max(max, walk.durationMin), 0);

    return { totalMinutes, avgDuration, longest };
  }, [walks]);
}
