import { useMemo } from "react";
import type { VetRecord } from "@dog-care/domain";
import { getVetRecordGradient } from "./utils";

export function useVetCardDetails(record: VetRecord) {
  return useMemo(() => {
    const gradientColors = getVetRecordGradient(record);
    const cardTitle = record.title;
    const cardSubtitle =`${record.date} • ${record.time}`;
    const badgeText = record.clinic?.trim() || "Домашний уход";
    const noteText = record.note?.trim();

    return { gradientColors, cardTitle, cardSubtitle, badgeText, noteText };
  }, [record]);
}
