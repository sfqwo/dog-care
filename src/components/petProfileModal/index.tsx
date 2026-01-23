import { useEffect, useMemo, useState } from "react";

import { GENDER_OPTIONS, SPECIES_OPTIONS, WEIGHT_OPTIONS } from "@dog-care/core/shared";
import type { PetProfilePayload } from "@/src/domain/types";
import { useProfileContext } from "@/src/hooks/profileContext";
import { Input } from "@/packages/ui/input/src";
import {
  Select,
  SelectHeader,
  SelectOption,
  SelectOptionTitle,
} from "@/packages/ui/select";
import type { ParsedSelectOption } from "@/packages/ui/select";
import { useDogBreeds } from "@/src/hooks/useDogBreeds";
import { Modal, ModalActionButton, ModalActions, ModalSubtitle, ModalTitle } from "../modal";
import type { PetProfileFormState, PetProfileModalProps } from "./types";

const emptyForm: PetProfileFormState = {
  name: "",
  breed: "",
  species: "",
  gender: "",
  birthdate: "",
  weight: "",
  notes: "",
};

export function PetProfileModal({ visible, onClose }: PetProfileModalProps) {
  const { addPet, updatePet, editingPet } = useProfileContext();
  const [form, setForm] = useState<PetProfileFormState>(emptyForm);
  const [breedQuery, setBreedQuery] = useState("");
  const selectedSpecies = form.species || SPECIES_OPTIONS[0].value;
  const { breeds, loading: breedsLoading } = useDogBreeds(selectedSpecies, breedQuery);
  const isEditing = Boolean(editingPet);
  const title = isEditing ? "Редактировать питомца" : "Добавить питомца";
  const subtitle = isEditing
    ? "Обновите данные и сохраните изменения."
    : "Заполните данные нового питомца.";
  const submitLabel = isEditing ? "Сохранить" : "Добавить";

  useEffect(() => {
    if (visible) {
      if (editingPet) {
        setForm({
          name: editingPet.name,
          breed: editingPet.breed ?? "",
          species: editingPet.species ?? SPECIES_OPTIONS[0].value,
          gender: editingPet.gender ?? "",
          birthdate: editingPet.birthdate ?? "",
          weight: editingPet.weight ?? "",
          notes: editingPet.notes ?? "",
        });
      } else {
        setForm({
          ...emptyForm,
          species: SPECIES_OPTIONS[0].value,
        });
      }
      setBreedQuery("");
    } else {
      setForm(emptyForm);
      setBreedQuery("");
    }
  }, [visible, editingPet]);

  const canSubmit = useMemo(() => {
    if (!form.name.trim()) return false;
    if (isEditing && !editingPet) return false;
    return true;
  }, [form.name, isEditing, editingPet]);

  const handleChange = (field: keyof PetProfileFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const changeHandler = (field: keyof PetProfileFormState) => (value: string) =>
    handleChange(field, value);

  const handleSubmit = () => {
    if (!canSubmit) return;
    const payload: PetProfilePayload = {
      name: form.name.trim(),
      breed: form.breed.trim() || undefined,
      species: form.species.trim() || undefined,
      gender: form.gender.trim() || undefined,
      birthdate: form.birthdate.trim() || undefined,
      weight: form.weight.trim() || undefined,
      notes: form.notes.trim() || undefined,
    };

    if (isEditing && editingPet) {
      updatePet({ ...payload, id: editingPet.id });
    } else {
      addPet(payload);
    }
  };

  const handleBreedChange = (value: string, option?: ParsedSelectOption) => {
    const label = option?.title ?? value;
    setForm((prev) => ({ ...prev, breed: label }));
  };
  const handleSpeciesChange = (value: string) => {
    setForm((prev) => (
      prev.species !== value ? { ...prev, species: value, breed: "" } : prev
    ));
    setBreedQuery("");
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <ModalTitle>{title}</ModalTitle>
      <ModalSubtitle>{subtitle}</ModalSubtitle>
      <Input value={form.name} onChangeText={changeHandler("name")} placeholder="Кличка питомца" />
      <Select
        value={form.species}
        placeholder="Выберите тип животного"
        onChange={(nextValue) => handleSpeciesChange(nextValue)}
      >
        {SPECIES_OPTIONS.map((type) => (
          <SelectOption key={type.title} value={type.value}>
            <SelectOptionTitle text={type.title} />
          </SelectOption>
        ))}
      </Select>

      <Select
        value={form.breed}
        placeholder="Выберите породу (опционально)"
        disabled={breedsLoading || !breeds.length || !form.species}
        onChange={(nextValue, option) => handleBreedChange(nextValue, option)}
      >
        <SelectHeader>
          <Input
            value={breedQuery}
            onChangeText={setBreedQuery}
            placeholder="Поиск породы"
          />
        </SelectHeader>
        {breeds.map((breed) => (
          <SelectOption key={breed.value} value={breed.title}>
            <SelectOptionTitle text={breed.title} />
          </SelectOption>
        ))}
      </Select>
      <Select
        value={form.gender}
        placeholder="Выберите пол"
        onChange={(value) => setForm((prev) => ({ ...prev, gender: value }))}
      >
        {GENDER_OPTIONS.map((gender) => (
          <SelectOption key={gender.value} value={gender.value}>
            <SelectOptionTitle text={gender.title} />
          </SelectOption>
        ))}
      </Select>
      <Input
        type="date"
        value={form.birthdate}
        onChangeText={changeHandler("birthdate")}
        placeholder="Дата рождения (опционально)"
      />
      <Select
        value={form.weight}
        placeholder="Вес (кг)"
        onChange={(value) => setForm((prev) => ({ ...prev, weight: value }))}
      >
        {WEIGHT_OPTIONS.map((option) => (
          <SelectOption key={option.value} value={option.value}>
            <SelectOptionTitle text={option.title} />
          </SelectOption>
        ))}
      </Select>
      <Input
        value={form.notes}
        onChangeText={changeHandler("notes")}
        placeholder="Заметки"
        multiline
      />
      <ModalActions>
        <ModalActionButton closeOnPress>Отменить</ModalActionButton>
        <ModalActionButton closeOnPress onPress={handleSubmit} disabled={!canSubmit}>
          {submitLabel}
        </ModalActionButton>
      </ModalActions>
    </Modal>
  );
}
