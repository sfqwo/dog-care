import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Controller, useForm } from "react-hook-form";

import { GENDER_OPTIONS, SPECIES_OPTIONS } from "@dog-care/core/shared";
import {
  type ParsedSelectOption,
  Select,
  SelectHeader,
  SelectOption,
  SelectOptionTitle,
} from "@dog-care/select";
import type { Pet, PetProfilePayload } from "@dog-care/types";
import { useProfileContext, useDogBreeds } from "@/src/hooks";
import { DateInput, Input } from "@/packages/ui/input";

import {
  Modal,
  ModalActionButton,
  ModalActions,
  ModalSubtitle,
  ModalTitle,
} from "../modal";
import type { PetProfileFormState, PetProfileModalProps } from "./types";
import { GenderToggle, type GenderToggleOption } from "../genderToggle";
import { petProfileModalStyles } from "./styles";

const GENDER_ICON_MAP: Record<string, GenderToggleOption["icon"]> = {
  female: "gender-female",
  male: "gender-male",
};

const genderToggleOptions: GenderToggleOption[] = GENDER_OPTIONS.map((option) => ({
  ...option,
  icon: GENDER_ICON_MAP[option.value] ?? "account",
}));

export function PetProfileModal({ visible, onClose }: PetProfileModalProps) {
  const { addPet, updatePet, editingPet } = useProfileContext();
  const [breedQuery, setBreedQuery] = useState("");
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<PetProfileFormState>({
    mode: "onChange",
    defaultValues: buildPetFormDefaults(),
  });
  const selectedSpecies = watch("species") || SPECIES_OPTIONS[0].value;
  const { breeds, loading: breedsLoading } = useDogBreeds(selectedSpecies, breedQuery);
  const isEditing = Boolean(editingPet);
  const title = isEditing ? "Редактировать питомца" : "Добавить питомца";
  const subtitle = isEditing
    ? "Обновите данные и сохраните изменения."
    : "Заполните данные нового питомца.";
  const submitLabel = isEditing ? "Сохранить" : "Добавить";
  const canSubmit = isValid && (!isEditing || Boolean(editingPet));

  useEffect(() => {
    if (visible) {
      reset(buildPetFormDefaults(editingPet));
      setBreedQuery("");
    }
  }, [visible, editingPet, reset]);

  const onSubmit = (values: PetProfileFormState) => {
    const payload: PetProfilePayload = {
      name: values.name.trim(),
      breed: values.breed.trim() || undefined,
      species: values.species.trim() || undefined,
      gender: values.gender.trim() || undefined,
      birthdate: values.birthdate.trim() || undefined,
      weight: values.weight.trim() || undefined,
      notes: values.notes.trim() || undefined,
    };

    if (isEditing && editingPet) {
      updatePet({ ...payload, id: editingPet.id });
    } else {
      addPet(payload);
    }
  };

  const handleSpeciesChange = (value: string, onChange: (next: string) => void) => {
    onChange(value);
    setValue("breed", "", { shouldValidate: true, shouldDirty: true });
    setBreedQuery("");
  };

  const handleBreedChange = (
    value: string,
    option: ParsedSelectOption | undefined,
    onChange: (next: string) => void
  ) => {
    onChange(option?.title ?? value);
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <ModalTitle>{title}</ModalTitle>
      <ModalSubtitle>{subtitle}</ModalSubtitle>
      <Input
        control={control}
        name="name"
        rules={{ required: true }}
        placeholder="Кличка питомца"
      />

      <View style={petProfileModalStyles.inlineRow}>
        <View style={petProfileModalStyles.inlineFieldNarrow}>
          <Controller
            control={control}
            name="species"
            render={({ field }) => (
              <Select
                value={field.value}
                placeholder="Выберите тип животного"
                onChange={(nextValue) => handleSpeciesChange(nextValue, field.onChange)}
              >
                {SPECIES_OPTIONS.map((type) => (
                  <SelectOption key={type.title} value={type.value}>
                    <SelectOptionTitle text={type.title} />
                  </SelectOption>
                ))}
              </Select>
            )}
          />
        </View>
        <View style={petProfileModalStyles.inlineFieldWide}>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <GenderToggle
                value={field.value}
                options={genderToggleOptions}
                onChange={field.onChange}
              />
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="breed"
        render={({ field }) => (
          <Select
            value={field.value}
            placeholder="Выберите породу (опционально)"
            disabled={breedsLoading || !breeds.length || !selectedSpecies}
            onChange={(nextValue, option) => handleBreedChange(nextValue, option, field.onChange)}
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
        )}
      />
      <View style={petProfileModalStyles.inlineRow}>
        <DateInput
          control={control}
          name="birthdate"
          placeholder="Дата рождения (опционально)"
          style={petProfileModalStyles.inlineInput}
        />
        <View style={petProfileModalStyles.unitInputWrapper}>
          <Input
            control={control}
            name="weight"
            keyboardType="decimal-pad"
            placeholder="Вес"
            style={petProfileModalStyles.unitInput}
          />
          <Text style={petProfileModalStyles.weightUnit}>кг</Text>
        </View>
      </View>
      <Input
        control={control}
        name="notes"
        placeholder="Заметки"
        multiline
      />
      <ModalActions>
        <ModalActionButton closeOnPress>Отменить</ModalActionButton>
        <ModalActionButton
          closeOnPress
          onPress={handleSubmit(onSubmit)}
          disabled={!canSubmit}
        >
          {submitLabel}
        </ModalActionButton>
      </ModalActions>
    </Modal>
  );
}

function buildPetFormDefaults(pet?: Pet | null): PetProfileFormState {
  return {
    name: pet?.name ?? "",
    breed: pet?.breed ?? "",
    species: pet?.species ?? SPECIES_OPTIONS[0].value,
    gender: pet?.gender ?? "",
    birthdate: pet?.birthdate ?? "",
    weight: pet?.weight ?? "",
    notes: pet?.notes ?? "",
  };
}
