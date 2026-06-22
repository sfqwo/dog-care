import { useMemo } from "react";
import type { Feeding } from "@dog-care/domain";
import { formatDateTime } from "@dog-care/core/utils";
import { getFeedingGradient, getFeedingPortionLabel } from "./utils";

export function useFeedingCardDetails(feeding: Feeding) {
  return useMemo(() => {
    const gradientColors = getFeedingGradient(feeding.grams);
    const cardSubtitle = getFeedingPortionLabel(feeding.grams);
    const cardTitle = formatDateTime(feeding.at);
    const noteText = feeding.food ? `Рацион: ${feeding.food}` : undefined;
    return { gradientColors, cardSubtitle, cardTitle, noteText };
  }, [feeding.grams, feeding.food, feeding.at]);
}
