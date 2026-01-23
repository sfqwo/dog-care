import { useEffect, useMemo, useState } from "react";
import type { UserProfile, UserProfilePayload } from "@/src/domain/types";
import { Input } from "../input";
import { Modal, ModalActionButton, ModalActions, ModalSubtitle, ModalTitle } from "../modal";
import { useProfileContext } from "@/src/hooks/profileContext";

type OwnerProfileFields = "ownerName" | "email" | "phone" | "city";

type OwnerProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function OwnerProfileModal({
  visible,
  onClose,
}: OwnerProfileModalProps) {
  const { profile, updateOwner } = useProfileContext();
  const [form, setForm] = useState<UserProfile>(profile);

  useEffect(() => {
    if (visible) {
      setForm(profile);
    }
  }, [visible, profile]);

  const canSubmit = useMemo(() => form.ownerName.trim().length > 0, [form.ownerName]);

  const changeHandler = (field: OwnerProfileFields) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!canSubmit) return;
    const payload: UserProfilePayload = {
      ownerName: form.ownerName.trim(),
      email: form.email?.trim(),
      phone: form.phone?.trim(),
      city: form.city?.trim(),
    };
    updateOwner(payload)
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <ModalTitle>Редактировать профиль</ModalTitle>
      <ModalSubtitle>Обновите данные владельца.</ModalSubtitle>
      <Input value={form.ownerName} onChangeText={changeHandler("ownerName")} placeholder="Имя владельца" />
      <Input
        value={form.email ?? ""}
        onChangeText={changeHandler("email")}
        placeholder="Email"
        keyboardType="email-address"
      />
      <Input
        value={form.phone ?? ""}
        onChangeText={changeHandler("phone")}
        placeholder="Телефон"
        keyboardType="phone-pad"
      />
      <Input
        value={form.city ?? ""}
        onChangeText={changeHandler("city")}
        placeholder="Город / район"
      />
      <ModalActions>
        <ModalActionButton closeOnPress>Отменить</ModalActionButton>
        <ModalActionButton closeOnPress onPress={handleSubmit} disabled={!canSubmit}>
          Сохранить
        </ModalActionButton>
      </ModalActions>
    </Modal>
  );
}
