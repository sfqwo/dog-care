import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  Pet,
  PetProfilePayload,
  UserProfile,
  UserProfilePayload,
} from "@/src/domain/types";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { createUid } from "@/src/utils/createUid";
import { PetProfileModal } from "@/src/components/petProfileModal";
import { OwnerProfileModal } from "../components";

type ProfileContextValue = {
  profile: UserProfile;
  editingPet: Pet | null;
  addPet: (pet: PetProfilePayload) => void;
  updatePet: (pet: Pet) => void;
  removePet: (id: string) => void;
  updateOwner: (profile: UserProfilePayload) => void;
  openEditOwnerModal: () => void;
  openAddPetModal: () => void;
  openEditPetModal: (pet: Pet) => void;
};

const DEFAULT_PROFILE: UserProfile = {
  ownerName: "",
  email: "",
  phone: "",
  birthdate: "",
  city: "",
  pets: [],
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [petModalVisible, setPetModalVisible] = useState(false);
  const [ownerModalVisible, setOwnerModalVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    loadJSON<UserProfile>(STORAGE_KEYS.PROFILE, DEFAULT_PROFILE).then((data) => {
      if (isMounted) {
        setProfile(data ?? DEFAULT_PROFILE);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.PROFILE, profile);
  }, [profile]);

  const addPet = useCallback((pet: PetProfilePayload) => {
    setProfile((prev) => ({
      ...prev,
      pets: [
        {
          ...pet,
          id: createUid(),
        },
        ...prev.pets,
      ],
    }));
  }, []);

  const updatePet = useCallback((updatedPet: Pet) => {
    setProfile((prev) => ({
      ...prev,
      pets: prev.pets.map((pet) =>
        pet.id === updatedPet.id
          ? {
              ...pet,
              ...updatedPet
            }
          : pet
      ),
    }));
  }, []);

  const removePet = useCallback((id: string) => {
    setProfile((prev) => ({ ...prev, pets: prev.pets.filter((pet) => pet.id !== id) }));
    setEditingPet((current) => {
      if (current?.id === id) {
        setPetModalVisible(false);
        return null;
      }
      return current;
    });
  }, []);

  const updateOwner = useCallback((nextProfile: UserProfilePayload) => {
    setProfile((prevProfile) => ({ ...prevProfile, ...nextProfile }));
  }, []);

  const openEditOwnerModal = useCallback(() => {
    setOwnerModalVisible(true);
  }, []);

  const openAddPetModal = useCallback(() => {
    setEditingPet(null);
    setPetModalVisible(true);
  }, []);

  const openEditPetModal = useCallback((pet: Pet) => {
    setEditingPet(pet);
    setPetModalVisible(true);
  }, []);

  const closePetModal = useCallback(() => {
    setPetModalVisible(false);
    setEditingPet(null);
  }, []);

  const closeOwnerModal = useCallback(() => {
    setOwnerModalVisible(false);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      editingPet,
      addPet,
      updatePet,
      removePet,
      updateOwner,
      openEditOwnerModal,
      openAddPetModal,
      openEditPetModal,
    }),
    [
      profile,
      editingPet,
      addPet,
      updatePet,
      removePet,
      updateOwner,
      openEditOwnerModal,
      openAddPetModal,
      openEditPetModal,
    ]
  );

  return (
    <ProfileContext.Provider value={value}>
      {children}
      <PetProfileModal
        visible={petModalVisible}
        onClose={closePetModal}
      />
      <OwnerProfileModal
        visible={ownerModalVisible}
        onClose={closeOwnerModal}
      />
    </ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider.");
  }
  return context;
}

export { DEFAULT_PROFILE };
