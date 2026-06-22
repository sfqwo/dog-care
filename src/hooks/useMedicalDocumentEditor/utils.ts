import type { MedicalDocument } from "@dog-care/domain";
import { formatCurrentDateInput } from "@dog-care/core/utils";
import type { MedicalDocumentForm } from "./types";

export const createInitialMedicalDocumentForm = (): MedicalDocumentForm => ({
  type: "analysis",
  date: formatCurrentDateInput(),
  title: "",
  note: "",
  visitId: "",
  imageUris: [],
});

export function buildMedicalDocument(
  id: string,
  petId: string,
  at: number,
  form: MedicalDocumentForm,
  imageUris: string[],
  createdAt = Date.now()
): MedicalDocument {
  return {
    id,
    petId,
    type: form.type,
    at,
    title: form.title.trim() || undefined,
    note: form.note.trim() || undefined,
    visitId: form.visitId || undefined,
    imageUris,
    createdAt,
  };
}
