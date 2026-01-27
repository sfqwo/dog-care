import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import { Input } from "@/packages/ui/input";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  PetTabs,
  Hint,
  StatsBlock,
  StatsBlocks,
  SwipeableCardsList,
  SwipeableCardsListEmpty,
  SwipeableCardsListHeader,
  SwipeableCardsListItem,
  TimeRecorder,
  TimeRecorderButton,
  TimeRecorderRow,
  TimeRecorderTitle,
} from "@/src/components";
import {
  useProfileContext,
  useWalkCardDetails,
  useWalkStats,
} from "@/src/hooks";
import {
  createUid,
  isPositiveNumber,
  formatDateTime,
} from "@dog-care/core/utils";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import type { Walk } from "@dog-care/types";
import { pageGradient, walkStyles } from "./walks.styles";
import type { WalkListItemProps } from "./walks.types";

type WalksByPet = Record<string, Walk[]>;

export default function WalksScreen() {
  const { profile, selectedPetId } = useProfileContext();
  const [walksByPet, setWalksByPet] = useState<WalksByPet>({});
  const [durationMin, setDurationMin] = useState("");
  const [note, setNote] = useState("");
  const hasPets = profile.pets.length > 0;
  const currentWalks = selectedPetId ? walksByPet[selectedPetId] ?? [] : [];
  const stats = useWalkStats(currentWalks);

  useEffect(() => {
    loadJSON<WalksByPet>(STORAGE_KEYS.WALKS, {}).then((stored) => {
      setWalksByPet(stored ?? {});
    });
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.WALKS, walksByPet);
  }, [walksByPet]);

  const canAddWalk = useMemo(
    () => Boolean(selectedPetId) && isPositiveNumber(durationMin),
    [selectedPetId, durationMin]
  );

  const handleAddWalk = () => {
    if (!canAddWalk || !selectedPetId) return;
    const newItem: Walk = {
      id: createUid(),
      startedAt: Date.now(),
      petId: selectedPetId,
      durationMin: Number(durationMin),
      note: note.trim() || undefined,
    };
    setWalksByPet((prev) => {
      const nextWalks = [newItem, ...(prev[selectedPetId] ?? [])];
      return { ...prev, [selectedPetId]: nextWalks };
    });
    setDurationMin("");
    setNote("");
  };

  const handleRemoveWalk = (id: string) => {
    if (!selectedPetId) return;
    setWalksByPet((prev) => {
      const current = prev[selectedPetId] ?? [];
      const filtered = current.filter((walk) => walk.id !== id);
      if (filtered.length === current.length) return prev;
      return { ...prev, [selectedPetId]: filtered };
    });
  };

  const lastWalkText = currentWalks[0] ? formatDateTime(currentWalks[0].startedAt) : "Еще нет записей";
  const heroBadgeText = hasPets
    ? currentWalks.length
      ? "Свежий воздух"
      : "Готовы гулять?"
    : "Добавьте питомца";
  const heroBadgeSubtitle = hasPets
    ? currentWalks.length
      ? `Последняя прогулка: ${lastWalkText}`
      : "Добавьте первую прогулку"
    : "Перейдите в профиль и добавьте питомца, чтобы вести прогулки.";
  const emptyStateText = hasPets
    ? "Список пуст — начните с короткой прогулки и сохраните её здесь."
    : "Заведите питомца, чтобы отслеживать прогулки.";

  return (
    <LinearGradient colors={pageGradient} style={walkStyles.screenGradient}>
      <SafeAreaView style={walkStyles.safeArea}>
        <SwipeableCardsList>
          <SwipeableCardsListHeader>
            <View style={{ gap: 18 }}>
              <HeroCard>
                <HeroCardTitle text="План прогулок" />
                <HeroCardSubtitle text={heroBadgeSubtitle} />
                <HeroCardBadge text={heroBadgeText} />
              </HeroCard>

              <PetTabs />

              <StatsBlocks>
                <StatsBlock label="Прогулок" value={currentWalks.length} />
                <StatsBlock label="Минут суммарно" value={stats.totalMinutes} />
                <StatsBlock label="Среднее время" value={`${stats.avgDuration} мин`} />
              </StatsBlocks>

              <TimeRecorder>
                <TimeRecorderTitle>Записать прогулку</TimeRecorderTitle>
                <TimeRecorderRow>
                  <Input
                    value={durationMin}
                    onChangeText={setDurationMin}
                    placeholder="Минуты (например 25)"
                    keyboardType="number-pad"
                    editable={Boolean(selectedPetId)}
                  />
                  <TimeRecorderButton label="Добавить" onPress={handleAddWalk} disabled={!canAddWalk} />
                </TimeRecorderRow>
                <Input
                  value={note}
                  onChangeText={setNote}
                  placeholder="Заметка (опционально)"
                  multiline
                  editable={Boolean(selectedPetId)}
                />
                <Hint visible={!selectedPetId}>
                  Добавьте питомца в профиле и выберите его, чтобы вести записи.
                </Hint>
              </TimeRecorder>
            </View>
          </SwipeableCardsListHeader>
          <SwipeableCardsListEmpty text={emptyStateText} />
          {currentWalks.map((item) => (
            <WalkListItem key={item.id} walk={item} onRemove={handleRemoveWalk} />
          ))}
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}

function WalkListItem({ walk, onRemove }: WalkListItemProps) {
  const { gradientColors, cardSubtitle, cardTitle } = useWalkCardDetails(walk);

  const handleRemove = () => onRemove(walk.id);

  return (
    <SwipeableCardsListItem
      id={walk.id}
      title={cardTitle}
      subtitle={cardSubtitle}
      badgeText={`${walk.durationMin} мин`}
      note={walk.note}
      gradientColors={gradientColors}
      onRemove={handleRemove}
    />
  );
}
