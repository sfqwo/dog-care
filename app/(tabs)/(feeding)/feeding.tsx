import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Input } from "@/packages/ui/input/src";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  PetTabs,
  StatsBlock,
  StatsBlocks,
  SwipeableCardsList,
  SwipeableCardsListEmpty,
  SwipeableCardsListHeader,
  SwipeableCardsListItem,
  TimeRecorder,
  TimeRecorderButton,
  TimeRecorderHint,
  TimeRecorderRow,
  TimeRecorderTitle,
} from "@/src/components";
import type { Feeding } from "@/src/domain/types";
import { useFeedingCardDetails } from "@/src/hooks/useFeedingCardDetails";
import { useFeedingStats } from "@/src/hooks/useFeedingStats";
import { useProfileContext } from "@/src/hooks/profileContext";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { createUid, isPositiveNumber, formatDateTime } from "@dog-care/core/utils";
import { feedingStyles, pageGradient } from "./feeding.styles";
import type { FeedingListItemProps } from "./feeding.types";

type FeedingsByPet = Record<string, Feeding[]>;

export default function FeedingScreen() {
  const { profile } = useProfileContext();
  const [feedingsByPet, setFeedingsByPet] = useState<FeedingsByPet>({});
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [grams, setGrams] = useState("");
  const [food, setFood] = useState("");
  const hasPets = profile.pets.length > 0;
  const activePetId = hasPets ? selectedPetId ?? profile.pets[0]?.id ?? null : null;
  const items = activePetId ? feedingsByPet[activePetId] ?? [] : [];
  const stats = useFeedingStats(items);

  useEffect(() => {
    loadJSON<FeedingsByPet>(STORAGE_KEYS.FEEDING, {}).then((stored) => {
      setFeedingsByPet(stored ?? {});
    });
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.FEEDING, feedingsByPet);
  }, [feedingsByPet]);

  useEffect(() => {
    if (!profile.pets.length) {
      setSelectedPetId(null);
      return;
    }

    setSelectedPetId((current) => {
      if (current && profile.pets.some((pet) => pet.id === current)) return current;
      return profile.pets[0]?.id ?? null;
    });
  }, [profile.pets]);

  const canAddFeeding = useMemo(
    () => Boolean(activePetId) && isPositiveNumber(grams),
    [activePetId, grams]
  );

  const handleAddFeeding = () => {
    if (!canAddFeeding || !activePetId) return;
    const newItem: Feeding = {
      id: createUid(),
      at: Date.now(),
      petId: activePetId,
      grams: Number(grams),
      food: food.trim() || undefined,
    };
    setFeedingsByPet((prev) => {
      const current = prev[activePetId] ?? [];
      return { ...prev, [activePetId]: [newItem, ...current] };
    });
    setGrams("");
    setFood("");
  };

  const handleRemoveFeeding = (id: string) => {
    if (!activePetId) return;
    setFeedingsByPet((prev) => {
      const current = prev[activePetId] ?? [];
      const filtered = current.filter((feed) => feed.id !== id);
      if (filtered.length === current.length) return prev;
      return { ...prev, [activePetId]: filtered };
    });
  };

  const lastMealText = items[0] ? formatDateTime(items[0].at) : "Еще нет записей";
  const heroBadgeText = hasPets
    ? items.length
      ? "Сытый питомец"
      : "Пора покормить любимца"
    : "Добавьте питомца";
  const heroSubtitle = hasPets
    ? items.length
      ? `Последнее кормление: ${lastMealText}`
      : "Добавьте первую запись"
    : "Перейдите в профиль и заведите питомца.";
  const emptyStateText = hasPets
    ? "Журнал пуст — добавьте первую миску."
    : "Чтобы вести журнал, добавьте питомца.";

  return (
    <LinearGradient colors={pageGradient} style={feedingStyles.screenGradient}>
      <SafeAreaView style={feedingStyles.safeArea}>
        <SwipeableCardsList>
          <SwipeableCardsListHeader>
            <View style={{ gap: 18 }}>
              <HeroCard>
                <HeroCardTitle text="План кормлений" />
                <HeroCardSubtitle text={heroSubtitle} />
                <HeroCardBadge text={heroBadgeText} />
              </HeroCard>

              <PetTabs pets={profile.pets} selectedId={activePetId} onSelect={setSelectedPetId} />

              <StatsBlocks>
                <StatsBlock label="Приемов" value={items.length} />
                <StatsBlock label="Суммарно" value={`${stats.totalGrams} г`} />
                <StatsBlock label="Среднее" value={`${stats.avgGrams} г`} />
              </StatsBlocks>

              <TimeRecorder>
                <TimeRecorderTitle>Записать кормление</TimeRecorderTitle>
                <TimeRecorderRow>
                  <Input
                    value={grams}
                    onChangeText={setGrams}
                    placeholder="Граммы (например 120)"
                    keyboardType="number-pad"
                    editable={Boolean(activePetId)}
                  />
                  <TimeRecorderButton label="Добавить" onPress={handleAddFeeding} disabled={!canAddFeeding} />
                </TimeRecorderRow>
                <Input
                  value={food}
                  onChangeText={setFood}
                  placeholder="Корм или вкусняшка (опционально)"
                  editable={Boolean(activePetId)}
                />
                <TimeRecorderHint visible={!activePetId}>
                  Добавьте питомца в профиле, чтобы вести записи кормления.
                </TimeRecorderHint>
              </TimeRecorder>
            </View>
          </SwipeableCardsListHeader>
          <SwipeableCardsListEmpty text={emptyStateText} />

          {items.map((item) => (
            <FeedingListItem key={item.id} feeding={item} onRemove={handleRemoveFeeding} />
          ))}
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}

function FeedingListItem({ feeding, onRemove }: FeedingListItemProps) {
  const {
    gradientColors,
    cardSubtitle,
    cardTitle,
    noteText,
  } = useFeedingCardDetails(feeding);

  const handleRemove = () => onRemove(feeding.id);

  return (
    <SwipeableCardsListItem
      id={feeding.id}
      title={cardTitle}
      subtitle={cardSubtitle}
      badgeText={`${feeding.grams} г`}
      note={noteText}
      gradientColors={gradientColors}
      badgeIcon="food-variant"
      noteIcon="silverware-fork-knife"
      onRemove={handleRemove}
      onPress={handleRemove}
    />
  );
}
