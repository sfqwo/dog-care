import { useEffect, useMemo, useState } from "react";
import { useProfileContext } from "@/src/hooks/profileContext";
import {
  Modal,
  ModalTitle,
  ModalSubtitle,
  ModalActions,
  ModalActionButton,
} from "../modal";
import { Input } from "../input";
import { PetProfilePayload } from "@/src/domain/types";

type PetProfileFormState = {
  name: string;
  breed: string;
  species: string;
  gender: string;
  birthdate: string;
  weight: string;
  notes: string;
};

const emptyForm: PetProfileFormState = {
  name: "",
  breed: "",
  species: "",
  gender: "",
  birthdate: "",
  weight: "",
  notes: "",
};

type PetProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function PetProfileModal({ visible, onClose }: PetProfileModalProps) {
  const { addPet, updatePet, editingPet } = useProfileContext();
  const [form, setForm] = useState<PetProfileFormState>(emptyForm);
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
          species: editingPet.species ?? "",
          gender: editingPet.gender ?? "",
          birthdate: editingPet.birthdate ?? "",
          weight: editingPet.weight ?? "",
          notes: editingPet.notes ?? "",
        });
      } else {
        setForm(emptyForm);
      }
    } else {
      setForm(emptyForm);
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

  return (
    <Modal visible={visible} onClose={onClose}>
      <ModalTitle>{title}</ModalTitle>
      <ModalSubtitle>{subtitle}</ModalSubtitle>
      <Input value={form.name} onChangeText={changeHandler("name")} placeholder="Кличка питомца" />
      <Input
        value={form.breed}
        onChangeText={changeHandler("breed")}
        placeholder="Порода (опционально)"
      />
      <Input
        value={form.species}
        onChangeText={changeHandler("species")}
        placeholder="Вид (например собака)"
      />
      <Input
        value={form.gender}
        onChangeText={changeHandler("gender")}
        placeholder="Пол (например девочка)"
      />
      <Input
        value={form.birthdate}
        onChangeText={changeHandler("birthdate")}
        placeholder="Дата рождения (опционально)"
      />
      <Input
        value={form.weight}
        onChangeText={changeHandler("weight")}
        placeholder="Вес (например 12 кг)"
      />
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
