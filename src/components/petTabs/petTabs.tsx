import { memo } from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getSpeciesLabel } from "@dog-care/core/shared";
import type { PetTabsProps } from "./types";
import { styles } from "./styles";

function PetTabsComponent({ pets, selectedId, onSelect }: PetTabsProps) {
  if (!pets.length) {
    return (
      <View style={styles.emptyCard}>
        <View style={styles.emptyIconCircle}>
          <MaterialCommunityIcons name="paw" size={22} style={styles.emptyIcon} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.emptyTitle}>Нет питомцев</Text>
          <Text style={styles.emptySubtitle}>
            Добавьте питомца в профиле, чтобы вести отдельные журналы прогулок.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabsGrid}>
      {pets.map((pet) => {
        const isActive = pet.id === selectedId;
        const speciesLabel = getSpeciesLabel(pet.species) ?? "Питомец";
        const iconName = pet.species ?? "dog";

        return (
          <Pressable
            key={pet.id}
            style={({ pressed }) => [
              styles.tabCard,
              isActive && styles.tabCardActive,
              pressed && styles.tabCardPressed,
            ]}
            onPress={() => onSelect(pet.id)}
          >
            <View style={styles.tabHeader}>
              <View style={[styles.iconPill, isActive && styles.iconPillActive]}>
                <MaterialCommunityIcons
                  name={iconName as any}
                  size={18}
                  style={[styles.icon, isActive && styles.iconActive]}
                />
              </View>
              <Text style={[styles.petName, isActive && styles.petNameActive]} numberOfLines={1}>
                {pet.name}
              </Text>
            </View>
            <Text style={styles.petMeta} numberOfLines={1}>
              {pet.breed?.trim() || speciesLabel}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const PetTabs = memo(PetTabsComponent);