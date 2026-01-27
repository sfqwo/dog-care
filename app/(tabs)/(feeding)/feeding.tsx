import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import {
  createUid,
  isPositiveNumber,
  formatDateTime,
} from "@dog-care/core/utils";
import type { Feeding } from "@dog-care/types";
import {
  useFeedingCardDetails,
  useFeedingStats,
  useProfileContext,
} from "@/src/hooks";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { Input } from "@/packages/ui/input";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  PetTabs,
  StatsBlock,
  StatsBlocks,
  Hint,
  SwipeableCardsList,
  SwipeableCardsListEmpty,
  SwipeableCardsListHeader,
  SwipeableCardsListItem,
  TimeRecorder,
  TimeRecorderButton,
  TimeRecorderRow,
  TimeRecorderTitle,
} from "@/src/components";
import { feedingStyles, pageGradient } from "./feeding.styles";
import type { FeedingListItemProps } from "./feeding.types";

type FeedingsByPet = Record<string, Feeding[]>;

export default function FeedingScreen() {
  const { profile, selectedPetId } = useProfileContext();
  const [feedingsByPet, setFeedingsByPet] = useState<FeedingsByPet>({});
  const [grams, setGrams] = useState("");
  const [food, setFood] = useState("");
  const hasPets = profile.pets.length > 0;
  const items = selectedPetId ? feedingsByPet[selectedPetId] ?? [] : [];
  const stats = useFeedingStats(items);

  useEffect(() => {
    loadJSON<FeedingsByPet>(STORAGE_KEYS.FEEDING, {}).then((stored) => {
      setFeedingsByPet(stored ?? {});
    });
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.FEEDING, feedingsByPet);
  }, [feedingsByPet]);

  const canAddFeeding = useMemo(
    () => Boolean(selectedPetId) && isPositiveNumber(grams),
    [selectedPetId, grams]
  );

  const handleAddFeeding = () => {
    if (!canAddFeeding || !selectedPetId) return;
    const newItem: Feeding = {
      id: createUid(),
      at: Date.now(),
      petId: selectedPetId,
      grams: Number(grams),
      food: food.trim() || undefined,
    };
    setFeedingsByPet((prev) => {
      const current = prev[selectedPetId] ?? [];
      return { ...prev, [selectedPetId]: [newItem, ...current] };
    });
    setGrams("");
    setFood("");
  };

  const handleRemoveFeeding = (id: string) => {
    if (!selectedPetId) return;
    setFeedingsByPet((prev) => {
      const current = prev[selectedPetId] ?? [];
      const filtered = current.filter((feed) => feed.id !== id);
      if (filtered.length === current.length) return prev;
      return { ...prev, [selectedPetId]: filtered };
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

              <PetTabs />

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
                    editable={Boolean(selectedPetId)}
                  />
                  <TimeRecorderButton label="Добавить" onPress={handleAddFeeding} disabled={!canAddFeeding} />
                </TimeRecorderRow>
                <Input
                  value={food}
                  onChangeText={setFood}
                  placeholder="Корм или вкусняшка (опционально)"
                  editable={Boolean(selectedPetId)}
                />
                <Hint visible={!selectedPetId}>
                  Добавьте питомца в профиле, чтобы вести записи кормления.
                </Hint>
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
