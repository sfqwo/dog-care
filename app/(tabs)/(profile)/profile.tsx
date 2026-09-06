import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import {
  formatGender,
  formatWeight,
  getSpeciesLabel,
} from "@dog-care/core/shared";
import type { Pet } from "@dog-care/domain";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  OwnerProfileCard,
  SwipeableCardsList,
  SwipeableCardsListEmpty,
  SwipeableCardsListHeader,
  SwipeableCardsListItemBadge,
  SwipeableCardsListItemFooter,
  SwipeableCardsListItemHeader,
  SwipeableCardsListItemHelper,
  SwipeableCardsListItem,
  SwipeableCardsListItemNote,
  SwipeableCardsListItemSubtitle,
  SwipeableCardsListItemTextBlock,
  SwipeableCardsListItemTitle,
} from "@/src/components";
import { useProfileContext } from "@/src/hooks";
import { useAuthContext } from "@/src/hooks/authContext";
import { useInformer } from "@/src/components/informer";
import { getAuthErrorMessage } from "@/src/hooks/authContext/utils";
import { profileStyles, pageGradient, petGradient } from "@/src/screens/tabs/profile/profile.styles";
import type { PetListItemProps } from "@/src/screens/tabs/profile/profile.types";
import { buildPetNote } from "@/src/screens/tabs/profile/utils";

export default function ProfileScreen() {
  const { user, signOut } = useAuthContext();
  const { showInformer, showSuccess } = useInformer();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const {
    profile,
    removePet,
    openEditOwnerModal,
    openAddPetModal,
    openEditPetModal,
  } = useProfileContext();

  const heroSubtitle = profile.ownerName
    ? `Владелец: ${profile.ownerName}`
    : "Расскажите немного о себе";
  const heroBadgeText = profile.pets.length
    ? `${profile.pets.length} питомца`
    : "Добавьте первого питомца";

  const openOwnerModal = () => openEditOwnerModal();
  const handleEditPet = (pet: Pet) => openEditPetModal(pet);
  const handleAddPet = () => openAddPetModal();
  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut();
      showSuccess("Вы вышли из аккаунта");
    } catch (error) {
      showInformer(getAuthErrorMessage(error), "error");
      setIsSigningOut(false);
    }
  };

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

              <View style={profileStyles.accountSection}>
                <View style={profileStyles.accountText}>
                  <Text style={profileStyles.sectionTitle}>Аккаунт</Text>
                  <Text style={profileStyles.accountEmail}>{user?.email ?? "Email не указан"}</Text>
                </View>
                <TouchableOpacity
                  accessibilityRole="button"
                  style={profileStyles.signOutButton}
                  disabled={isSigningOut}
                  onPress={handleSignOut}
                >
                  <Text style={profileStyles.signOutButtonText}>
                    {isSigningOut ? "Выходим..." : "Выйти"}
                  </Text>
                </TouchableOpacity>
              </View>

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

function PetListItem({ pet, onRemove, onEdit }: PetListItemProps) {
  const subtitleParts = [
    getSpeciesLabel(pet.species),
    pet.breed,
    formatGender(pet.gender),
  ];
  const subtitle =
    subtitleParts.filter(Boolean).join(" • ") || "Информация о виде и породе не указана";

  const weightLabel = pet.weight?.trim();
  const badgeText = weightLabel
    ? formatWeight(weightLabel)
    : getSpeciesLabel(pet.species) ?? "Любимый друг";

  const { note, noteIcon } = buildPetNote(pet);

  const handleRemove = () => onRemove(pet.id);
  const handleEdit = () => onEdit(pet);

  return (
    <SwipeableCardsListItem
      id={pet.id}
      gradientColors={petGradient}
      onRemove={handleRemove}
      onPress={handleEdit}
    >
      <SwipeableCardsListItemHeader>
        <SwipeableCardsListItemTextBlock>
          <SwipeableCardsListItemTitle text={pet.name} />
          <SwipeableCardsListItemSubtitle text={subtitle} />
        </SwipeableCardsListItemTextBlock>
        <SwipeableCardsListItemBadge text={badgeText} />
      </SwipeableCardsListItemHeader>
      <SwipeableCardsListItemNote text={note} icon={noteIcon} />
      <SwipeableCardsListItemFooter>
        <SwipeableCardsListItemHelper text="Тап — открыть • свайп влево — кнопка удаления" />
      </SwipeableCardsListItemFooter>
    </SwipeableCardsListItem>
  );
}
