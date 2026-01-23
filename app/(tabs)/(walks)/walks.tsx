import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@dog-care/input";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
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
import { LinearGradient } from "expo-linear-gradient";
import { useWalkCardDetails } from "@/src/hooks/useWalkCardDetails";
import { useWalkStats } from "@/src/hooks/useWalkStats";
import { createUid, isPositiveNumber, formatDateTime } from "@/src/utils";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import type { Walk } from "@/src/domain/types";
import { pageGradient, walkStyles } from "./walks.styles";
import type { WalkListItemProps } from "./walks.types";

export default function WalksScreen() {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [durationMin, setDurationMin] = useState("");
  const [note, setNote] = useState("");
  const stats = useWalkStats(walks);

  useEffect(() => {
    loadJSON<Walk[]>(STORAGE_KEYS.WALKS, []).then(setWalks);
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.WALKS, walks);
  }, [walks]);

  const canAddWalk = useMemo(() => isPositiveNumber(durationMin), [durationMin]);

  const handleAddWalk = () => {
    if (!canAddWalk) return;
    const newItem: Walk = {
      id: createUid(),
      startedAt: Date.now(),
      durationMin: Number(durationMin),
      note: note.trim() || undefined,
    };
    setWalks((prev) => [newItem, ...prev]);
    setDurationMin("");
    setNote("");
  };

  const handleRemoveWalk = (id: string) => setWalks((prev) => prev.filter((w) => w.id !== id));

  const lastWalkText = walks[0] ? formatDateTime(walks[0].startedAt) : "Еще нет записей";
  const heroBadgeText = walks.length ? "Свежий воздух" : "Готовы гулять?";
  const heroBadgeSubtitle = walks.length
    ? `Последняя прогулка: ${lastWalkText}`
    : "Добавьте первую прогулку";

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

              <StatsBlocks>
                <StatsBlock label="Прогулок" value={walks.length} />
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
                  />
                  <TimeRecorderButton label="Добавить" onPress={handleAddWalk} disabled={!canAddWalk} />
                </TimeRecorderRow>
                <Input
                  value={note}
                  onChangeText={setNote}
                  placeholder="Заметка (опционально)"
                  multiline
                />
              </TimeRecorder>
            </View>
          </SwipeableCardsListHeader>
          <SwipeableCardsListEmpty text="Список пуст — начните с короткой прогулки и сохраните её здесь." />
          {walks.map((item) => (
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
