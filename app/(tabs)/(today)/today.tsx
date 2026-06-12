import { useCallback, useEffect, useMemo, useState } from "react";
import { View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  REMINDER_CATEGORY_LABELS,
  getReminderRoute,
} from "@dog-care/core/shared";
import {
  buildReminderStats,
  formatDateTime,
  getDayPlanReminders,
  isBeforeToday,
  isSameLocalDay,
} from "@dog-care/core/utils";
import type {
  CompletedCareTask,
  Feeding,
  Reminder,
  ReminderCategory,
  VetRecord,
  Walk,
} from "@dog-care/types";
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
} from "@/src/components";
import { useProfileContext } from "@/src/hooks";
import {
  completeReminderInList,
  removeReminderFromList,
} from "@/src/services/reminderActions";
import { loadJSON, saveJSON } from "@/src/storage/jsonStorage";
import { STORAGE_KEYS } from "@/src/storage/keys";
import {
  dueGradient,
  overdueGradient,
  pageGradient,
  planGradient,
  todayStyles,
} from "./today.styles";
import type { TodayCompletedItemProps, TodayPlanItemProps } from "./today.types";

type RemindersByPet = Record<string, Reminder[]>;
type FeedingsByPet = Record<string, Feeding[]>;
type WalksByPet = Record<string, Walk[]>;
type VetRecordsByPet = Record<string, VetRecord[]>;

const CATEGORY_ICONS: Record<ReminderCategory, ReminderCardIcon> = {
  feeding: "food-variant",
  walk: "walk",
  vet: "medical-bag",
  treatment: "pill",
  other: "bell-outline",
};

type ReminderCardIcon =
  | "food-variant"
  | "walk"
  | "medical-bag"
  | "pill"
  | "bell-outline"
  | "check-circle-outline";

export default function TodayScreen() {
  const { profile, selectedPetId } = useProfileContext();
  const [remindersByPet, setRemindersByPet] = useState<RemindersByPet>({});
  const [feedingsByPet, setFeedingsByPet] = useState<FeedingsByPet>({});
  const [walksByPet, setWalksByPet] = useState<WalksByPet>({});
  const [vetRecordsByPet, setVetRecordsByPet] = useState<VetRecordsByPet>({});
  const [storageLoaded, setStorageLoaded] = useState(false);
  const hasPets = profile.pets.length > 0;
  const reminders = useMemo(
    () => (selectedPetId ? remindersByPet[selectedPetId] ?? [] : []),
    [remindersByPet, selectedPetId]
  );
  const planItems = useMemo(() => getDayPlanReminders(reminders), [reminders]);
  const completedItems = useMemo(
    () =>
      buildCompletedTodayItems({
        selectedPetId,
        feedingsByPet,
        walksByPet,
        vetRecordsByPet,
      }),
    [feedingsByPet, selectedPetId, vetRecordsByPet, walksByPet]
  );
  const stats = useMemo(() => buildReminderStats(reminders), [reminders]);
  const plannedLaterToday = Math.max(stats.today - stats.dueNow, 0);
  const nextItem = planItems[0];

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      Promise.all([
        loadJSON<RemindersByPet>(STORAGE_KEYS.REMINDERS, {}),
        loadJSON<FeedingsByPet>(STORAGE_KEYS.FEEDING, {}),
        loadJSON<WalksByPet>(STORAGE_KEYS.WALKS, {}),
        loadJSON<VetRecordsByPet>(STORAGE_KEYS.VET, {}),
      ]).then(([storedReminders, storedFeedings, storedWalks, storedVet]) => {
        if (!isActive) return;
        setRemindersByPet(storedReminders ?? {});
        setFeedingsByPet(storedFeedings ?? {});
        setWalksByPet(storedWalks ?? {});
        setVetRecordsByPet(storedVet ?? {});
        setStorageLoaded(true);
      });
      return () => {
        isActive = false;
      };
    }, [])
  );

  useEffect(() => {
    if (!storageLoaded) return;
    saveJSON(STORAGE_KEYS.REMINDERS, remindersByPet);
  }, [remindersByPet, storageLoaded]);

  const handleOpenReminder = (reminder: Reminder) => {
    router.push(getReminderRoute(reminder.category));
  };

  const handleCompleteReminder = async (id: string) => {
    if (!selectedPetId) return;
    const nextList = await completeReminderInList(reminders, id);
    setRemindersByPet((prev) => {
      if (nextList === reminders) return prev;
      return { ...prev, [selectedPetId]: nextList };
    });
  };

  const handleRemoveReminder = async (id: string) => {
    if (!selectedPetId) return;
    const nextList = await removeReminderFromList(reminders, id);
    setRemindersByPet((prev) => {
      if (nextList === reminders) return prev;
      return { ...prev, [selectedPetId]: nextList };
    });
  };

  const heroSubtitle = hasPets
    ? nextItem
      ? `Ближайшее дело: ${formatDateTime(nextItem.dueAt)}`
      : "На сегодня нет запланированных дел"
    : "Добавьте питомца, чтобы видеть план ухода.";
  const heroBadgeText = hasPets
    ? planItems.length
      ? `Дел: ${planItems.length}`
      : "Свободный день"
    : "Нет питомцев";
  const emptyStateText = hasPets
    ? "На сегодня нет дел. Добавьте напоминание, чтобы оно появилось здесь."
    : "Чтобы видеть план на день, добавьте питомца в профиле.";

  return (
    <LinearGradient colors={pageGradient} style={todayStyles.screenGradient}>
      <SafeAreaView style={todayStyles.safeArea}>
        <SwipeableCardsList>
          <SwipeableCardsListHeader>
            <View style={{ gap: 18 }}>
              <HeroCard>
                <HeroCardTitle text="План на день" />
                <HeroCardSubtitle text={heroSubtitle} />
                <HeroCardBadge text={heroBadgeText} />
              </HeroCard>

              <PetTabs />

              <StatsBlocks>
                <StatsBlock label="К выполнению" value={stats.dueNow} />
                <StatsBlock label="Позже сегодня" value={plannedLaterToday} />
                <StatsBlock label="Сделано" value={completedItems.length} />
              </StatsBlocks>
            </View>
          </SwipeableCardsListHeader>

          <SwipeableCardsListEmpty text={emptyStateText} />

          {planItems.map((reminder) => (
            <TodayPlanItem
              key={reminder.id}
              reminder={reminder}
              onOpen={handleOpenReminder}
              onComplete={handleCompleteReminder}
              onRemove={handleRemoveReminder}
            />
          ))}

          {completedItems.map((item) => (
            <TodayCompletedItem key={item.id} item={item} />
          ))}
        </SwipeableCardsList>
      </SafeAreaView>
    </LinearGradient>
  );
}

function TodayPlanItem({
  reminder,
  onOpen,
  onComplete,
  onRemove,
}: TodayPlanItemProps) {
  const now = Date.now();
  const isOverdue = isBeforeToday(reminder.dueAt, now);
  const isDueNow = reminder.dueAt <= now && !isOverdue;
  const statusText = isOverdue ? "Просрочено" : isDueNow ? "К выполнению" : "Сегодня";
  const gradientColors = isOverdue ? overdueGradient : isDueNow ? dueGradient : planGradient;

  return (
    <SwipeableCardsListItem
      id={reminder.id}
      title={reminder.title}
      subtitle={`${REMINDER_CATEGORY_LABELS[reminder.category]} • ${formatDateTime(reminder.dueAt)}`}
      badgeText={statusText}
      note={reminder.note}
      gradientColors={gradientColors}
      badgeIcon={CATEGORY_ICONS[reminder.category]}
      noteIcon="calendar-check-outline"
      helperIcon="check-circle-outline"
      helperText="Тап — открыть раздел • свайп влево — удалить"
      checkLabel="Отметить"
      checked={false}
      onCheckPress={() => onComplete(reminder.id)}
      onPress={() => onOpen(reminder)}
      onLongPress={() => onComplete(reminder.id)}
      onRemove={() => onRemove(reminder.id)}
    />
  );
}

function TodayCompletedItem({ item }: TodayCompletedItemProps) {
  return (
    <SwipeableCardsListItem
      id={item.id}
      title={item.title}
      subtitle={`${item.detail ?? getCompletedSourceLabel(item.source)} • ${formatDateTime(item.completedAt)}`}
      badgeText="Сделано"
      note={item.note}
      gradientColors={planGradient}
      badgeIcon={getCompletedSourceIcon(item)}
      helperIcon="checkbox-marked"
      helperText="Отмечено сегодня"
      onRemove={() => {}}
    />
  );
}

function buildCompletedTodayItems({
  selectedPetId,
  feedingsByPet,
  walksByPet,
  vetRecordsByPet,
}: {
  selectedPetId: string | null;
  feedingsByPet: FeedingsByPet;
  walksByPet: WalksByPet;
  vetRecordsByPet: VetRecordsByPet;
}) {
  if (!selectedPetId) return [];
  const now = Date.now();
  const feedingItems = (feedingsByPet[selectedPetId] ?? [])
    .filter((item) => isSameLocalDay(item.at, now))
    .map<CompletedCareTask>((item) => ({
      id: `feeding-${item.id}`,
      petId: item.petId,
      title: "Кормление",
      completedAt: item.at,
      source: "feeding",
      category: "feeding",
      detail: `${item.grams} г`,
      note: item.food,
    }));
  const walkItems = (walksByPet[selectedPetId] ?? [])
    .filter((item) => isSameLocalDay(item.startedAt, now))
    .map<CompletedCareTask>((item) => ({
      id: `walk-${item.id}`,
      petId: item.petId,
      title: "Прогулка",
      completedAt: item.startedAt,
      source: "walk",
      category: "walk",
      detail: `${item.durationMin} мин`,
      note: item.note,
    }));
  const vetItems = (vetRecordsByPet[selectedPetId] ?? [])
    .filter((item) => isSameLocalDay(item.at, now))
    .map<CompletedCareTask>((item) => ({
      id: `vet-${item.id}`,
      petId: item.petId,
      title: item.title,
      completedAt: item.at,
      source: "vet",
      category: "vet",
      detail: item.clinic ?? "Вет",
      note: item.note,
    }));

  return [...feedingItems, ...walkItems, ...vetItems]
    .sort((a, b) => b.completedAt - a.completedAt);
}

function getCompletedSourceLabel(source: CompletedCareTask["source"]) {
  if (source === "feeding") return "Кормление";
  if (source === "walk") return "Прогулка";
  if (source === "vet") return "Вет";
  return "Напоминание";
}

function getCompletedSourceIcon(item: CompletedCareTask): ReminderCardIcon {
  if (item.category) return CATEGORY_ICONS[item.category];
  if (item.source === "feeding") return "food-variant";
  if (item.source === "walk") return "walk";
  if (item.source === "vet") return "medical-bag";
  return "check-circle-outline";
}
