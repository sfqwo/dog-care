export type OwnerProfileFields = "ownerName" | "email" | "phone" | "city";

export type OwnerProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};
