import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { createUid } from "@dog-care/core/utils";
import { PetProfileModal } from "@/src/components/petProfileModal";
import { OwnerProfileModal } from "../../components";
import type { ProfileContextValue } from "./types";

const DEFAULT_PROFILE: ProfileContextValue["profile"] = {
  ownerName: "",
  email: "",
  phone: "",
  birthdate: "",
  pets: [],
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<ProfileContextValue["profile"]>(DEFAULT_PROFILE);
  const [editingPet, setEditingPet] = useState<ProfileContextValue["editingPet"] | null>(null);
  const [petModalVisible, setPetModalVisible] = useState(false);
  const [ownerModalVisible, setOwnerModalVisible] = useState(false);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    loadJSON<ProfileContextValue["profile"]>(
      STORAGE_KEYS.PROFILE,
      DEFAULT_PROFILE,
    ).then((data) => {
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

  const addPet = useCallback<ProfileContextValue["addPet"]>((pet) => {
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

  const updatePet = useCallback<ProfileContextValue["updatePet"]>((updatedPet) => {
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

  const removePet = useCallback<ProfileContextValue["removePet"]>((id) => {
    setProfile((prev) => ({ ...prev, pets: prev.pets.filter((pet) => pet.id !== id) }));
    setEditingPet((current) => {
      if (current?.id === id) {
        setPetModalVisible(false);
        return null;
      }
      return current;
    });
  }, []);

  const updateOwner = useCallback<ProfileContextValue["updateOwner"]>((nextProfile) => {
    setProfile((prevProfile) => ({ ...prevProfile, ...nextProfile }));
  }, []);

  const openEditOwnerModal = useCallback(() => {
    setOwnerModalVisible(true);
  }, []);

  const openAddPetModal = useCallback(() => {
    setEditingPet(null);
    setPetModalVisible(true);
  }, []);

  const openEditPetModal = useCallback<ProfileContextValue["openEditPetModal"]>((pet) => {
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

  useEffect(() => {
    if (!profile.pets.length) {
      setSelectedPetId(null);
      return;
    }
    setSelectedPetId((current) => {
      if (current && profile.pets.some((pet) => pet.id === current)) {
        return current;
      }
      return profile.pets[0]?.id ?? null;
    });
  }, [profile.pets]);

  const handleSelectPet = useCallback((id: string | null) => {
    setSelectedPetId(id);
  }, []);

  const value = useMemo(
    () => ({
      profile,
      editingPet,
      selectedPetId,
      setSelectedPetId: handleSelectPet,
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
      selectedPetId,
      handleSelectPet,
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
