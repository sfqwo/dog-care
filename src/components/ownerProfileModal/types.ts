export type OwnerProfileFields = "ownerName" | "email" | "phone" | "birthdate";

export type OwnerProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};
