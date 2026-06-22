import type {
  ActivityStatus,
  AppetiteStatus,
  StoolStatus,
  WellnessEntry,
} from "@dog-care/domain";

export type WellnessEntryForm = {
  date: string;
  time: string;
  appetite: AppetiteStatus;
  activity: ActivityStatus;
  stool: StoolStatus;
  vomiting: boolean;
  itching: boolean;
  temperature: string;
  note: string;
};

export type UseWellnessEntryEditorOptions = {
  selectedPetId?: string | null;
  addEntry: (petId: string, entry: WellnessEntry) => void;
  updateEntry: (petId: string, entry: WellnessEntry) => void;
  removeEntry: (petId: string, id: string) => void;
};
