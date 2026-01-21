import { useMemo } from "react";
import type { VetRecord } from "@/src/domain/types";
import { formatDateTime } from "@/src/utils";

const CLINIC_GRADIENT = ["#e0f2fe", "#bae6fd", "#93c5fd"] as const;
const HOMECARE_GRADIENT = ["#ede9fe", "#ddd6fe", "#c4b5fd"] as const;
const NOTES_GRADIENT = ["#fef3c7", "#fde68a", "#fcd34d"] as const;

export function useVetCardDetails(record: VetRecord) {
  return useMemo(() => {
    const gradientColors = getGradient(record);
    const cardTitle = record.title;
    const cardSubtitle = formatDateTime(record.at);
    const badgeText = record.clinic?.trim() || "Домашний уход";
    const noteText = record.note?.trim();

    return { gradientColors, cardTitle, cardSubtitle, badgeText, noteText };
  }, [record.title, record.at, record.clinic, record.note]);
}

function getGradient(record: VetRecord) {
  if (record.note?.trim()) return NOTES_GRADIENT;
  if (record.clinic?.trim()) return CLINIC_GRADIENT;
  return HOMECARE_GRADIENT;
}
