import type { VetRecord } from "@dog-care/domain";
import { gradients } from "@/src/theme";

const CLINIC_GRADIENT = gradients.card;
const HOMECARE_GRADIENT = gradients.cardMuted;
const NOTES_GRADIENT = gradients.cardWarm;

export function getVetRecordGradient(record: VetRecord) {
  if (record.note?.trim()) return NOTES_GRADIENT;
  if (record.clinic?.trim()) return CLINIC_GRADIENT;
  return HOMECARE_GRADIENT;
}
