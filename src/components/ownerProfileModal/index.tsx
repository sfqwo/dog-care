import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { UserProfile, UserProfilePayload } from "@dog-care/types";
import { useProfileContext } from "@/src/hooks/profileContext";
import { DateInput, EmailInput, Input, PhoneInput } from "@/packages/ui/input";
import { Modal, ModalActionButton, ModalActions, ModalSubtitle, ModalTitle } from "../modal";
import type { OwnerProfileModalProps, OwnerFormValues } from "./types";

export function OwnerProfileModal({ visible, onClose }: OwnerProfileModalProps) {
  const { profile, updateOwner } = useProfileContext();
  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<OwnerFormValues>({
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: mapProfileToForm(profile),
  });

  useEffect(() => {
    if (visible) {
      reset(mapProfileToForm(profile));
    }
  }, [visible, profile, reset]);

  const onSubmit = (values: OwnerFormValues) => {
    const payload: UserProfilePayload = {
      ownerName: values.ownerName.trim(),
      email: values.email.trim() || undefined,
      phone: values.phone.trim() || undefined,
      birthdate: values.birthdate.trim() || undefined,
    };
    updateOwner(payload);
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <ModalTitle>Редактировать профиль</ModalTitle>
      <ModalSubtitle>Обновите данные владельца.</ModalSubtitle>
      <Input
        control={control}
        name="ownerName"
        rules={{ required: true }}
        placeholder="Имя владельца"
      />
      <EmailInput control={control} name="email" placeholder="Email" />
      <DateInput control={control} name="birthdate" placeholder="Дата рождения" />
      <PhoneInput control={control} name="phone" placeholder="Телефон" />
      <ModalActions>
        <ModalActionButton closeOnPress>Отменить</ModalActionButton>
        <ModalActionButton
          closeOnPress
          onPress={handleSubmit(onSubmit)}
          disabled={!isValid}
        >
          Сохранить
        </ModalActionButton>
      </ModalActions>
    </Modal>
  );
}

function mapProfileToForm(profile: UserProfile): OwnerFormValues {
  return {
    ownerName: profile.ownerName ?? "",
    email: profile.email ?? "",
    birthdate: profile.birthdate ?? "",
    phone: profile.phone ?? "",
  };
}
