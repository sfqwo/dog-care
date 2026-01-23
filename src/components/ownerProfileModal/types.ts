export type OwnerProfileFields = "ownerName" | "email" | "phone" | "birthdate" | "city";

export type OwnerProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};
