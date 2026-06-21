import { Alert } from "react-native";
import { useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";

import { MedicalDocument } from "@/packages/domain";
import {
  createUid,
  formatCurrentDateInput,
  formatDateInputFromTimestamp,
  parseDateInputTimestamp,
} from "@dog-care/core/utils";
import {
  deleteMedicalDocumentImages,
  persistMedicalDocumentImages,
} from "@/src/services/medicalDocumentFiles";
import type { MedicalDocumentForm, UseMedicalDocumentEditorOptions } from "./types";


const createInitialForm = (): MedicalDocumentForm => ({
  type: "analysis",
  date: formatCurrentDateInput(),
  title: "",
  note: "",
  visitId: "",
  imageUris: [],
});

export function useMedicalDocumentEditor({
  selectedPetId,
  addDocument,
  updateDocument,
  removeDocument,
}: UseMedicalDocumentEditorOptions) {
  const [form, setForm] = useState<MedicalDocumentForm>(createInitialForm);
  const [editingDocument, setEditingDocument] = useState<MedicalDocument | null>(null);
  const [editForm, setEditForm] = useState<MedicalDocumentForm>(createInitialForm);
  const [isSaving, setIsSaving] = useState(false);
  const at = useMemo(() => parseDateInputTimestamp(form.date), [form.date]);
  const editAt = useMemo(() => parseDateInputTimestamp(editForm.date), [editForm.date]);
  const canSubmit = Boolean(selectedPetId && at && form.imageUris.length && !isSaving);
  const canSaveEdit = Boolean(editingDocument && editAt && editForm.imageUris.length && !isSaving);

  const updateForm = <K extends keyof MedicalDocumentForm>(
    field: K,
    value: MedicalDocumentForm[K]
  ) => setForm((current) => ({ ...current, [field]: value }));

  const updateEditForm = <K extends keyof MedicalDocumentForm>(
    field: K,
    value: MedicalDocumentForm[K]
  ) => setEditForm((current) => ({ ...current, [field]: value }));

  const pickImages = async (editing = false) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Нет доступа к фотографиям", "Разрешите доступ в настройках телефона.");
      return;
    }

    const current = editing ? editForm.imageUris : form.imageUris;
    const remaining = Math.max(0, 5 - current.length);
    if (!remaining) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsMultipleSelection: true,
      selectionLimit: remaining,
      quality: 0.85,
    });
    if (result.canceled) return;
    const next = [...current, ...result.assets.map((asset) => asset.uri)].slice(0, 5);
    if (editing) updateEditForm("imageUris", next);
    else updateForm("imageUris", next);
  };

  const removeImage = (uri: string, editing = false) => {
    const current = editing ? editForm.imageUris : form.imageUris;
    const next = current.filter((item) => item !== uri);
    if (editing) updateEditForm("imageUris", next);
    else updateForm("imageUris", next);
  };

  const handleSubmit = async () => {
    if (!selectedPetId || !at || !canSubmit) return;
    setIsSaving(true);
    try {
      const imageUris = persistMedicalDocumentImages(form.imageUris);
      addDocument(selectedPetId, buildDocument(createUid(), selectedPetId, at, form, imageUris));
      setForm(createInitialForm());
    } catch {
      Alert.alert("Не удалось сохранить", "Проверьте доступ к фотографиям и попробуйте снова.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (document: MedicalDocument) => {
    setEditingDocument(document);
    setEditForm({
      type: document.type,
      date: formatDateInputFromTimestamp(document.at),
      title: document.title ?? "",
      note: document.note ?? "",
      visitId: document.visitId ?? "",
      imageUris: document.imageUris,
    });
  };

  const closeEditModal = () => {
    setEditingDocument(null);
    setEditForm(createInitialForm());
  };

  const handleSaveEdit = async () => {
    if (!selectedPetId || !editingDocument || !editAt || !canSaveEdit) return;
    setIsSaving(true);
    try {
      const imageUris = persistMedicalDocumentImages(editForm.imageUris);
      updateDocument(
        selectedPetId,
        buildDocument(editingDocument.id, selectedPetId, editAt, editForm, imageUris, editingDocument.createdAt)
      );
      deleteMedicalDocumentImages(editingDocument.imageUris);
      closeEditModal();
    } catch {
      Alert.alert("Не удалось сохранить", "Проверьте доступ к фотографиям и попробуйте снова.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemove = (document: MedicalDocument) => {
    if (!selectedPetId) return;
    deleteMedicalDocumentImages(document.imageUris);
    removeDocument(selectedPetId, document.id);
    if (editingDocument?.id === document.id) closeEditModal();
  };

  return {
    form,
    editForm,
    editingDocument,
    isSaving,
    canSubmit,
    canSaveEdit,
    updateForm,
    updateEditForm,
    pickImages,
    removeImage,
    handleSubmit,
    handleEdit,
    handleSaveEdit,
    handleRemove,
    closeEditModal,
  };
}

function buildDocument(
  id: string,
  petId: string,
  at: number,
  form: MedicalDocumentForm,
  imageUris: string[],
  createdAt = Date.now()
): MedicalDocument {
  return {
    id,
    petId,
    type: form.type,
    at,
    title: form.title.trim() || undefined,
    note: form.note.trim() || undefined,
    visitId: form.visitId || undefined,
    imageUris,
    createdAt,
  };
}
