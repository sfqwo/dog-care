import { useMemo } from "react";
import type { Feeding } from "@/src/domain/types";
import { formatDateTime } from "@/src/utils";

const LIGHT = ["#faf5ff", "#f5d0fe", "#f0abfc"] as const;
const BALANCED = ["#ecfccb", "#d9f99d", "#bef264"] as const;
const FEAST = ["#fef3c7", "#fde68a", "#fcd34d"] as const;

export function useFeedingCardDetails(feeding: Feeding) {
  return useMemo(() => {
    const gradientColors = getGradient(feeding.grams);
    const cardSubtitle = getPortionLabel(feeding.grams);
    const cardTitle = formatDateTime(feeding.at);
    const noteText = feeding.food ? `Рацион: ${feeding.food}` : undefined;
    return { gradientColors, cardSubtitle, cardTitle, noteText };
  }, [feeding.grams, feeding.food, feeding.at]);
}

function getGradient(grams: number) {
  if (grams <= 100) return LIGHT;
  if (grams <= 200) return BALANCED;
  return FEAST;
}

function getPortionLabel(grams: number) {
  if (grams <= 100) return "Легкий перекус";
  if (grams <= 200) return "Сбалансированная порция";
  return "Праздничный ужин";
}
