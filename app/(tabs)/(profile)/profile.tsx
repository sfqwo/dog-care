import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  OwnerProfileCard,
  SwipeableCardsList,
  SwipeableCardsListEmpty,
  SwipeableCardsListHeader,
  SwipeableCardsListItem,
} from "@/src/components";
import type { Pet } from "@/src/domain/types";
import { ProfileProvider, useProfileContext } from "@/src/hooks/profileContext";
import { profileStyles, pageGradient, petGradient } from "./profile.styles";
import { formatGender, formatWeight } from "@/src/utils";

export default function ProfileScreen() {
  return (
    <ProfileProvider>
      <ProfileScreenContent />
    </ProfileProvider>
  );
}

function ProfileScreenContent() {
  const {
    profile,
    removePet,
    openEditOwnerModal,
    openAddPetModal,
    openEditPetModal,
  } = useProfileContext();

  const cityLabel = profile.city?.trim() ? ` • ${profile.city.trim()}` : "";
  const heroSubtitle = profile.ownerName
    ? `Владелец: ${profile.ownerName}${cityLabel}`
    : "Расскажите немного о себе";
  const heroBadgeText = profile.pets.length
    ? `${profile.pets.length} питомца`
    : "Добавьте первого питомца";

  const openOwnerModal = () => openEditOwnerModal();
  const handleEditPet = (pet: Pet) => openEditPetModal(pet);
  const handleAddPet = () => openAddPetModal();

  return (
    <LinearGradient colors={pageGradient} style={profileStyles.screenGradient}>
      <SafeAreaView style={profileStyles.safeArea}>
        <SwipeableCardsList>
          <SwipeableCardsListHeader>
            <View style={profileStyles.contentGap}>
              <HeroCard>
                <HeroCardTitle text="Профиль владельца" />
                <HeroCardSubtitle text={heroSubtitle} />
                <HeroCardBadge text={heroBadgeText} />
              </HeroCard>

              <OwnerProfileCard profile={profile} onEdit={openOwnerModal} />

              <Text style={profileStyles.listTitle}>Мои питомцы</Text>
            </View>
          </SwipeableCardsListHeader>

          <SwipeableCardsListEmpty
            text="Еще нет питомцев — добавьте любимца, чтобы отслеживать его дела."
          />

          {profile.pets.map((pet) => (
            <PetListItem
              key={pet.id}
              pet={pet}
              onRemove={removePet}
              onEdit={handleEditPet}
            />
          ))}

          <View style={profileStyles.formCard}>
            <Text style={profileStyles.sectionTitle}>Добавить питомца</Text>
            <Text style={profileStyles.editingLabel}>
              Добавьте любимца, чтобы отслеживать прогулки, кормления и визиты.
            </Text>
            <TouchableOpacity style={profileStyles.button} onPress={handleAddPet}>
              <Text style={profileStyles.buttonText}>Добавить питомца</Text>
            </TouchableOpacity>
          </View>
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}

type PetListItemProps = {
  pet: Pet;
  onRemove: (id: string) => void;
  onEdit: (pet: Pet) => void;
};

function PetListItem({ pet, onRemove, onEdit }: PetListItemProps) {
  const subtitleParts = [pet.species, pet.breed, formatGender(pet.gender)];
  const subtitle =
    subtitleParts.filter(Boolean).join(" • ") || "Информация о виде и породе не указана";

  const weightLabel = pet.weight?.trim();
  const badgeText = weightLabel
    ? formatWeight(weightLabel)
    : pet.species ?? "Любимый друг";

  const { note, noteIcon } = buildPetNote(pet);

  const handleRemove = () => onRemove(pet.id);
  const handleEdit = () => onEdit(pet);

  return (
    <SwipeableCardsListItem
      id={pet.id}
      title={pet.name}
      subtitle={subtitle}
      badgeText={badgeText}
      gradientColors={petGradient}
      onRemove={handleRemove}
      onPress={handleEdit}
      note={note}
      noteIcon={noteIcon}
    />
  );
}

function buildPetNote(pet: Pet) {
  if (pet.notes?.trim()) {
    return { note: `Заметки: ${pet.notes.trim()}`, noteIcon: "note-edit-outline" as const };
  }
  if (pet.birthdate?.trim()) {
    return { note: `Дата рождения: ${pet.birthdate.trim()}`, noteIcon: "cake-variant" as const };
  }
  return { note: undefined, noteIcon: "account" as const };
}
