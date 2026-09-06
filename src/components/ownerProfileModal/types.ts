import type { UserProfile, UserProfilePayload } from "@dog-care/domain";

export type OwnerProfileModalProps = {
  visible: boolean;
  profile: UserProfile;
  onUpdateOwner: (profile: UserProfilePayload) => void;
  onClose: () => void;
};

export type OwnerFormValues = {
  ownerName: string;
  email: string;
  birthdate: string;
  phone: string;
};
