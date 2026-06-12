import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  AllergyEntry,
  CompletedCareTask,
  Feeding,
  HealthNoteField,
  TreatmentEntry,
  TreatmentType,
  VaccineEntry,
  VaccineType,
  VetHealthInfo,
  VetRecord,
  Walk,
} from "@dog-care/types";
import { EMPTY_HEALTH } from "@/app/(tabs)/(vet)/vet.constants";
import { getCompletedSourceId } from "@dog-care/core/utils";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import type {
  CareRecordsContextValue,
  CompletedTasksByPet,
  FeedingsByPet,
  VetHealthByPet,
  VetRecordsByPet,
  WalksByPet,
} from "./types";

const CareRecordsContext = createContext<CareRecordsContextValue | undefined>(undefined);

export function CareRecordsProvider({ children }: { children: ReactNode }) {
  const [feedingsByPet, setFeedingsByPet] = useState<FeedingsByPet>({});
  const [walksByPet, setWalksByPet] = useState<WalksByPet>({});
  const [vetRecordsByPet, setVetRecordsByPet] = useState<VetRecordsByPet>({});
  const [vetHealthByPet, setVetHealthByPet] = useState<VetHealthByPet>({});
  const [completedTasksByPet, setCompletedTasksByPet] = useState<CompletedTasksByPet>({});
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      loadJSON<FeedingsByPet>(STORAGE_KEYS.FEEDING, {}),
      loadJSON<WalksByPet>(STORAGE_KEYS.WALKS, {}),
      loadJSON<VetRecordsByPet>(STORAGE_KEYS.VET, {}),
      loadJSON<VetHealthByPet>(STORAGE_KEYS.VET_HEALTH, {}),
      loadJSON<CompletedTasksByPet>(STORAGE_KEYS.COMPLETED_TASKS, {}),
    ]).then(([storedFeedings, storedWalks, storedVetRecords, storedVetHealth, storedCompleted]) => {
      if (!isMounted) return;
      setFeedingsByPet(storedFeedings ?? {});
      setWalksByPet(storedWalks ?? {});
      setVetRecordsByPet(storedVetRecords ?? {});
      setVetHealthByPet(storedVetHealth ?? {});
      setCompletedTasksByPet(storedCompleted ?? {});
      setStorageLoaded(true);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.FEEDING, feedingsByPet);
  }, [feedingsByPet, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.WALKS, walksByPet);
  }, [storageLoaded, walksByPet]);

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.VET, vetRecordsByPet);
  }, [storageLoaded, vetRecordsByPet]);

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.VET_HEALTH, vetHealthByPet);
  }, [storageLoaded, vetHealthByPet]);

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.COMPLETED_TASKS, completedTasksByPet);
  }, [completedTasksByPet, storageLoaded]);

  const getFeedings = useCallback(
    (petId?: string | null) => (petId ? feedingsByPet[petId] ?? [] : []),
    [feedingsByPet]
  );
  const getWalks = useCallback(
    (petId?: string | null) => (petId ? walksByPet[petId] ?? [] : []),
    [walksByPet]
  );
  const getVetRecords = useCallback(
    (petId?: string | null) => (petId ? vetRecordsByPet[petId] ?? [] : []),
    [vetRecordsByPet]
  );
  const getVetHealth = useCallback(
    (petId?: string | null) => (petId && vetHealthByPet[petId]) || EMPTY_HEALTH,
    [vetHealthByPet]
  );
  const getCompletedTasks = useCallback(
    (petId?: string | null) => (petId ? completedTasksByPet[petId] ?? [] : []),
    [completedTasksByPet]
  );

  const addFeeding = useCallback((petId: string, feeding: Feeding) => {
    setFeedingsByPet((prev) => ({ ...prev, [petId]: [feeding, ...(prev[petId] ?? [])] }));
  }, []);

  const updateFeeding = useCallback((petId: string, feeding: Feeding) => {
    setFeedingsByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).map((item) => (item.id === feeding.id ? feeding : item)),
    }));
  }, []);

  const removeFeeding = useCallback((petId: string, id: string) => {
    setFeedingsByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).filter((item) => item.id !== id),
    }));
  }, []);

  const addWalk = useCallback((petId: string, walk: Walk) => {
    setWalksByPet((prev) => ({ ...prev, [petId]: [walk, ...(prev[petId] ?? [])] }));
  }, []);

  const updateWalk = useCallback((petId: string, walk: Walk) => {
    setWalksByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).map((item) => (item.id === walk.id ? walk : item)),
    }));
  }, []);

  const removeWalk = useCallback((petId: string, id: string) => {
    setWalksByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).filter((item) => item.id !== id),
    }));
  }, []);

  const addVetRecord = useCallback((petId: string, record: VetRecord) => {
    setVetRecordsByPet((prev) => ({ ...prev, [petId]: [record, ...(prev[petId] ?? [])] }));
  }, []);

  const removeVetRecord = useCallback((petId: string, id: string) => {
    setVetRecordsByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).filter((record) => record.id !== id),
    }));
    setCompletedTasksByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).filter(
        (task) => task.source !== "vet" || getCompletedSourceId(task) !== id
      ),
    }));
  }, []);

  const addCompletedTask = useCallback((petId: string, task: CompletedCareTask) => {
    setCompletedTasksByPet((prev) => ({
      ...prev,
      [petId]: [task, ...(prev[petId] ?? []).filter((item) => item.id !== task.id)],
    }));
  }, []);

  const removeCompletedTask = useCallback((petId: string, id: string) => {
    setCompletedTasksByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).filter((task) => task.id !== id),
    }));
  }, []);

  const updateHealth = useCallback(
    (petId: string, updater: (current: VetHealthInfo) => VetHealthInfo) => {
      setVetHealthByPet((prev) => {
        const current = cloneHealth(prev[petId]);
        return { ...prev, [petId]: updater(current) };
      });
    },
    []
  );

  const setVaccineEntries = useCallback(
    (petId: string, type: VaccineType, entries: VaccineEntry[]) => {
      updateHealth(petId, (current) => {
        const vaccines = { ...(current.vaccines ?? {}) };
        vaccines[type] = entries;
        return { ...current, vaccines };
      });
    },
    [updateHealth]
  );

  const setOptionalVaccines = useCallback(
    (petId: string, next: VaccineEntry[]) => {
      updateHealth(petId, (current) => ({ ...current, optionalVaccines: next }));
    },
    [updateHealth]
  );

  const setTreatmentEntries = useCallback(
    (petId: string, type: TreatmentType, next: TreatmentEntry[]) => {
      updateHealth(petId, (current) => ({ ...current, [type]: next }));
    },
    [updateHealth]
  );

  const setAllergyEntries = useCallback(
    (petId: string, next: AllergyEntry[]) => {
      updateHealth(petId, (current) => ({ ...current, allergyEntries: next }));
    },
    [updateHealth]
  );

  const setHealthNoteField = useCallback(
    (petId: string, field: HealthNoteField, value: string) => {
      updateHealth(petId, (current) => ({ ...current, [field]: value }));
    },
    [updateHealth]
  );

  const value = useMemo<CareRecordsContextValue>(
    () => ({
      feedingsByPet,
      walksByPet,
      vetRecordsByPet,
      vetHealthByPet,
      completedTasksByPet,
      getFeedings,
      getWalks,
      getVetRecords,
      getVetHealth,
      getCompletedTasks,
      addFeeding,
      updateFeeding,
      removeFeeding,
      addWalk,
      updateWalk,
      removeWalk,
      addVetRecord,
      removeVetRecord,
      addCompletedTask,
      removeCompletedTask,
      setVaccineEntries,
      setOptionalVaccines,
      setTreatmentEntries,
      setAllergyEntries,
      setHealthNoteField,
    }),
    [
      addCompletedTask,
      addFeeding,
      addVetRecord,
      addWalk,
      completedTasksByPet,
      feedingsByPet,
      getCompletedTasks,
      getFeedings,
      getVetHealth,
      getVetRecords,
      getWalks,
      removeCompletedTask,
      removeFeeding,
      removeVetRecord,
      removeWalk,
      setAllergyEntries,
      setHealthNoteField,
      setOptionalVaccines,
      setTreatmentEntries,
      setVaccineEntries,
      updateFeeding,
      updateWalk,
      vetHealthByPet,
      vetRecordsByPet,
      walksByPet,
    ]
  );

  return <CareRecordsContext.Provider value={value}>{children}</CareRecordsContext.Provider>;
}

export function useCareRecordsContext() {
  const context = useContext(CareRecordsContext);
  if (!context) {
    throw new Error("useCareRecordsContext must be used within a CareRecordsProvider.");
  }
  return context;
}

function cloneHealth(info?: VetHealthInfo): VetHealthInfo {
  return {
    ...EMPTY_HEALTH,
    ...(info ?? {}),
    vaccines: { ...(info?.vaccines ?? EMPTY_HEALTH.vaccines) },
    optionalVaccines: [...(info?.optionalVaccines ?? EMPTY_HEALTH.optionalVaccines ?? [])],
    deworming: [...(info?.deworming ?? EMPTY_HEALTH.deworming ?? [])],
    ectoparasites: [...(info?.ectoparasites ?? EMPTY_HEALTH.ectoparasites ?? [])],
    allergyEntries: [...(info?.allergyEntries ?? EMPTY_HEALTH.allergyEntries ?? [])],
  };
}
