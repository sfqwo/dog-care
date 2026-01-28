import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { UserProfile, UserProfilePayload } from "@dog-care/types";
import { useProfileContext } from "@/src/hooks/profileContext";
import {
  DateInput,
  EmailInput,
  Input,
  PhoneInput,
  isDateValueValid,
  isEmailValueValid,
  isPhoneValueValid,
} from "@/packages/ui/input";
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
      <Controller
        control={control}
        name="ownerName"
        rules={{ required: true }}
        render={({ field }) => (
          <Input
            value={field.value}
            onChangeText={field.onChange}
            placeholder="Имя владельца"
          />
        )}
      />
      <Controller
        control={control}
        name="email"
        rules={{ validate: isEmailValueValid }}
        render={({ field }) => (
          <EmailInput value={field.value} onChangeText={field.onChange} placeholder="Email" />
        )}
      />
      <Controller
        control={control}
        name="birthdate"
        rules={{ validate: isDateValueValid }}
        render={({ field }) => (
          <DateInput value={field.value} onChangeText={field.onChange} placeholder="Дата рождения" />
        )}
      />
      <Controller
        control={control}
        name="phone"
        rules={{ validate: isPhoneValueValid }}
        render={({ field }) => (
          <PhoneInput value={field.value} onChangeText={field.onChange} placeholder="Телефон" />
        )}
      />
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
