import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  HeroCard,
  HeroCardBadge,
  HeroCardSubtitle,
  HeroCardTitle,
  Input,
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
import { useWalkCardDetails } from "@/src/hooks/useWalkCardDetails";
import { createUid } from "@/src/utils/createUid";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import type { Walk } from "@/src/domain/types";
import { formatDateTime } from "@/src/ui/format";
import { pageGradient, walkStyles } from "./walks.styles";
import { LinearGradient } from "expo-linear-gradient";

export default function WalksScreen() {
  const [walks, setWalks] = useState<Walk[]>([]);
  const [durationMin, setDurationMin] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    loadJSON<Walk[]>(STORAGE_KEYS.WALKS, []).then(setWalks);
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.WALKS, walks);
  }, [walks]);

  const canAdd = useMemo(() => {
    const n = Number(durationMin);
    return Number.isFinite(n) && n > 0;
  }, [durationMin]);

  const stats = useMemo(() => {
    if (!walks.length) return { totalMinutes: 0, avgDuration: 0, longest: 0 };
    const totalMinutes = walks.reduce((sum, walk) => sum + walk.durationMin, 0);
    const avgDuration = Math.max(1, Math.round(totalMinutes / walks.length));
    const longest = walks.reduce((max, walk) => Math.max(max, walk.durationMin), 0);
    return { totalMinutes, avgDuration, longest };
  }, [walks]);

  const addWalk = () => {
    if (!canAdd) return;
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

  const removeWalk = (id: string) => setWalks((prev) => prev.filter((w) => w.id !== id));

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
                <StatsBlock label="Средняя длительность" value={`${stats.avgDuration} мин`} />
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
                  <TimeRecorderButton label="Добавить" onPress={addWalk} disabled={!canAdd} />
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
            <WalkListItem key={item.id} walk={item} onRemove={removeWalk} />
          ))}
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}

function WalkListItem({ walk, onRemove }: { walk: Walk; onRemove: (id: string) => void }) {
  const { gradientColors, durationLabel, startedAtText } = useWalkCardDetails(walk);

  return (
    <SwipeableCardsListItem
      id={walk.id}
      title={startedAtText}
      subtitle={durationLabel}
      durationText={`${walk.durationMin} мин`}
      note={walk.note}
      gradientColors={gradientColors}
      onRemove={() => onRemove(walk.id)}
    />
  );
}
