import type { VetRecord } from "@dog-care/domain";

const CLINIC_GRADIENT = ["#e0f2fe", "#bae6fd", "#93c5fd"] as const;
const HOMECARE_GRADIENT = ["#ede9fe", "#ddd6fe", "#c4b5fd"] as const;
const NOTES_GRADIENT = ["#fef3c7", "#fde68a", "#fcd34d"] as const;

export function getVetRecordGradient(record: VetRecord) {
  if (record.note?.trim()) return NOTES_GRADIENT;
  if (record.clinic?.trim()) return CLINIC_GRADIENT;
  return HOMECARE_GRADIENT;
}
