import { useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
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
import type { Feeding } from "@/src/domain/types";
import { useFeedingCardDetails } from "@/src/hooks/useFeedingCardDetails";
import { useFeedingStats } from "@/src/hooks/useFeedingStats";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import { formatDateTime } from "@/src/ui/format";
import { createUid, isPositiveNumber } from "@/src/utils";
import { feedingStyles, pageGradient } from "./feeding.styles";

type FeedingListItemProps = {
  feeding: Feeding;
  onRemove: (id: string) => void;
}

export default function FeedingScreen() {
  const [items, setItems] = useState<Feeding[]>([]);
  const [grams, setGrams] = useState("");
  const [food, setFood] = useState("");
  const stats = useFeedingStats(items);

  useEffect(() => {
    loadJSON<Feeding[]>(STORAGE_KEYS.FEEDING, []).then(setItems);
  }, []);

  useEffect(() => {
    saveJSON(STORAGE_KEYS.FEEDING, items);
  }, [items]);

  const canAddFeeding = useMemo(() => isPositiveNumber(grams), [grams]);

  const handleAddFeeding = () => {
    if (!canAddFeeding) return;
    const newItem: Feeding = {
      id: createUid(),
      at: Date.now(),
      grams: Number(grams),
      food: food.trim() || undefined,
    };
    setItems((p) => [newItem, ...p]);
    setGrams("");
    setFood("");
  };

  const handleRemoveFeeding = (id: string) => setItems((p) => p.filter((x) => x.id !== id));

  const lastMealText = items[0] ? formatDateTime(items[0].at) : "Еще нет записей";
  const heroBadgeText = items.length ? "Сытый пёс" : "Пора покормить питомца";
  const heroSubtitle = items.length
    ? `Последнее кормление: ${lastMealText}`
    : "Добавьте первую запись";

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
                  />
                  <TimeRecorderButton label="Добавить" onPress={handleAddFeeding} disabled={!canAddFeeding} />
                </TimeRecorderRow>
                <Input
                  value={food}
                  onChangeText={setFood}
                  placeholder="Корм или вкусняшка (опционально)"
                />
              </TimeRecorder>
            </View>
          </SwipeableCardsListHeader>
          <SwipeableCardsListEmpty text="Журнал пуст — добавьте первую миску." />

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
      durationIcon="food-variant"
      noteIcon="silverware-fork-knife"
      onRemove={handleRemove}
    />
  );
}
