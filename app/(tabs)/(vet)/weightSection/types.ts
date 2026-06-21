import type { WeightEntry } from "@dog-care/domain";

export type WeightSectionProps = {
  isActive: boolean;
  hasPets: boolean;
  entries: WeightEntry[];
  selectedPetId?: string | null;
  onAddEntry: (petId: string, entry: WeightEntry) => void;
  onUpdateEntry: (petId: string, entry: WeightEntry) => void;
  onRemoveEntry: (petId: string, id: string) => void;
};

export type WeightEntryCardProps = {
  entry: WeightEntry;
  previousEntry?: WeightEntry;
  onRemove: (id: string) => void;
  onEdit: (entry: WeightEntry) => void;
};

export type WeightTrendChartProps = {
  entries: WeightEntry[];
};
