import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
import { LinearGradient } from "expo-linear-gradient";
import { useProfileContext } from "@/src/hooks/profileContext";
import { useWalkCardDetails } from "@/src/hooks/useWalkCardDetails";
import { useWalkStats } from "@/src/hooks/useWalkStats";
import { createUid, isPositiveNumber, formatDateTime } from "@dog-care/core/utils";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import type { Walk } from "@/src/domain/types";
import { pageGradient, walkStyles } from "./walks.styles";
import type { WalkListItemProps } from "./walks.types";

type WalksByPet = Record<string, Walk[]>;

export default function WalksScreen() {
  const { profile } = useProfileContext();
  const [walksByPet, setWalksByPet] = useState<WalksByPet>({});
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [durationMin, setDurationMin] = useState("");
  const [note, setNote] = useState("");
  const hasPets = profile.pets.length > 0;
  const activePetId = hasPets ? selectedPetId ?? profile.pets[0]?.id ?? null : null;
  const currentWalks = activePetId ? walksByPet[activePetId] ?? [] : [];
  const stats = useWalkStats(currentWalks);

  useEffect(() => {
    loadJSON<WalksByPet>(STORAGE_KEYS.WALKS, {}).then((stored) => {
      setWalksByPet(stored ?? {});
    });
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.WALKS, walksByPet);
  }, [walksByPet]);

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

  const canAddWalk = useMemo(
    () => Boolean(activePetId) && isPositiveNumber(durationMin),
    [activePetId, durationMin]
  );

  const handleAddWalk = () => {
    if (!canAddWalk || !activePetId) return;
    const newItem: Walk = {
      id: createUid(),
      startedAt: Date.now(),
      petId: activePetId,
      durationMin: Number(durationMin),
      note: note.trim() || undefined,
    };
    setWalksByPet((prev) => {
      const nextWalks = [newItem, ...(prev[activePetId] ?? [])];
      return { ...prev, [activePetId]: nextWalks };
    });
    setDurationMin("");
    setNote("");
  };

  const handleRemoveWalk = (id: string) => {
    if (!activePetId) return;
    setWalksByPet((prev) => {
      const current = prev[activePetId] ?? [];
      const filtered = current.filter((walk) => walk.id !== id);
      if (filtered.length === current.length) return prev;
      return { ...prev, [activePetId]: filtered };
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

              <PetTabs
                pets={profile.pets}
                selectedId={activePetId}
                onSelect={(id) => setSelectedPetId(id)}
              />

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
                    editable={Boolean(activePetId)}
                  />
                  <TimeRecorderButton label="Добавить" onPress={handleAddWalk} disabled={!canAddWalk} />
                </TimeRecorderRow>
                <Input
                  value={note}
                  onChangeText={setNote}
                  placeholder="Заметка (опционально)"
                  multiline
                  editable={Boolean(activePetId)}
                />
                <TimeRecorderHint visible={!activePetId}>
                  Добавьте питомца в профиле и выберите его, чтобы вести записи.
                </TimeRecorderHint>
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
