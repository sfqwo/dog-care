import type { ReactNode } from "react";
import type {
  AllergyEntry,
  HealthNoteField,
  TreatmentEntry,
  TreatmentSection,
  TreatmentType,
  VaccineEntry,
  VaccineType,
  VetHealthInfo,
} from "../vet.types";

export type VetPassportContextValue = {
  healthInfo: VetHealthInfo;
  disabled: boolean;
  setVaccineEntries: (type: VaccineType, entries: VaccineEntry[]) => void;
  setOptionalVaccines: (entries: VaccineEntry[]) => void;
  setTreatmentEntries: (type: TreatmentType, entries: TreatmentEntry[]) => void;
  setAllergyEntries: (entries: AllergyEntry[]) => void;
  setHealthNoteField: (field: HealthNoteField, value: string) => void;
};

export type TreatmentSectionCardProps = {
  section: TreatmentSection;
};

export type VetPassportSectionProps = {
  isActive: boolean;
  healthInfo: VetHealthInfo;
  selectedPetId?: string | null;
  onVaccineEntriesChange: (type: VaccineType, entries: VaccineEntry[]) => void;
  onOptionalVaccinesChange: (entries: VaccineEntry[]) => void;
  onTreatmentChange: (type: TreatmentType, entries: TreatmentEntry[]) => void;
  onAllergyChange: (entries: AllergyEntry[]) => void;
  onHealthNoteChange: (field: HealthNoteField, value: string) => void;
};

export type VetPasportProviderProps = {
  value: VetPassportContextValue;
  children: ReactNode;
}
