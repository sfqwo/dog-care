import type { MedicalDocument } from "./domain";

export function sortMedicalDocuments(documents: MedicalDocument[]) {
  return [...documents].sort((first, second) => second.at - first.at);
}
