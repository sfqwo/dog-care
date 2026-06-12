import { useCallback, useMemo } from "react";
import type {
  AllergyEntry,
  HealthNoteField,
  TreatmentEntry,
  TreatmentType,
  VaccineEntry,
  VaccineType,
  VetRecord,
} from "@dog-care/domain";
import { useCareRecordsContext } from "@/src/hooks/careRecordsContext";
import type { UseVetStorageResult } from "./types";

export function useVetStorage(selectedPetId?: string | null): UseVetStorageResult {
  const {
    getVetRecords,
    getVetHealth,
    addVetRecord,
    removeVetRecord,
    setVaccineEntries: setVaccineEntriesInStore,
    setOptionalVaccines: setOptionalVaccinesInStore,
    setTreatmentEntries: setTreatmentEntriesInStore,
    setAllergyEntries: setAllergyEntriesInStore,
    setHealthNoteField: setHealthNoteFieldInStore,
  } = useCareRecordsContext();

  const records = getVetRecords(selectedPetId);
  const healthInfo = getVetHealth(selectedPetId);

  const addRecord = useCallback(
    (record: VetRecord) => {
      if (!selectedPetId) return;
      addVetRecord(selectedPetId, record);
    },
    [addVetRecord, selectedPetId]
  );

  const removeRecord = useCallback(
    (id: string) => {
      if (!selectedPetId) return;
      removeVetRecord(selectedPetId, id);
    },
    [removeVetRecord, selectedPetId]
  );

  const setVaccineEntries = useCallback(
    (type: VaccineType, entries: VaccineEntry[]) => {
      if (!selectedPetId) return;
      setVaccineEntriesInStore(selectedPetId, type, entries);
    },
    [selectedPetId, setVaccineEntriesInStore]
  );

  const setOptionalVaccines = useCallback(
    (next: VaccineEntry[]) => {
      if (!selectedPetId) return;
      setOptionalVaccinesInStore(selectedPetId, next);
    },
    [selectedPetId, setOptionalVaccinesInStore]
  );

  const setTreatmentEntries = useCallback(
    (type: TreatmentType, next: TreatmentEntry[]) => {
      if (!selectedPetId) return;
      setTreatmentEntriesInStore(selectedPetId, type, next);
    },
    [selectedPetId, setTreatmentEntriesInStore]
  );

  const setAllergyEntries = useCallback(
    (next: AllergyEntry[]) => {
      if (!selectedPetId) return;
      setAllergyEntriesInStore(selectedPetId, next);
    },
    [selectedPetId, setAllergyEntriesInStore]
  );

  const setHealthNoteField = useCallback(
    (field: HealthNoteField, value: string) => {
      if (!selectedPetId) return;
      setHealthNoteFieldInStore(selectedPetId, field, value);
    },
    [selectedPetId, setHealthNoteFieldInStore]
  );

  return useMemo(
    () => ({
      records,
      healthInfo,
      addRecord,
      removeRecord,
      setVaccineEntries,
      setOptionalVaccines,
      setTreatmentEntries,
      setAllergyEntries,
      setHealthNoteField,
    }),
    [
      addRecord,
      healthInfo,
      records,
      removeRecord,
      setAllergyEntries,
      setHealthNoteField,
      setOptionalVaccines,
      setTreatmentEntries,
      setVaccineEntries,
    ]
  );
}
