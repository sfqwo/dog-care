import { useMemo } from "react";
import type { Feeding } from "@dog-care/types";

export function useFeedingStats(items: Feeding[]) {
  return useMemo(() => {
    if (!items.length) {
      return { totalGrams: 0, avgGrams: 0 };
    }

    const totalGrams = items.reduce((sum, meal) => sum + meal.grams, 0);
    const avgGrams = Math.max(1, Math.round(totalGrams / items.length));

    return { totalGrams, avgGrams };
  }, [items]);
}
