export type PetProfileFormState = {
  name: string;
  breed: string;
  species: string;
  gender: string;
  birthdate: string;
  weight: string;
  notes: string;
};

export type PetProfileModalProps = {
  visible: boolean;
  onClose: () => void;
};
