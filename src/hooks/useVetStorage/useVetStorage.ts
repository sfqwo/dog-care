import { useCallback, useEffect, useMemo, useState } from "react";
import type { VetRecord ,
  AllergyEntry,
  HealthNoteField,
  TreatmentEntry,
  TreatmentType,
  VaccineEntry,
  VaccineType,
  VetHealthByPet,
  VetHealthInfo,
  VetRecordsByPet,
} from "@dog-care/types";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { EMPTY_HEALTH } from "@/app/(tabs)/(vet)/vet.constants";

type UseVetStorageResult = {
  records: VetRecord[];
  healthInfo: VetHealthInfo;
  addRecord: (record: VetRecord) => void;
  removeRecord: (id: string) => void;
  setVaccineEntries: (type: VaccineType, entries: VaccineEntry[]) => void;
  setOptionalVaccines: (next: VaccineEntry[]) => void;
  setTreatmentEntries: (type: TreatmentType, next: TreatmentEntry[]) => void;
  setAllergyEntries: (next: AllergyEntry[]) => void;
  setHealthNoteField: (field: HealthNoteField, value: string) => void;
};

export function useVetStorage(selectedPetId?: string | null): UseVetStorageResult {
  const [recordsByPet, setRecordsByPet] = useState<VetRecordsByPet>({});
  const [healthByPet, setHealthByPet] = useState<VetHealthByPet>({});

  useEffect(() => {
    loadJSON<VetRecordsByPet>(STORAGE_KEYS.VET, {}).then((stored) => {
      setRecordsByPet(stored ?? {});
    });
    loadJSON<VetHealthByPet>(STORAGE_KEYS.VET_HEALTH, {}).then((stored) => {
      setHealthByPet(stored ?? {});
    });
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.VET, recordsByPet);
  }, [recordsByPet]);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.VET_HEALTH, healthByPet);
  }, [healthByPet]);

  const records = useMemo(
    () => (selectedPetId ? recordsByPet[selectedPetId] ?? [] : []),
    [recordsByPet, selectedPetId]
  );

  const healthInfo = useMemo(
    () => (selectedPetId && healthByPet[selectedPetId]) || EMPTY_HEALTH,
    [healthByPet, selectedPetId]
  );

  const updateRecords = useCallback(
    (updater: (current: VetRecord[]) => VetRecord[]) => {
      if (!selectedPetId) return;
      setRecordsByPet((prev) => {
        const current = prev[selectedPetId] ?? [];
        const next = updater(current);
        if (next === current) return prev;
        return { ...prev, [selectedPetId]: next };
      });
    },
    [selectedPetId]
  );

  const updateHealth = useCallback(
    (updater: (current: VetHealthInfo) => VetHealthInfo) => {
      if (!selectedPetId) return;
      setHealthByPet((prev) => {
        const current = cloneHealth(prev[selectedPetId]);
        const next = updater(current);
        return { ...prev, [selectedPetId]: next };
      });
    },
    [selectedPetId]
  );

  const addRecord = useCallback(
    (record: VetRecord) => {
      updateRecords((current) => [record, ...current]);
    },
    [updateRecords]
  );

  const removeRecord = useCallback(
    (id: string) => {
      updateRecords((current) => current.filter((record) => record.id !== id));
    },
    [updateRecords]
  );

  const setVaccineEntries = useCallback(
    (type: VaccineType, entries: VaccineEntry[]) => {
      updateHealth((current) => {
        const vaccines = { ...(current.vaccines ?? {}) };
        vaccines[type] = entries;
        return { ...current, vaccines };
      });
    },
    [updateHealth]
  );

  const setOptionalVaccines = useCallback(
    (next: VaccineEntry[]) => {
      updateHealth((current) => ({ ...current, optionalVaccines: next }));
    },
    [updateHealth]
  );

  const setTreatmentEntries = useCallback(
    (type: TreatmentType, next: TreatmentEntry[]) => {
      updateHealth((current) => ({ ...current, [type]: next }));
    },
    [updateHealth]
  );

  const setAllergyEntries = useCallback(
    (next: AllergyEntry[]) => {
      updateHealth((current) => ({ ...current, allergyEntries: next }));
    },
    [updateHealth]
  );

  const setHealthNoteField = useCallback(
    (field: HealthNoteField, value: string) => {
      updateHealth((current) => ({ ...current, [field]: value }));
    },
    [updateHealth]
  );

  return {
    records,
    healthInfo,
    addRecord,
    removeRecord,
    setVaccineEntries,
    setOptionalVaccines,
    setTreatmentEntries,
    setAllergyEntries,
    setHealthNoteField,
  };
}

function cloneHealth(info?: VetHealthInfo | null): VetHealthInfo {
  const base = info ?? EMPTY_HEALTH;
  const cloneVaccines = Object.entries(base.vaccines ?? {}).reduce<
    NonNullable<VetHealthInfo["vaccines"]>
  >((acc, [key, list]) => {
    acc[key as VaccineType] = [...(list ?? [])].map((entry) => ({ ...(entry ?? {}) }));
    return acc;
  }, {} as NonNullable<VetHealthInfo["vaccines"]>);

  return {
    vaccines: cloneVaccines,
    optionalVaccines: [...(base.optionalVaccines ?? [])].map((entry) => ({ ...(entry ?? {}) })),
    deworming: [...(base.deworming ?? [])].map((entry) => ({ ...(entry ?? {}) })),
    ectoparasites: [...(base.ectoparasites ?? [])].map((entry) => ({ ...(entry ?? {}) })),
    allergyEntries: [...(base.allergyEntries ?? [])].map((entry) => ({ ...(entry ?? {}) })),
    contraindicationNotes: base.contraindicationNotes,
    healthNotes: base.healthNotes,
  };
}
