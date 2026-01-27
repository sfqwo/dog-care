import type {
  AllergyEntry,
  HealthNoteField,
  TreatmentEntry,
  TreatmentType,
  VaccineEntry,
  VaccineEntries,
  VaccineType,
  VetHealthByPet,
  VetHealthInfo,
  VetRecord,
  VetRecordsByPet,
} from "@dog-care/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { ComponentProps } from "react";

export type VetListItemProps = {
  record: VetRecord;
  onRemove: (id: string) => void;
};

export type VetSectionTab = "passport" | "records";
export type VetSectionTabIcon = ComponentProps<typeof MaterialCommunityIcons>["name"];

export type VaccineSection = {
  key: VaccineType;
  title: string;
  description: string;
  keywords: RegExp[];
  clinicPlaceholder: string;
};

export type TreatmentSection = {
  key: TreatmentType;
  title: string;
  description: string;
  productPlaceholder: string;
  dosePlaceholder: string;
};

export type SectionTabMeta = {
  key: VetSectionTab;
  title: string;
  subtitle: string;
  icon: string;
};

export type {
  AllergyEntry,
  HealthNoteField,
  TreatmentEntry,
  TreatmentType,
  VaccineEntry,
  VaccineEntries,
  VaccineType,
  VetHealthByPet,
  VetHealthInfo,
  VetRecordsByPet,
};
