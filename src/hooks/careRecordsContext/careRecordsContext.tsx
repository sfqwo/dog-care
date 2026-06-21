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
  MedicationCourse,
  MedicalDocument,
  Reminder,
  TreatmentEntry,
  TreatmentType,
  VaccineEntry,
  VaccineType,
  VetHealthInfo,
  VetRecord,
  Walk,
  WellnessEntry,
  WeightEntry,
} from "@dog-care/domain";
import { EMPTY_HEALTH } from "@/app/(tabs)/(vet)/vet.constants";
import { getCompletedSourceId } from "@dog-care/domain";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { completeReminderInList, removeReminderFromList } from "@/src/services/reminderActions";
import type {
  CareRecordsContextValue,
  CompletedTasksByPet,
  FeedingsByPet,
  MedicationCoursesByPet,
  MedicalDocumentsByPet,
  RemindersByPet,
  VetHealthByPet,
  WellnessEntriesByPet,
  WeightEntriesByPet,
  VetRecordsByPet,
  WalksByPet,
} from "./types";

const CareRecordsContext = createContext<CareRecordsContextValue | undefined>(undefined);

export function CareRecordsProvider({ children }: { children: ReactNode }) {
  const [feedingsByPet, setFeedingsByPet] = useState<FeedingsByPet>({});
  const [walksByPet, setWalksByPet] = useState<WalksByPet>({});
  const [vetRecordsByPet, setVetRecordsByPet] = useState<VetRecordsByPet>({});
  const [weightEntriesByPet, setWeightEntriesByPet] = useState<WeightEntriesByPet>({});
  const [medicationCoursesByPet, setMedicationCoursesByPet] = useState<MedicationCoursesByPet>({});
  const [wellnessEntriesByPet, setWellnessEntriesByPet] = useState<WellnessEntriesByPet>({});
  const [medicalDocumentsByPet, setMedicalDocumentsByPet] = useState<MedicalDocumentsByPet>({});
  const [remindersByPet, setRemindersByPet] = useState<RemindersByPet>({});
  const [vetHealthByPet, setVetHealthByPet] = useState<VetHealthByPet>({});
  const [completedTasksByPet, setCompletedTasksByPet] = useState<CompletedTasksByPet>({});
  const [storageLoaded, setStorageLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      loadJSON<FeedingsByPet>(STORAGE_KEYS.FEEDING, {}),
      loadJSON<WalksByPet>(STORAGE_KEYS.WALKS, {}),
      loadJSON<VetRecordsByPet>(STORAGE_KEYS.VET, {}),
      loadJSON<WeightEntriesByPet>(STORAGE_KEYS.WEIGHT, {}),
      loadJSON<MedicationCoursesByPet>(STORAGE_KEYS.MEDICATIONS, {}),
      loadJSON<WellnessEntriesByPet>(STORAGE_KEYS.WELLNESS, {}),
      loadJSON<MedicalDocumentsByPet>(STORAGE_KEYS.MEDICAL_DOCUMENTS, {}),
      loadJSON<RemindersByPet>(STORAGE_KEYS.REMINDERS, {}),
      loadJSON<VetHealthByPet>(STORAGE_KEYS.VET_HEALTH, {}),
      loadJSON<CompletedTasksByPet>(STORAGE_KEYS.COMPLETED_TASKS, {}),
    ]).then(([storedFeedings, storedWalks, storedVetRecords, storedWeightEntries, storedMedicationCourses, storedWellnessEntries, storedMedicalDocuments, storedReminders, storedVetHealth, storedCompleted]) => {
      if (!isMounted) return;
      setFeedingsByPet(storedFeedings ?? {});
      setWalksByPet(storedWalks ?? {});
      setVetRecordsByPet(storedVetRecords ?? {});
      setWeightEntriesByPet(storedWeightEntries ?? {});
      setMedicationCoursesByPet(storedMedicationCourses ?? {});
      setWellnessEntriesByPet(storedWellnessEntries ?? {});
      setMedicalDocumentsByPet(storedMedicalDocuments ?? {});
      setRemindersByPet(storedReminders ?? {});
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
    saveJSON(STORAGE_KEYS.WEIGHT, weightEntriesByPet);
  }, [storageLoaded, weightEntriesByPet]);

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.MEDICATIONS, medicationCoursesByPet);
  }, [medicationCoursesByPet, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.WELLNESS, wellnessEntriesByPet);
  }, [storageLoaded, wellnessEntriesByPet]);

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.MEDICAL_DOCUMENTS, medicalDocumentsByPet);
  }, [medicalDocumentsByPet, storageLoaded]);

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.REMINDERS, remindersByPet);
  }, [remindersByPet, storageLoaded]);

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
  const getWeightEntries = useCallback(
    (petId?: string | null) => (petId ? weightEntriesByPet[petId] ?? [] : []),
    [weightEntriesByPet]
  );
  const getMedicationCourses = useCallback(
    (petId?: string | null) => (petId ? medicationCoursesByPet[petId] ?? [] : []),
    [medicationCoursesByPet]
  );
  const getWellnessEntries = useCallback(
    (petId?: string | null) => (petId ? wellnessEntriesByPet[petId] ?? [] : []),
    [wellnessEntriesByPet]
  );
  const getMedicalDocuments = useCallback(
    (petId?: string | null) => (petId ? medicalDocumentsByPet[petId] ?? [] : []),
    [medicalDocumentsByPet]
  );
  const getReminders = useCallback(
    (petId?: string | null) => (petId ? remindersByPet[petId] ?? [] : []),
    [remindersByPet]
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
    setMedicalDocumentsByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).map((document) =>
        document.visitId === id ? { ...document, visitId: undefined } : document
      ),
    }));
  }, []);

  const addWeightEntry = useCallback((petId: string, entry: WeightEntry) => {
    setWeightEntriesByPet((prev) => ({ ...prev, [petId]: [entry, ...(prev[petId] ?? [])] }));
  }, []);

  const updateWeightEntry = useCallback((petId: string, entry: WeightEntry) => {
    setWeightEntriesByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).map((item) => (item.id === entry.id ? entry : item)),
    }));
  }, []);

  const removeWeightEntry = useCallback((petId: string, id: string) => {
    setWeightEntriesByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).filter((entry) => entry.id !== id),
    }));
  }, []);

  const addMedicationCourse = useCallback((petId: string, course: MedicationCourse) => {
    setMedicationCoursesByPet((prev) => ({
      ...prev,
      [petId]: [course, ...(prev[petId] ?? [])],
    }));
  }, []);

  const updateMedicationCourse = useCallback((petId: string, course: MedicationCourse) => {
    setMedicationCoursesByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).map((item) => (item.id === course.id ? course : item)),
    }));
  }, []);

  const removeMedicationCourse = useCallback((petId: string, id: string) => {
    setMedicationCoursesByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).filter((course) => course.id !== id),
    }));
  }, []);

  const addWellnessEntry = useCallback((petId: string, entry: WellnessEntry) => {
    setWellnessEntriesByPet((prev) => ({
      ...prev,
      [petId]: [entry, ...(prev[petId] ?? [])],
    }));
  }, []);

  const updateWellnessEntry = useCallback((petId: string, entry: WellnessEntry) => {
    setWellnessEntriesByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).map((item) => (item.id === entry.id ? entry : item)),
    }));
  }, []);

  const removeWellnessEntry = useCallback((petId: string, id: string) => {
    setWellnessEntriesByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).filter((entry) => entry.id !== id),
    }));
  }, []);

  const addMedicalDocument = useCallback((petId: string, document: MedicalDocument) => {
    setMedicalDocumentsByPet((prev) => ({
      ...prev,
      [petId]: [document, ...(prev[petId] ?? [])],
    }));
  }, []);

  const updateMedicalDocument = useCallback((petId: string, document: MedicalDocument) => {
    setMedicalDocumentsByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).map((item) =>
        item.id === document.id ? document : item
      ),
    }));
  }, []);

  const removeMedicalDocument = useCallback((petId: string, id: string) => {
    setMedicalDocumentsByPet((prev) => ({
      ...prev,
      [petId]: (prev[petId] ?? []).filter((document) => document.id !== id),
    }));
  }, []);

  const addReminder = useCallback((petId: string, reminder: Reminder) => {
    setRemindersByPet((prev) => ({
      ...prev,
      [petId]: [reminder, ...(prev[petId] ?? []).filter((item) => item.id !== reminder.id)],
    }));
  }, []);

  const removeReminder = useCallback(async (petId: string, id: string) => {
    const current = remindersByPet[petId] ?? [];
    const next = await removeReminderFromList(current, id);
    setRemindersByPet((prev) => ({ ...prev, [petId]: next }));
  }, [remindersByPet]);

  const completeReminder = useCallback(async (
    petId: string,
    id: string,
    options: { onCompletedTask?: (petId: string, task: CompletedCareTask) => void } = {}
  ) => {
    const current = remindersByPet[petId] ?? [];
    const next = await completeReminderInList(current, id, options);
    setRemindersByPet((prev) => ({ ...prev, [petId]: next }));
  }, [remindersByPet]);

  const reloadReminders = useCallback(async () => {
    const stored = await loadJSON<RemindersByPet>(STORAGE_KEYS.REMINDERS, {});
    setRemindersByPet(stored ?? {});
  }, []);

  const reloadCompletedTasks = useCallback(async () => {
    const stored = await loadJSON<CompletedTasksByPet>(STORAGE_KEYS.COMPLETED_TASKS, {});
    setCompletedTasksByPet(stored ?? {});
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
      isCareRecordsLoaded: storageLoaded,
      feedingsByPet,
      walksByPet,
      vetRecordsByPet,
      weightEntriesByPet,
      medicationCoursesByPet,
      wellnessEntriesByPet,
      medicalDocumentsByPet,
      remindersByPet,
      vetHealthByPet,
      completedTasksByPet,
      getFeedings,
      getWalks,
      getVetRecords,
      getWeightEntries,
      getMedicationCourses,
      getWellnessEntries,
      getMedicalDocuments,
      getReminders,
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
      addWeightEntry,
      updateWeightEntry,
      removeWeightEntry,
      addMedicationCourse,
      updateMedicationCourse,
      removeMedicationCourse,
      addWellnessEntry,
      updateWellnessEntry,
      removeWellnessEntry,
      addMedicalDocument,
      updateMedicalDocument,
      removeMedicalDocument,
      addReminder,
      removeReminder,
      completeReminder,
      reloadReminders,
      reloadCompletedTasks,
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
      addWeightEntry,
      addMedicationCourse,
      addWellnessEntry,
      addMedicalDocument,
      addReminder,
      completeReminder,
      completedTasksByPet,
      feedingsByPet,
      getCompletedTasks,
      getFeedings,
      getVetHealth,
      getVetRecords,
      getWeightEntries,
      getMedicationCourses,
      getWellnessEntries,
      getMedicalDocuments,
      getReminders,
      getWalks,
      removeCompletedTask,
      removeFeeding,
      removeVetRecord,
      removeWeightEntry,
      removeMedicationCourse,
      removeWellnessEntry,
      removeMedicalDocument,
      removeReminder,
      removeWalk,
      setAllergyEntries,
      setHealthNoteField,
      setOptionalVaccines,
      setTreatmentEntries,
      setVaccineEntries,
      storageLoaded,
      updateFeeding,
      updateWeightEntry,
      updateMedicationCourse,
      updateWellnessEntry,
      updateMedicalDocument,
      updateWalk,
      vetHealthByPet,
      vetRecordsByPet,
      weightEntriesByPet,
      medicationCoursesByPet,
      wellnessEntriesByPet,
      medicalDocumentsByPet,
      remindersByPet,
      reloadReminders,
      reloadCompletedTasks,
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
