import type { MedicalDocument, MedicalDocumentType } from "@/packages/domain";

export type MedicalDocumentForm = {
  type: MedicalDocumentType;
  date: string;
  title: string;
  note: string;
  visitId: string;
  imageUris: string[];
};

export type UseMedicalDocumentEditorOptions = {
  selectedPetId?: string | null;
  addDocument: (petId: string, document: MedicalDocument) => void;
  updateDocument: (petId: string, document: MedicalDocument) => void;
  removeDocument: (petId: string, id: string) => void;
};